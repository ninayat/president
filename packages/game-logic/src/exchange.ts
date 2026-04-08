import type { Card, Player, GameState, ExchangeState } from './types.js';
import { rankValue } from './card.js';

/** Retourne les N meilleures cartes d'une main (pour TDC / Vice-TDC) */
export function getBestCards(hand: Card[], count: number): Card[] {
  return [...hand]
    .sort((a, b) => rankValue(b.rank) - rankValue(a.rank))
    .slice(0, count);
}

/** Valide que les cartes choisies sont bien dans la main du joueur */
export function validateReturn(hand: Card[], chosen: Card[], count: number): boolean {
  if (chosen.length !== count) return false;
  const handIds = new Set(hand.map(c => c.id));
  return chosen.every(c => handIds.has(c.id));
}

/** Retire les cartes d'une main */
function removeCards(hand: Card[], toRemove: Card[]): Card[] {
  const removeIds = new Set(toRemove.map(c => c.id));
  return hand.filter(c => !removeIds.has(c.id));
}

/**
 * Construit l'ExchangeState initial pour un nouveau tour.
 * TDC donne ses 2 meilleures cartes au Président.
 * Vice-TDC donne sa meilleure carte au Vice-Président.
 */
export function buildExchangeState(players: Player[]): ExchangeState {
  const president = players.find(p => p.role === 'president');
  const vicePresident = players.find(p => p.role === 'vice-president');
  const tdc = players.find(p => p.role === 'tdc');
  const viceTdc = players.find(p => p.role === 'vice-tdc');

  const offers = [];
  const returns = [];

  if (tdc && president) {
    const cards = getBestCards(tdc.hand, 2);
    offers.push({ fromId: tdc.id, toId: president.id, cards, given: false });
    returns.push({ fromId: president.id, toId: tdc.id, cards: [], done: false });
  }

  if (viceTdc && vicePresident) {
    const cards = getBestCards(viceTdc.hand, 1);
    offers.push({ fromId: viceTdc.id, toId: vicePresident.id, cards, given: false });
    returns.push({ fromId: vicePresident.id, toId: viceTdc.id, cards: [], done: false });
  }

  return { offers, returns };
}

/**
 * Applique les offres (TDC/Vice-TDC → Président/Vice-Président).
 * Retourne les joueurs mis à jour.
 */
export function applyOffers(players: Player[], exchange: ExchangeState): Player[] {
  return players.map(p => {
    const offer = exchange.offers.find(o => o.fromId === p.id);
    if (offer) {
      return { ...p, hand: removeCards(p.hand, offer.cards) };
    }
    const received = exchange.offers.filter(o => o.toId === p.id);
    if (received.length > 0) {
      const newCards = received.flatMap(o => o.cards);
      return { ...p, hand: [...p.hand, ...newCards] };
    }
    return p;
  });
}

/**
 * Applique les retours (Président/Vice-Président → TDC/Vice-TDC).
 */
export function applyReturns(players: Player[], exchange: ExchangeState): Player[] {
  return players.map(p => {
    const ret = exchange.returns.find(r => r.fromId === p.id);
    if (ret && ret.cards.length > 0) {
      return { ...p, hand: removeCards(p.hand, ret.cards) };
    }
    const received = exchange.returns.filter(r => r.toId === p.id);
    if (received.length > 0) {
      const newCards = received.flatMap(r => r.cards);
      return { ...p, hand: [...p.hand, ...newCards] };
    }
    return p;
  });
}

/** Tous les échanges sont-ils terminés ? */
export function isExchangeComplete(exchange: ExchangeState): boolean {
  return exchange.returns.every(r => r.done);
}
