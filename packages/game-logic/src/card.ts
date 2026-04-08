import type { Card, Rank, Suit } from './types.js';
import { RANK_ORDER, SUITS } from './constants.js';

export function cardId(suit: Suit, rank: Rank): string {
  return `${suit}_${rank}`;
}

export function cardImagePath(card: Card): string {
  return `/cards/${card.id}.png`;
}

export function cardBackPath(): string {
  return '/cards/back_light.png';
}

export function rankValue(rank: Rank): number {
  return RANK_ORDER.indexOf(rank);
}

export function compareRanks(a: Rank, b: Rank): number {
  return rankValue(a) - rankValue(b);
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANK_ORDER) {
      deck.push({ suit, rank, id: cardId(suit, rank) });
    }
  }
  return deck;
}
