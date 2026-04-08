import { create } from 'zustand';
import type { ClientGameState, Card } from '@president/game-logic';

interface PendingExchange {
  cards: Card[];   // cartes reçues des TDC/VTDC
  count: number;   // nombre à rendre
}

interface GameStore {
  gameState: ClientGameState | null;
  myHand: Card[];
  selectedCardIds: Set<string>;
  pendingExchange: PendingExchange | null;
  lastError: string | null;

  setGameState: (state: ClientGameState) => void;
  setHand: (hand: Card[]) => void;
  toggleCard: (cardId: string) => void;
  clearSelection: () => void;
  setPendingExchange: (ex: PendingExchange | null) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  myHand: [],
  selectedCardIds: new Set(),
  pendingExchange: null,
  lastError: null,

  setGameState: state => set({ gameState: state }),
  setHand: hand => set({ myHand: hand }),

  toggleCard: cardId => {
    const selected = new Set(get().selectedCardIds);
    if (selected.has(cardId)) {
      selected.delete(cardId);
    } else {
      selected.add(cardId);
    }
    set({ selectedCardIds: selected });
  },

  clearSelection: () => set({ selectedCardIds: new Set() }),
  setPendingExchange: ex => set({ pendingExchange: ex }),
  setError: msg => set({ lastError: msg }),
  reset: () =>
    set({
      gameState: null,
      myHand: [],
      selectedCardIds: new Set(),
      pendingExchange: null,
      lastError: null,
    }),
}));
