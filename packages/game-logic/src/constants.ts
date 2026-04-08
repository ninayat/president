import type { Rank, Suit } from './types.js';

export const RANK_ORDER: Rank[] = [
  '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2',
];

export const SUITS: Suit[] = ['clubs', 'diamonds', 'hearts', 'spades'];

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 6;
export const TURN_TIMEOUT_MS = 30_000;
export const DISCONNECT_TIMEOUT_MS = 60_000;
