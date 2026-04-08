import type { GameState } from '@president/game-logic';

export interface RoomPlayer {
  socketId: string;
  playerId: string;
  name: string;
}

export interface Room {
  code: string;
  hostSocketId: string;
  players: Map<string, RoomPlayer>; // socketId → RoomPlayer
  gameState: GameState | null;
  phase: 'lobby' | 'playing';
  disconnectTimers: Map<string, ReturnType<typeof setTimeout>>;
  turnTimer: ReturnType<typeof setTimeout> | null;
}

const rooms = new Map<string, Room>();
// socketId → roomCode (pour retrouver la salle rapidement)
const socketToRoom = new Map<string, string>();

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code: string;
  do {
    code = Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)],
    ).join('');
  } while (rooms.has(code));
  return code;
}

export function createRoom(hostSocketId: string, hostName: string): Room {
  const code = generateCode();
  const playerId = hostSocketId;
  const room: Room = {
    code,
    hostSocketId,
    players: new Map([[hostSocketId, { socketId: hostSocketId, playerId, name: hostName }]]),
    gameState: null,
    phase: 'lobby',
    disconnectTimers: new Map(),
    turnTimer: null,
  };
  rooms.set(code, room);
  socketToRoom.set(hostSocketId, code);
  return room;
}

export function joinRoom(
  code: string,
  socketId: string,
  name: string,
): { room: Room } | { error: string } {
  const room = rooms.get(code.toUpperCase());
  if (!room) return { error: 'Salle introuvable' };
  if (room.phase === 'playing') return { error: 'Partie déjà en cours' };
  if (room.players.size >= 6) return { error: 'Salle pleine (max 6 joueurs)' };
  // Nom déjà pris ?
  if ([...room.players.values()].some(p => p.name === name)) {
    return { error: 'Ce pseudo est déjà pris' };
  }

  room.players.set(socketId, { socketId, playerId: socketId, name });
  socketToRoom.set(socketId, code);
  return { room };
}

export function leaveRoom(socketId: string): { room: Room; wasHost: boolean } | null {
  const code = socketToRoom.get(socketId);
  if (!code) return null;
  const room = rooms.get(code);
  if (!room) return null;

  const wasHost = room.hostSocketId === socketId;
  room.players.delete(socketId);
  socketToRoom.delete(socketId);

  if (room.players.size === 0) {
    rooms.delete(code);
    return null;
  }

  if (wasHost) {
    // Transférer le host au premier joueur restant
    room.hostSocketId = [...room.players.keys()][0]!;
  }

  return { room, wasHost };
}

export function getRoomBySocket(socketId: string): Room | null {
  const code = socketToRoom.get(socketId);
  return code ? (rooms.get(code) ?? null) : null;
}

export function getRoom(code: string): Room | null {
  return rooms.get(code.toUpperCase()) ?? null;
}

export function getPlayersArray(room: Room): RoomPlayer[] {
  return [...room.players.values()];
}
