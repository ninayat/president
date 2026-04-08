import { useEffect, useState } from 'react';
import { TURN_TIMEOUT_MS } from '@president/game-logic';

interface TurnTimerProps {
  isMyTurn: boolean;
  turnKey: string; // change quand le tour change → reset le timer
}

const SIZE = 36;
const STROKE = 3;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function TurnTimer({ isMyTurn, turnKey }: TurnTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    if (!isMyTurn) return;

    const start = Date.now();
    const interval = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 100);

    return () => clearInterval(interval);
  }, [isMyTurn, turnKey]);

  if (!isMyTurn) return null;

  const progress = Math.min(elapsed / TURN_TIMEOUT_MS, 1);
  const remaining = Math.max(0, Math.ceil((TURN_TIMEOUT_MS - elapsed) / 1000));
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const isUrgent = remaining <= 10;

  return (
    <div className="flex items-center gap-2">
      <svg width={SIZE} height={SIZE} className={`-rotate-90 ${isUrgent ? 'animate-pulse' : ''}`}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={isUrgent ? '#f87171' : '#facc15'}
          strokeWidth={STROKE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <span className={`text-sm font-bold tabular-nums ${isUrgent ? 'text-red-400' : 'text-yellow-400'}`}>
        {remaining}s
      </span>
    </div>
  );
}
