import { useMemo } from 'react';
import { motion } from 'framer-motion';
import socket from '../../socket.ts';
import { useGameStore } from '../../store/useGameStore.ts';
import CardImage from './CardImage.tsx';

interface ExchangeOverlayProps {
  waitingFor: string[];
  myId: string;
}

export default function ExchangeOverlay({ waitingFor, myId }: ExchangeOverlayProps) {
  const { myHand, selectedCardIds, toggleCard, clearSelection, pendingExchange } =
    useGameStore();

  const mustGiveBack = waitingFor.includes(myId);
  const count = pendingExchange?.count ?? 0;
  const selectedCards = useMemo(
    () => myHand.filter(c => selectedCardIds.has(c.id)),
    [myHand, selectedCardIds],
  );

  function handleConfirm() {
    if (selectedCards.length !== count) return;
    socket.emit('game:exchange:give', { cardIds: [...selectedCardIds] });
    clearSelection();
  }

  return (
    <motion.div
      className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-6 px-6 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {mustGiveBack ? (
        <>
          <h2 className="text-2xl font-black text-white text-center">
            Donne {count} carte{count > 1 ? 's' : ''}
          </h2>
          <p className="text-white/60 text-sm text-center">
            Sélectionne {count} carte{count > 1 ? 's' : ''} à rendre
          </p>

          {/* Main pour sélection */}
          <div className="flex flex-wrap gap-2 justify-center max-w-xs">
            {myHand.map(card => (
              <div key={card.id} onClick={() => toggleCard(card.id)} className="cursor-pointer">
                <CardImage
                  card={card}
                  selected={selectedCardIds.has(card.id)}
                  width={56}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleConfirm}
            disabled={selectedCards.length !== count}
            className="w-full max-w-xs py-4 rounded-2xl bg-yellow-400 text-green-900 font-black text-lg disabled:opacity-40 active:scale-95 transition-transform"
          >
            Confirmer ({selectedCards.length}/{count})
          </button>
        </>
      ) : (
        <>
          <div className="text-5xl">🔄</div>
          <h2 className="text-xl font-bold text-white text-center">
            Échange de cartes en cours…
          </h2>
          <p className="text-white/50 text-sm text-center">
            En attente de {waitingFor.length} joueur{waitingFor.length > 1 ? 's' : ''}
          </p>
        </>
      )}
    </motion.div>
  );
}
