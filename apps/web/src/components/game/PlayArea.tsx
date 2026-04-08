import { AnimatePresence, motion } from 'framer-motion';
import CardImage from './CardImage.tsx';
import type { TrickState } from '@president/game-logic';

interface PlayAreaProps {
  trick: TrickState | null;
  lockedRank: string | null;
}

export default function PlayArea({ trick, lockedRank }: PlayAreaProps) {
  const lastCombo = trick?.lastCombo;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      {/* Info pli */}
      <div className="flex items-center gap-2 text-sm text-white/50">
        {trick && trick.currentComboSize > 0 && (
          <span>
            Taille : <span className="text-white font-bold">{trick.currentComboSize}</span>
          </span>
        )}
        {lockedRank && (
          <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold border border-yellow-400/40">
            {lockedRank} ou passer
          </span>
        )}
      </div>

      {/* Cartes posées */}
      <div className="relative flex items-center justify-center min-h-28">
        <AnimatePresence mode="popLayout">
          {lastCombo ? (
            <motion.div
              key={lastCombo.cards.map(c => c.id).join('-')}
              className="flex gap-1 items-center"
              initial={{ scale: 0.7, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {lastCombo.cards.map(card => (
                <CardImage
                  key={card.id}
                  card={card}
                  width={70}
                  layoutId={`play-${card.id}`}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="w-20 h-28 rounded-xl border-2 border-dashed border-white/15 flex items-center justify-center text-white/20 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Vide
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {lastCombo?.isBomb && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-2xl"
        >
          💣 Bombe !
        </motion.div>
      )}
    </div>
  );
}
