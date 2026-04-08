import { create } from 'zustand';

export interface LobbyPlayer {
  id: string;
  name: string;
  isHost: boolean;
}

interface LobbyStore {
  players: LobbyPlayer[];
  setPlayers: (players: LobbyPlayer[]) => void;
  addPlayer: (player: LobbyPlayer) => void;
  removePlayer: (id: string) => void;
  reset: () => void;
}

export const useLobbyStore = create<LobbyStore>(set => ({
  players: [],
  setPlayers: players => set({ players }),
  addPlayer: player =>
    set(state => ({ players: [...state.players, player] })),
  removePlayer: id =>
    set(state => ({ players: state.players.filter(p => p.id !== id) })),
  reset: () => set({ players: [] }),
}));
