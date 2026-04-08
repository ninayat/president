import type { Server, Socket } from 'socket.io';
import {
  createRoom,
  joinRoom,
  leaveRoom,
  getPlayersArray,
  getRoomBySocket,
} from '../roomManager.js';
import { startGame } from '../gameRunner.js';
import { MIN_PLAYERS } from '@president/game-logic';

export function registerLobbyHandlers(io: Server, socket: Socket): void {
  socket.on('lobby:create', ({ playerName }: { playerName: string }) => {
    if (!playerName?.trim()) {
      socket.emit('lobby:error', { message: 'Pseudo requis' });
      return;
    }

    const room = createRoom(socket.id, playerName.trim());
    socket.join(room.code);

    socket.emit('lobby:created', {
      roomCode: room.code,
      playerId: socket.id,
    });

    io.to(room.code).emit('lobby:playersUpdate', {
      players: getPlayersArray(room).map(p => ({
        id: p.playerId,
        name: p.name,
        isHost: p.socketId === room.hostSocketId,
      })),
    });
  });

  socket.on(
    'lobby:join',
    ({ roomCode, playerName }: { roomCode: string; playerName: string }) => {
      if (!playerName?.trim()) {
        socket.emit('lobby:error', { message: 'Pseudo requis' });
        return;
      }

      const result = joinRoom(roomCode, socket.id, playerName.trim());
      if ('error' in result) {
        socket.emit('lobby:error', { message: result.error });
        return;
      }

      const { room } = result;
      socket.join(room.code);

      socket.emit('lobby:joined', {
        roomCode: room.code,
        playerId: socket.id,
        players: getPlayersArray(room).map(p => ({
          id: p.playerId,
          name: p.name,
          isHost: p.socketId === room.hostSocketId,
        })),
      });

      socket.to(room.code).emit('lobby:playerJoined', {
        player: { id: socket.id, name: playerName.trim(), isHost: false },
      });

      io.to(room.code).emit('lobby:playersUpdate', {
        players: getPlayersArray(room).map(p => ({
          id: p.playerId,
          name: p.name,
          isHost: p.socketId === room.hostSocketId,
        })),
      });
    },
  );

  socket.on('lobby:start', () => {
    const room = getRoomBySocket(socket.id);
    if (!room) {
      socket.emit('lobby:error', { message: 'Salle introuvable' });
      return;
    }
    if (room.hostSocketId !== socket.id) {
      socket.emit('lobby:error', { message: 'Seul le host peut démarrer' });
      return;
    }
    if (room.players.size < MIN_PLAYERS) {
      socket.emit('lobby:error', {
        message: `Minimum ${MIN_PLAYERS} joueurs pour démarrer`,
      });
      return;
    }

    startGame(io, room);
  });
}
