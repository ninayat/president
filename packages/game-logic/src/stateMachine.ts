import type { GameState, Player, Card, TrickState } from './types.js';
import { deal, sortHand } from './deck.js';
import { rankValue } from './card.js';
import {
  validateCombo,
  canPlay,
  computeLockedRank,
  isTrickOver,
  isRoundOver,
  computeRankings,
} from './rules.js';
import {
  buildExchangeState,
  applyOffers,
  applyReturns,
  isExchangeComplete,
  validateReturn,
} from './exchange.js';

export type GameAction =
  | { type: 'DEAL_CARDS' }
  | { type: 'START_EXCHANGE' }
  | { type: 'SUBMIT_EXCHANGE'; playerId: string }           // TDC/VTDC → auto best cards
  | { type: 'RETURN_EXCHANGE'; playerId: string; cards: Card[] } // Président/VP → choix
  | { type: 'PLAY_COMBO'; playerId: string; cards: Card[] }
  | { type: 'PASS'; playerId: string }
  | { type: 'NEXT_TRICK'; winnerId: string }
  | { type: 'NEXT_ROUND' };

export interface ActionResult {
  state: GameState;
  error?: string;
}

function findPlayerIndex(state: GameState, playerId: string): number {
  return state.players.findIndex(p => p.id === playerId);
}

function nextActivePlayer(state: GameState, fromIndex: number): number {
  const count = state.players.length;
  for (let i = 1; i < count; i++) {
    const idx = (fromIndex + i) % count;
    const p = state.players[idx]!;
    if (p.hand.length > 0 && !p.finishOrder) return idx;
  }
  return fromIndex;
}

function removeCardsFromHand(hand: Card[], toRemove: Card[]): Card[] {
  const removeIds = new Set(toRemove.map(c => c.id));
  return hand.filter(c => !removeIds.has(c.id));
}

/** Crée un pli vide ouvert par `leaderId` avec la taille `comboSize` */
function openTrick(leaderId: string, comboSize: number): TrickState {
  return {
    leaderId,
    currentComboSize: comboSize,
    lockedRank: null,
    lastCombo: null,
    passedPlayerIds: [],
    pile: [],
  };
}

