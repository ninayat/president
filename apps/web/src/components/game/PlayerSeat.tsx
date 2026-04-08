import { motion } from 'framer-motion';
import { cardBackPath } from '@president/game-logic';
import type { PlayerPublic } from '@president/game-logic';

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  president: { label: '👑 Président', color: 'text-yellow-400' },
  'vice-president': { label: '⭐ Vice-Pres', color: 'text-blue-300' },
  tdc: { label: '💩 TDC', color: 'text-red-400' },
  'vice-tdc': { label: '🪣 Vice-TDC', color: 'text-orange-400' },
  neutral: { label: '', color: '' },
};

interface PlayerSeatProps {
  player: PlayerPublic;
  isCurrentTurn: boolean;
}

export default function PlayerSeat({ player, isCurrentTurn }: PlayerSeatProps) {
  const roleInfo = player.role ? ROLE_LABELS[player.role] : null;

  return (
    <div className="flex flex-col items-center gap-1 max-w-20">
      {/* Indicateur de tour */}
      <motion.div
        animate={isCurrentTurn ? { scale: [1, 1.08, 1], opacity: 1 } : { scale: 1, opacity: 0.6 }}
        transition={isCurrentTurn ? { repeat: Infinity, duration: 1.2 } : {}}
        className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl ${isCurrentTurn ? 'bg-yellow-400/20 border border-yellow-400/50' : ''}`}
      >
        {/* Mini pile de cartes dos */}
        <div className="relative w-10 h-14 flex items-center justify-center">
          {player.cardCount > 0 ? (
            <>
              {/* Ombre empilée */}
              {player.cardCount > 1 && (
                <img
                  src={cardBackPath()}
                  width={36}
                  height={50}
                  className="absolute top-1 left-1 rounded opacity-40"
                  alt=""
                />
              )}
              <img
                src={cardBackPath()}
                width={36}
                height={50}
                className="relative rounded card-image"
                alt="cartes"
              />
              <span className="absolute -bottom-1 -right-1 bg-green-800 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white/20">
                {player.cardCount}
              </span>
            </>
          ) : (
            <span className="text-white/20 text-xs">✓</span>
          )}
        </div>

        {/* Nom */}
        <p className="text-white text-xs font-semibold text-center leading-tight truncate w-full">
          {player.name}
        </p>

        {/* Rôle */}
        {roleInfo?.label && (
          <p className={`text-xs font-bold ${roleInfo.color}`}>{roleInfo.label}</p>
        )}

        {/* Déconnecté */}
        {!player.connected && (
          <p className="text-red-400 text-xs">déco.</p>
        )}
      </motion.div>
    </div>
  );
}
