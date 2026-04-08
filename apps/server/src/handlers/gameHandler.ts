import type { Server, Socket } from 'socket.io';
import { getRoomBySocket } from '../roomManager.js';
import {
  handlePlayCards,
  handlePass,
  handleExchangeGive,
  handleNextRound,
} from '../gameRunner.js';

export function registerGameHandlers(io: Server, socket: Socket): void {
  socket.on('game:playCards', ({ cardIds }: { cardIds: string[] }) => {
    const room = getRoomBySocket(socket.id);
    if (!room || room.phase !== 'playing') return;
    handlePlayCards(io, socket, room, cardIds);
  });

  socket.on('game:pass', () => {
    const room = getRoomBySocket(socket.id);
    if (!room || room.phase !== 'playing') return;
    handlePass(io, socket, room);
  });

  socket.on('game:exchange:give', ({ cardIds }: { cardIds: string[] }) => {
    const room = getRoomBySocket(socket.id);
    if (!room) return;
    handleExchangeGive(io, socket, room, cardIds);
  });

  socket.on('game:ready', () => {
    const room = getRoomBySocket(socket.id);
    if (!room) return;

    // Compter combien de joueurs sont prêts
    if (!room.gameState) return;
    // Utiliser un ensemble de readyIds stocké dans la room
    (room as unknown as { readyIds?: Set<string> }).readyIds ??= new Set();
    const readyIds = (room as unknown as { readyIds: Set<string> }).readyIds;
    readyIds.add(socket.id);

    if (readyIds.size >= room.players.size) {
      readyIds.clear();
      handleNextRound(io, room);
    }
  });
}
