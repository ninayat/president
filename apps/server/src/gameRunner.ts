import type { Server, Socket } from 'socket.io';
import type { Room } from './roomManager.js';
import {
  gameReducer,
  toClientState,
  createInitialGameState,
  TURN_TIMEOUT_MS,
  type Card,
} from '@president/game-logic';

function broadcastState(io: Server, room: Room): void {
  if (!room.gameState) return;
  const clientState = toClientState(room.gameState);
  io.to(room.code).emit('game:stateUpdate', { state: clientState });

  // Envoyer les mains privées à chaque joueur
  for (const [socketId, rp] of room.players) {
    const player = room.gameState.players.find(p => p.id === rp.playerId);
    if (player) {
      io.to(socketId).emit('game:yourHand', { hand: player.hand });
    }
  }
}

function startTurnTimer(io: Server, room: Room): void {
  if (room.turnTimer) clearTimeout(room.turnTimer);
  if (!room.gameState) return;

  const currentPlayerId =
    room.gameState.players[room.gameState.currentTurnIndex]?.id;
  if (!currentPlayerId) return;

  room.turnTimer = setTimeout(() => {
    if (!room.gameState) return;
    const result = gameReducer(room.gameState, {
      type: 'PASS',
      playerId: currentPlayerId,
    });
    room.gameState = result.state;
    broadcastState(io, room);
    startTurnTimer(io, room);
  }, TURN_TIMEOUT_MS);
}

export function startGame(io: Server, room: Room): void {
  const playerList = [...room.players.values()].map(p => ({
    id: p.playerId,
    name: p.name,
  }));

  room.gameState = createInitialGameState(room.code, playerList);
  room.phase = 'playing';

  const result = gameReducer(room.gameState, { type: 'DEAL_CARDS' });
  room.gameState = result.state;

  const clientState = toClientState(room.gameState);
  io.to(room.code).emit('game:started', { state: clientState });

  broadcastState(io, room);
  startTurnTimer(io, room);
}

export function handlePlayCards(
  io: Server,
  socket: Socket,
  room: Room,
  cardIds: string[],
): void {
  if (!room.gameState) return;

  const player = room.gameState.players.find(p => {
    const rp = room.players.get(socket.id);
    return rp && p.id === rp.playerId;
  });
  if (!player) return;

  // Récupérer les objets Card depuis la main du joueur
  const cards: Card[] = cardIds
    .map(id => player.hand.find(c => c.id === id))
    .filter((c): c is Card => !!c);

  if (cards.length !== cardIds.length) {
    socket.emit('game:error', { message: 'Carte(s) introuvable(s) dans votre main' });
    return;
  }

  const result = gameReducer(room.gameState, {
    type: 'PLAY_COMBO',
    playerId: player.id,
    cards,
  });

  if (result.error) {
    socket.emit('game:error', { message: result.error });
    return;
  }

  const prevPhase = room.gameState.phase;
  room.gameState = result.state;

  // Détecter fin de pli
  const trick = room.gameState.trick;
  if (trick?.lastCombo?.isBomb) {
    io.to(room.code).emit('game:trickOver', {
      winnerId: player.id,
      isBomb: true,
    });
  }

  broadcastState(io, room);

  if (room.gameState.phase === 'round-over') {
    const rankings = room.gameState.players.map(p => ({
      id: p.id,
      name: p.name,
      role: p.role,
      finishOrder: p.finishOrder,
    }));
    io.to(room.code).emit('game:roundOver', { rankings });
  } else if (room.gameState.phase === 'exchange') {
    // Notifier les échanges
    if (room.gameState.pendingExchange) {
      for (const offer of room.gameState.pendingExchange.offers) {
        const targetSocket = [...room.players.entries()].find(
          ([, rp]) => rp.playerId === offer.toId,
        )?.[0];
        if (targetSocket) {
          io.to(targetSocket).emit('game:exchangeRequest', {
            cards: offer.cards,
            fromRole: room.gameState.players.find(p => p.id === offer.fromId)?.role,
          });
        }
      }
    }
  } else {
    startTurnTimer(io, room);
  }
}

export function handlePass(io: Server, socket: Socket, room: Room): void {
  if (!room.gameState) return;
  const rp = room.players.get(socket.id);
  if (!rp) return;

  const result = gameReducer(room.gameState, {
    type: 'PASS',
    playerId: rp.playerId,
  });

  if (result.error) {
    socket.emit('game:error', { message: result.error });
    return;
  }

  const prevTrickLeader = room.gameState.trick?.leaderId;
  room.gameState = result.state;

  // Vérifier si le pli est terminé (trick leader change)
  const newLeader = room.gameState.trick?.leaderId;
  if (prevTrickLeader && newLeader === prevTrickLeader &&
    room.gameState.trick?.passedPlayerIds.length) {
    // Potentiellement fin de pli — vérification côté serveur déjà faite dans le reducer
  }

  broadcastState(io, room);
  startTurnTimer(io, room);
}

export function handleExchangeGive(
  io: Server,
  socket: Socket,
  room: Room,
  cardIds: string[],
): void {
  if (!room.gameState) return;
  const rp = room.players.get(socket.id);
  if (!rp) return;

  const player = room.gameState.players.find(p => p.id === rp.playerId);
  if (!player) return;

  const cards: Card[] = cardIds
    .map(id => player.hand.find(c => c.id === id))
    .filter((c): c is Card => !!c);

  const result = gameReducer(room.gameState, {
    type: 'RETURN_EXCHANGE',
    playerId: rp.playerId,
    cards,
  });

  if (result.error) {
    socket.emit('game:error', { message: result.error });
    return;
  }

  room.gameState = result.state;
  broadcastState(io, room);

  if (room.gameState.phase === 'playing') {
    startTurnTimer(io, room);
  }
}

export function handleNextRound(io: Server, room: Room): void {
  if (!room.gameState) return;

  const result = gameReducer(room.gameState, { type: 'NEXT_ROUND' });
  room.gameState = result.state;

  // S'il y a des rôles → démarrer l'échange, sinon dealer directement
  const hasRoles = room.gameState.players.some(p => p.role !== null);
  if (hasRoles) {
    const exchangeResult = gameReducer(room.gameState, { type: 'START_EXCHANGE' });
    room.gameState = exchangeResult.state;
    broadcastState(io, room);

    // Notifier les joueurs qui doivent rendre des cartes
    if (room.gameState.pendingExchange) {
      for (const ret of room.gameState.pendingExchange.returns) {
        const targetSocket = [...room.players.entries()].find(
          ([, rp]) => rp.playerId === ret.fromId,
        )?.[0];
        const count = room.gameState.pendingExchange.offers.find(
          o => o.toId === ret.fromId,
        )?.cards.length ?? 0;
        if (targetSocket) {
          io.to(targetSocket).emit('game:exchangeReturn', { count });
        }
      }
    }
  } else {
    const dealResult = gameReducer(room.gameState, { type: 'DEAL_CARDS' });
    room.gameState = dealResult.state;
    broadcastState(io, room);
    startTurnTimer(io, room);
  }
}