export function gameReducer(state: GameState, action: GameAction): ActionResult {
  switch (action.type) {
    case 'DEAL_CARDS': {
      const hands = deal(state.players.length);
      // Trouver qui a le 3 de trèfle
      let startIndex = 0;
      for (let i = 0; i < hands.length; i++) {
        if (hands[i]!.some(c => c.id === 'clubs_3')) {
          startIndex = i;
          break;
        }
      }
      const players = state.players.map((p, i) => ({
        ...p,
        hand: hands[i]!,
        finishOrder: null,
        finishedWithTwo: false,
      }));
      return {
        state: {
          ...state,
          players,
          phase: 'playing',
          currentTurnIndex: startIndex,
          trick: openTrick(players[startIndex]!.id, 0), // taille inconnue avant premier coup
          finishedPlayerIds: [],
          pendingExchange: null,
          roundNumber: state.roundNumber,
        },
      };
    }

    case 'START_EXCHANGE': {
      const exchange = buildExchangeState(state.players);
      // Appliquer automatiquement les offres (TDC/VTDC donnent leurs meilleures cartes)
      const playersAfterOffers = applyOffers(state.players, exchange);
      // Marquer les offres comme données
      const updatedExchange = {
        ...exchange,
        offers: exchange.offers.map(o => ({ ...o, given: true })),
      };
      return {
        state: {
          ...state,
          phase: 'exchange',
          players: playersAfterOffers,
          pendingExchange: updatedExchange,
        },
      };
    }

    case 'RETURN_EXCHANGE': {
      if (!state.pendingExchange) return { state, error: 'Pas déchange en cours' };

      const retIdx = state.pendingExchange.returns.findIndex(
        r => r.fromId === action.playerId && !r.done,
      );
      if (retIdx === -1) return { state, error: 'Ce joueur ne doit pas rendre de cartes' };

      const ret = state.pendingExchange.returns[retIdx]!;
      const player = state.players.find(p => p.id === action.playerId)!;
      const expectedCount = ret.toId ===
        state.pendingExchange.offers.find(o => o.toId === action.playerId)?.fromId
          ? state.pendingExchange.offers.find(o => o.fromId === ret.toId)?.cards.length ?? 0
          : state.pendingExchange.offers.find(o => o.toId === action.playerId)?.cards.length ?? 0;

      // Compter depuis les offres
      const offerForThis = state.pendingExchange.offers.find(o => o.toId === action.playerId);
      const count = offerForThis?.cards.length ?? 0;

      if (!validateReturn(player.hand, action.cards, count)) {
        return { state, error: 'Cartes invalides pour le retour' };
      }

      const updatedReturns = state.pendingExchange.returns.map((r, i) =>
        i === retIdx ? { ...r, cards: action.cards, done: true } : r,
      );

      const updatedExchange = { ...state.pendingExchange, returns: updatedReturns };

      if (isExchangeComplete(updatedExchange)) {
        // Appliquer tous les retours
        const playersAfterReturns = applyReturns(state.players, updatedExchange);
        // Trouver le Président pour ouvrir le pli
        const presidentIdx = playersAfterReturns.findIndex(p => p.role === 'president');
        const startIdx = presidentIdx >= 0 ? presidentIdx : 0;
        return {
          state: {
            ...state,
            phase: 'playing',
            players: playersAfterReturns.map(p => ({ ...p, hand: sortHand(p.hand) })),
            pendingExchange: null,
            currentTurnIndex: startIdx,
            trick: openTrick(playersAfterReturns[startIdx]!.id, 0),
            finishedPlayerIds: [],
          },
        };
      }

      return {
        state: {
          ...state,
          pendingExchange: updatedExchange,
        },
      };
    }

    case 'PLAY_COMBO': {
      if (state.phase !== 'playing') return { state, error: 'Pas en phase de jeu' };

      const playerIdx = findPlayerIndex(state, action.playerId);
      if (playerIdx !== state.currentTurnIndex) {
        return { state, error: "Ce n'est pas votre tour" };
      }

      const { valid, combo, reason } = validateCombo(action.cards);
      if (!valid || !combo) return { state, error: reason };

      const trick = state.trick ?? openTrick(action.playerId, action.cards.length);

      // Premier coup du pli : définit la taille
      const currentTrick: TrickState =
        trick.lastCombo === null && trick.currentComboSize === 0
          ? { ...trick, currentComboSize: combo.cards.length }
          : trick;

      if (currentTrick.lastCombo !== null) {
        const canPlayResult = canPlay(currentTrick, combo, action.playerId);
        if (!canPlayResult.valid) return { state, error: canPlayResult.reason };
      }

      // Retirer les cartes de la main
      const newHand = removeCardsFromHand(state.players[playerIdx]!.hand, action.cards);
      const finishedNow = newHand.length === 0;
      const finishedWithTwo = finishedNow && combo.isTwo;

      const finishOrder = finishedNow
        ? state.finishedPlayerIds.length + 1
        : null;

      const updatedPlayers = state.players.map((p, i) =>
        i === playerIdx
          ? {
              ...p,
              hand: newHand,
              finishOrder: finishedNow ? finishOrder : p.finishOrder,
              finishedWithTwo: finishedNow ? finishedWithTwo : p.finishedWithTwo,
            }
          : p,
      );

      const newFinishedIds = finishedNow
        ? [...state.finishedPlayerIds, action.playerId]
        : state.finishedPlayerIds;

      // Mettre à jour le lockedRank
      const newLockedRank = computeLockedRank(currentTrick, combo);

      const updatedTrick: TrickState = {
        ...currentTrick,
        leaderId: action.playerId, // dernier à avoir joué
        lastCombo: combo,
        lockedRank: newLockedRank,
        pile: [...currentTrick.pile, combo],
        passedPlayerIds: currentTrick.passedPlayerIds,
      };

      // Vérifier si le pli est terminé (bombe ou joueurs restants)
      const trickOver = updatedTrick.lastCombo?.isBomb ||
        isTrickOver(updatedTrick, updatedPlayers.filter(p => !p.finishOrder || p.id === action.playerId));

      // Vérifier si le tour est terminé
      const roundOver = isRoundOver(updatedPlayers);

      if (roundOver) {
        const rankings = computeRankings(updatedPlayers, newFinishedIds);
        return {
          state: {
            ...state,
            phase: 'round-over',
            players: updatedPlayers.map(p => {
              const r = rankings.find(rr => rr.id === p.id);
              return r ? { ...p, role: r.role, finishOrder: r.finishOrder } : p;
            }),
            trick: updatedTrick,
            finishedPlayerIds: newFinishedIds,
          },
        };
      }

      if (trickOver) {
        // Le gagnant du pli est le dernier à avoir joué
        const nextTurnIdx = findPlayerIndex({ ...state, players: updatedPlayers }, action.playerId);
        return {
          state: {
            ...state,
            players: updatedPlayers,
            trick: updatedTrick,
            finishedPlayerIds: newFinishedIds,
            currentTurnIndex: nextTurnIdx,
          },
        };
      }

      // Tour suivant
      const nextIdx = nextActivePlayer({ ...state, players: updatedPlayers }, playerIdx);

      return {
        state: {
          ...state,
          players: updatedPlayers,
          trick: updatedTrick,
          finishedPlayerIds: newFinishedIds,
          currentTurnIndex: nextIdx,
        },
      };
    }

    case 'PASS': {
      if (state.phase !== 'playing') return { state, error: 'Pas en phase de jeu' };

      const playerIdx = findPlayerIndex(state, action.playerId);
      if (playerIdx !== state.currentTurnIndex) {
        return { state, error: "Ce n'est pas votre tour" };
      }

      if (!state.trick?.lastCombo) {
        return { state, error: "On ne peut pas passer en début de pli" };
      }

      const updatedTrick: TrickState = {
        ...state.trick,
        passedPlayerIds: [...state.trick.passedPlayerIds, action.playerId],
      };

      const trickOver = isTrickOver(
        updatedTrick,
        state.players.filter(p => p.hand.length > 0 && !p.finishOrder),
      );

      if (trickOver) {
        // Le gagnant est le leaderId du trick (dernier à avoir joué)
        const winnerId = updatedTrick.leaderId;
        const winnerIdx = findPlayerIndex(state, winnerId);
        return {
          state: {
            ...state,
            trick: updatedTrick,
            currentTurnIndex: winnerIdx,
          },
        };
      }

      const nextIdx = nextActivePlayer(state, playerIdx);
      return {
        state: {
          ...state,
          trick: updatedTrick,
          currentTurnIndex: nextIdx,
        },
      };
    }

    case 'NEXT_TRICK': {
      const winnerIdx = findPlayerIndex(state, action.winnerId);
      const winner = state.players[winnerIdx];
      if (!winner) return { state, error: 'Gagnant introuvable' };

      return {
        state: {
          ...state,
          trick: openTrick(action.winnerId, 0),
          currentTurnIndex: winnerIdx,
        },
      };
    }

    case 'NEXT_ROUND': {
      if (state.phase !== 'round-over') return { state, error: 'Pas en fin de manche' };
      const needsExchange = state.players.some(p => p.role === 'tdc');
      return {
        state: {
          ...state,
          roundNumber: state.roundNumber + 1,
          phase: needsExchange ? 'waiting' : 'waiting',
          finishedPlayerIds: [],
          trick: null,
          players: state.players.map(p => ({
            ...p,
            hand: [],
            finishOrder: null,
            finishedWithTwo: false,
          })),
        },
      };
    }

    default:
      return { state };
  }
}

