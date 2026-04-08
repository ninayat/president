import type { Card, Combo, TrickState, Player, RankedPlayer, Rank } from './types.js';
import { rankValue } from './card.js';

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validates that a set of cards forms a legal combo:
 * - 1, 2, or 3 cards of identical rank → normal combo
 * - exactly 4 cards of identical rank → bomb
 */
export function validateCombo(cards: Card[]): ValidationResult & { combo?: Combo } {
  if (cards.length === 0) return { valid: false, reason: 'Aucune carte sélectionnée' };
  if (cards.length > 4) return { valid: false, reason: 'Trop de cartes' };

  const rank = cards[0]!.rank;
  if (!cards.every(c => c.rank === rank)) {
    return { valid: false, reason: 'Les cartes doivent avoir la même valeur' };
  }

  const isBomb = cards.length === 4;
  const isTwo = rank === '2';

  if (!isBomb && cards.length > 3) {
    return { valid: false, reason: 'Maximum 3 cartes (hors bombe)' };
  }

  return {
    valid: true,
    combo: { cards, rank, isBomb, isTwo },
  };
}

/**
 * Can this combo be played on top of the current trick?
 */
export function canPlay(
  trick: TrickState,
  combo: Combo,
  playerId: string,
): ValidationResult {
  // Ne peut pas jouer si on a déjà passé ce pli
  if (trick.passedPlayerIds.includes(playerId)) {
    return { valid: false, reason: 'Vous avez déjà passé ce pli' };
  }

  // Bombe : coupe tout, pas de contrainte de taille/rang
  if (combo.isBomb) {
    return { valid: true };
  }

  // Taille du combo doit correspondre à celle du pli ouvert
  if (combo.cards.length !== trick.currentComboSize) {
    return {
      valid: false,
      reason: `Vous devez jouer exactement ${trick.currentComboSize} carte(s)`,
    };
  }

  // Pas encore de combo posé : premier du pli, tout est valide
  if (!trick.lastCombo) {
    return { valid: true };
  }

  // Règle "X ou rien" : rang verrouillé
  if (trick.lockedRank !== null && !combo.isTwo) {
    if (combo.rank !== trick.lockedRank) {
      return {
        valid: false,
        reason: `Vous devez jouer un ${trick.lockedRank} ou passer`,
      };
    }
  }

  // Le 2 coupe tout (hors bombe déjà géré)
  if (combo.isTwo) {
    return { valid: true };
  }

  // Doit battre le dernier combo
  if (rankValue(combo.rank) <= rankValue(trick.lastCombo.rank)) {
    return {
      valid: false,
      reason: 'Votre combo doit avoir une valeur supérieure',
    };
  }

  return { valid: true };
}

/**
 * Returns the updated lockedRank after a combo is played.
 * "X ou rien" s'active quand deux combos consécutifs ont le même rang.
 */
export function computeLockedRank(trick: TrickState, newCombo: Combo): Rank | null {
  if (newCombo.isBomb || newCombo.isTwo) return null;
  if (!trick.lastCombo) return null;
  if (trick.lastCombo.rank === newCombo.rank) return newCombo.rank;
  return null; // rang différent → verrou levé
}

/**
 * Is the trick over?
 * - Bombe jouée
 * - Tous les joueurs encore en jeu ont passé (sauf le dernier à avoir joué)
 */
export function isTrickOver(trick: TrickState, activePlayers: Player[]): boolean {
  if (!trick.lastCombo) return false;

  // Bombe toujours fin immédiate
  if (trick.lastCombo.isBomb) return true;

  // Nombre de joueurs qui n'ont pas encore fini la partie
  const stillIn = activePlayers.filter(p => !p.finishOrder && p.hand.length > 0);
  // Tous sauf le dernier à avoir joué ont passé
  const lastPlayerId = trick.pile[trick.pile.length - 1]?.cards[0]
    ? trick.leaderId // fallback
    : trick.leaderId;

  // On récupère l'id du dernier joueur ayant posé
  const pileLen = trick.pile.length;
  if (pileLen === 0) return false;

  // Les joueurs encore actifs qui ne sont pas celui qui a posé en dernier
  const waitingPlayers = stillIn.filter(p => p.id !== trick.leaderId);
  const allPassed = waitingPlayers.every(p => trick.passedPlayerIds.includes(p.id));

  return allPassed;
}

/**
 * Determine if the round is over (only 1 player left with cards)
 */
export function isRoundOver(players: Player[]): boolean {
  const withCards = players.filter(p => p.hand.length > 0 && !p.finishOrder);
  return withCards.length <= 1;
}

/**
 * Compute final rankings for the round.
 * Finishing with a 2 forces the player to last place.
 */
export function computeRankings(
  players: Player[],
  finishedOrder: string[],
): RankedPlayer[] {
  // Le dernier joueur restant est ajouté à la fin
  const lastPlayer = players.find(p => !finishedOrder.includes(p.id));
  const fullOrder = lastPlayer
    ? [...finishedOrder, lastPlayer.id]
    : [...finishedOrder];

  // Joueurs qui ont fini avec un 2 → rétrogradés en dernier
  const finishedWithTwo = players
    .filter(p => p.finishedWithTwo)
    .map(p => p.id);

  // Construire l'ordre final : retirer les "deux" puis les réappend en dernier
  const baseOrder = fullOrder.filter(id => !finishedWithTwo.includes(id));
  const finalOrder = [...baseOrder, ...finishedWithTwo];

  const count = finalOrder.length;

  return finalOrder.map((id, idx) => {
    const player = players.find(p => p.id === id)!;
    const position = idx + 1;
    let role: import('./types.js').PlayerRole;

    if (position === 1) role = 'president';
    else if (position === 2 && count >= 4) role = 'vice-president';
    else if (position === count) role = 'tdc';
    else if (position === count - 1 && count >= 4) role = 'vice-tdc';
    else role = 'neutral';

    return { id, name: player.name, role, finishOrder: position };
  });
}
