import { create } from 'zustand';

interface PlayerStore {
  playerId: string | null;
  playerName: string;
  roomCode: string | null;
  isHost: boolean;
  setPlayer: (id: string, name: string) => void;
  setRoom: (code: string, isHost: boolean) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerStore>(set => ({
  playerId: null,
  playerName: '',
  roomCode: null,
  isHost: false,
  setPlayer: (id, name) => set({ playerId: id, playerName: name }),
  setRoom: (code, isHost) => set({ roomCode: code, isHost }),
  reset: () => set({ playerId: null, playerName: '', roomCode: null, isHost: false }),
}));