/** Crée un GameState initial pour une salle */
export function createInitialGameState(
  roomId: string,
  players: Array<{ id: string; name: string }>,
): GameState {
  return {
    roomId,
    phase: 'waiting',
    players: players.map(p => ({
      id: p.id,
      name: p.name,
      hand: [],
      role: null,
      finishOrder: null,
      connected: true,
      finishedWithTwo: false,
    })),
    roundNumber: 1,
    currentTurnIndex: 0,
    trick: null,
    finishedPlayerIds: [],
    pendingExchange: null,
  };
}

/** Projette un GameState en ClientGameState (sans les mains privées) */
export function toClientState(state: GameState): import('./types.js').ClientGameState {
  return {
    roomId: state.roomId,
    phase: state.phase,
    players: state.players.map(p => ({
      id: p.id,
      name: p.name,
      cardCount: p.hand.length,
      role: p.role,
      finishOrder: p.finishOrder,
      connected: p.connected,
    })),
    roundNumber: state.roundNumber,
    currentTurnPlayerId: state.players[state.currentTurnIndex]?.id ?? '',
    trick: state.trick,
    finishedPlayerIds: state.finishedPlayerIds,
    exchangeWaitingFor: state.pendingExchange
      ? state.pendingExchange.returns.filter(r => !r.done).map(r => r.fromId)
      : undefined,
  };
}
