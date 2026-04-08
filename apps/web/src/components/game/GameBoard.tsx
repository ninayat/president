import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../socket.ts';
import { useGameStore } from '../../store/useGameStore.ts';
import { usePlayerStore } from '../../store/usePlayerStore.ts';
import { useSocket } from '../../hooks/useSocket.ts';
import type { ClientGameState, Card, RankedPlayer } from '@president/game-logic';

import PlayerSeat from './PlayerSeat.tsx';
import PlayArea from './PlayArea.tsx';
import PlayerHand from './PlayerHand.tsx';
import ActionBar from './ActionBar.tsx';
import TurnTimer from './TurnTimer.tsx';
import ExchangeOverlay from './ExchangeOverlay.tsx';
import RoundResult from './RoundResult.tsx';

// Positions des sièges adverses selon le nombre de joueurs totaux
// Indices 0..N-2 = adversaires dans l'ordre de la liste (joueur local exclu)
const SEAT_POSITIONS: Record<number, string[]> = {
  3: ['top-4 left-1/2 -translate-x-1/2'],
  4: ['top-4 left-1/4', 'top-4 right-1/4'],
  5: ['top-16 left-2', 'top-4 left-1/2 -translate-x-1/2', 'top-16 right-2'],
  6: ['top-20 left-2', 'top-4 left-1/4', 'top-4 right-1/4', 'top-20 right-2'],
};

export default function GameBoard() {
  const { playerId } = usePlayerStore();
  const { gameState, setGameState, setHand, setPendingExchange, setError, lastError } =
    useGameStore();

  useSocket({
    'game:stateUpdate': (data: { state: ClientGameState }) => {
      setGameState(data.state);
    },
    'game:yourHand': (data: { hand: Card[] }) => {
      setHand(data.hand);
    },
    'game:exchangeReturn': (data: { count: number }) => {
      setPendingExchange({ cards: [], count: data.count });
    },
    'game:error': (data: { message: string }) => {
      setError(data.message);
      setTimeout(() => setError(null), 3000);
    },
    'game:trickOver': (_data: { winnerId: string; isBomb: boolean }) => {
      // Optionnel : animation supplémentaire gérée dans PlayArea
    },
  });

  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-full text-white/40">
        Chargement…
      </div>
    );
  }

  // Identifier le joueur local
  const myIndex = gameState.players.findIndex(p => p.id === playerId);
  const opponents = [
    ...gameState.players.slice(myIndex + 1),
    ...gameState.players.slice(0, myIndex),
  ];
  const isMyTurn = gameState.currentTurnPlayerId === playerId;
  const positions = SEAT_POSITIONS[gameState.players.length] ?? SEAT_POSITIONS[4]!;

  const trick = gameState.trick;
  const lockedRank = trick?.lockedRank ?? null;

  // Clé de tour pour reset du timer
  const turnKey = `${gameState.roundNumber}-${gameState.currentTurnPlayerId}`;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Header : timer + infos round */}
      <div className="flex items-center justify-between px-4 pt-[env(safe-area-inset-top,8px)] pb-2">
        <span className="text-white/40 text-xs">Manche {gameState.roundNumber}</span>
        <TurnTimer isMyTurn={isMyTurn} turnKey={turnKey} />
      </div>

      {/* Zone de jeu principale */}
      <div className="relative flex-1">
        {/* Sièges adverses */}
        {opponents.map((opp, i) => (
          <div
            key={opp.id}
            className={`absolute ${positions[i] ?? 'top-4 left-1/2 -translate-x-1/2'}`}
          >
            <PlayerSeat
              player={opp}
              isCurrentTurn={opp.id === gameState.currentTurnPlayerId}
            />
          </div>
        ))}

        {/* Zone centrale : cartes posées */}
        <PlayArea trick={trick} lockedRank={lockedRank} />
      </div>

      {/* Erreur */}
      {lastError && (
        <div className="mx-4 mb-1 px-3 py-2 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-sm text-center">
          {lastError}
        </div>
      )}

      {/* Main du joueur local */}
      <div className="border-t border-white/10 pt-2">
        <PlayerHand isMyTurn={isMyTurn} />
        <ActionBar isMyTurn={isMyTurn} />
      </div>

      {/* Overlays */}
      {gameState.phase === 'exchange' && (
        <ExchangeOverlay waitingFor={gameState.exchangeWaitingFor ?? []} myId={playerId ?? ''} />
      )}
      {gameState.phase === 'round-over' && (
        <RoundResult players={gameState.players} />
      )}
    </div>
  );
}
