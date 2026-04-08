import type { Server, Socket } from 'socket.io';
import { getRoomBySocket, leaveRoom, getPlayersArray } from '../roomManager.js';
import { DISCONNECT_TIMEOUT_MS } from '@president/game-logic';
import { registerLobbyHandlers } from './lobbyHandler.js';
import { registerGameHandlers } from './gameHandler.js';

export function registerConnectionHandlers(io: Server, socket: Socket): void {
  registerLobbyHandlers(io, socket);
  registerGameHandlers(io, socket);

  socket.on('disconnect', () => {
    const room = getRoomBySocket(socket.id);
    if (!room) return;

    if (room.phase === 'lobby') {
      const result = leaveRoom(socket.id);
      if (result) {
        io.to(result.room.code).emit('lobby:playerLeft', { playerId: socket.id });
        io.to(result.room.code).emit('lobby:playersUpdate', {
          players: getPlayersArray(result.room).map(p => ({
            id: p.playerId,
            name: p.name,
            isHost: p.socketId === result.room.hostSocketId,
          })),
        });
      }
      return;
    }

    // Partie en cours : marquer déconnecté, timer 60s
    if (room.gameState) {
      const player = room.gameState.players.find(p => {
        const rp = room.players.get(socket.id);
        return rp && p.id === rp.playerId;
      });
      if (player) {
        player.connected = false;
        io.to(room.code).emit('game:playerDisconnected', {
          playerId: player.id,
          timeoutMs: DISCONNECT_TIMEOUT_MS,
        });

        const timer = setTimeout(() => {
          room.disconnectTimers.delete(socket.id);
          // Le joueur est définitivement parti — auto-pass géré par le turn timer
        }, DISCONNECT_TIMEOUT_MS);

        room.disconnectTimers.set(socket.id, timer);
      }
    }
  });
}
