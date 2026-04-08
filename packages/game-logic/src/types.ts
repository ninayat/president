export type Suit = 'clubs' | 'diamonds' | 'hearts' | 'spades';
export type Rank = '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A' | '2';
export type PlayerRole = 'president' | 'vice-president' | 'neutral' | 'vice-tdc' | 'tdc' | null;
export type RoundPhase = 'waiting' | 'exchange' | 'playing' | 'round-over';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string; // e.g. "hearts_A"
}

export interface Combo {
  cards: Card[];
  rank: Rank;
  isBomb: boolean;  // 4 cartes identiques
  isTwo: boolean;   // 2 coupe tout
}

export interface TrickState {
  leaderId: string;
  currentComboSize: number;       // 1, 2 ou 3
  lockedRank: Rank | null;        // "X ou rien" — null = libre
  lastCombo: Combo | null;
  passedPlayerIds: string[];
  pile: Combo[];                  // historique du pli
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  role: PlayerRole;
  finishOrder: number | null;
  connected: boolean;
  finishedWithTwo: boolean;
}

export interface ExchangeOffer {
  fromId: string;
  toId: string;
  cards: Card[];
  given: boolean;
}

export interface ExchangeReturn {
  fromId: string;
  toId: string;
  cards: Card[];
  done: boolean;
}

export interface ExchangeState {
  offers: ExchangeOffer[];   // TDC→Président, Vice-TDC→Vice-Président
  returns: ExchangeReturn[]; // Président→TDC, Vice-Président→Vice-TDC
}

export interface GameState {
  roomId: string;
  phase: RoundPhase;
  players: Player[];             // ordre des sièges
  roundNumber: number;
  currentTurnIndex: number;
  trick: TrickState | null;
  finishedPlayerIds: string[];   // ordre de sortie
  pendingExchange: ExchangeState | null;
}

// Version publique (sans les mains privées)
export interface PlayerPublic {
  id: string;
  name: string;
  cardCount: number;
  role: PlayerRole;
  finishOrder: number | null;
  connected: boolean;
}

export interface ClientGameState {
  roomId: string;
  phase: RoundPhase;
  players: PlayerPublic[];
  roundNumber: number;
  currentTurnPlayerId: string;
  trick: TrickState | null;
  finishedPlayerIds: string[];
  exchangeWaitingFor?: string[];
}

export interface RankedPlayer {
  id: string;
  name: string;
  role: PlayerRole;
  finishOrder: number;
}
