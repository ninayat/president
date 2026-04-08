import { useMemo } from 'react';
import socket from '../../socket.ts';
import { useGameStore } from '../../store/useGameStore.ts';
import { validateCombo, canPlay } from '@president/game-logic';

interface ActionBarProps {
  isMyTurn: boolean;
}

export default function ActionBar({ isMyTurn }: ActionBarProps) {
  const { myHand, selectedCardIds, gameState, clearSelection } = useGameStore();

  const selectedCards = useMemo(
    () => myHand.filter(c => selectedCardIds.has(c.id)),
    [myHand, selectedCardIds],
  );

  const playValidation = useMemo(() => {
    if (selectedCards.length === 0) return null;
    const { valid, combo, reason } = validateCombo(selectedCards);
    if (!valid || !combo) return { valid: false, reason };

    const trick = gameState?.trick;
    if (trick && trick.lastCombo) {
      const myId = gameState?.players.find(p =>
        p.id === gameState.currentTurnPlayerId,
      )?.id ?? '';
      return canPlay(trick, combo, myId);
    }
    return { valid: true };
  }, [selectedCards, gameState]);

  function handlePlay() {
    if (!playValidation?.valid) return;
    socket.emit('game:playCards', { cardIds: [...selectedCardIds] });
    clearSelection();
  }

  function handlePass() {
    socket.emit('game:pass');
    clearSelection();
  }

  if (!isMyTurn) {
    return (
      <div className="flex items-center justify-center px-4 py-3">
        <p className="text-white/30 text-sm">En attente des autres joueurs…</p>
      </div>
    );
  }

  return (
    <div className="flex gap-3 px-4 pb-[env(safe-area-inset-bottom,12px)] pt-2">
      <button
        onClick={handlePass}
        className="flex-1 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm active:scale-95 transition-transform"
      >
        Passer
      </button>
      <button
        onClick={handlePlay}
        disabled={!playValidation?.valid}
        className="flex-[2] py-3 rounded-2xl bg-yellow-400 text-green-900 font-black text-sm shadow-lg active:scale-95 transition-transform disabled:opacity-40 disabled:active:scale-100"
      >
        {selectedCards.length > 0
          ? `Jouer ${selectedCards.length} carte${selectedCards.length > 1 ? 's' : ''}`
          : 'Jouer'}
      </button>
    </div>
  );
}
