import { motion } from 'framer-motion';
import socket from '../../socket.ts';
import type { PlayerPublic } from '@president/game-logic';

const ROLE_CONFIG: Record<string, { emoji: string; label: string; bg: string }> = {
  president: { emoji: '👑', label: 'Président', bg: 'bg-yellow-400/20 border-yellow-400/50' },
  'vice-president': { emoji: '⭐', label: 'Vice-Président', bg: 'bg-blue-400/20 border-blue-400/50' },
  neutral: { emoji: '😐', label: 'Citoyen', bg: 'bg-white/10 border-white/20' },
  'vice-tdc': { emoji: '🪣', label: 'Vice-TDC', bg: 'bg-orange-400/20 border-orange-400/50' },
  tdc: { emoji: '💩', label: 'Trou du Cul', bg: 'bg-red-400/20 border-red-400/50' },
};

interface RoundResultProps {
  players: PlayerPublic[];
}

export default function RoundResult({ players: rawPlayers }: RoundResultProps) {
  const players = [...rawPlayers].sort(
    (a, b) => (a.finishOrder ?? 99) - (b.finishOrder ?? 99),
  );

  function handleReady() {
    socket.emit('game:ready');
  }

  return (
    <motion.div
      className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-6 px-6 z-50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <h2 className="text-3xl font-black text-white">Fin de manche !</h2>

      <div className="w-full max-w-xs flex flex-col gap-2">
        {players.map((player, i) => {
          const role = player.role ?? 'neutral';
          const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.neutral!;
          return (
            <motion.div
              key={player.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${cfg.bg}`}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-2xl">{cfg.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-white">{player.name}</p>
                <p className="text-xs text-white/60">{cfg.label}</p>
              </div>
              <span className="text-white/40 text-sm font-bold">
                #{player.finishOrder}
              </span>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={handleReady}
        className="w-full max-w-xs py-4 rounded-2xl bg-yellow-400 text-green-900 font-black text-lg active:scale-95 transition-transform"
      >
        Prêt pour la suite →
      </button>
    </motion.div>
  );
}
