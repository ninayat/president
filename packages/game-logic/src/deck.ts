import type { Card } from './types.js';
import { createDeck, compareRanks } from './card.js';

export function shuffle(deck: Card[]): Card[] {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j]!, d[i]!];
  }
  return d;
}

export function sortHand(hand: Card[]): Card[] {
  return [...hand].sort((a, b) => compareRanks(a.rank, b.rank));
}

export function deal(playerCount: number): Card[][] {
  const deck = shuffle(createDeck());
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);
  for (let i = 0; i < deck.length; i++) {
    hands[i % playerCount]!.push(deck[i]!);
  }
  return hands.map(sortHand);
}
