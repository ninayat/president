import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../socket.ts';
import { usePlayerStore } from '../store/usePlayerStore.ts';
import { useLobbyStore } from '../store/useLobbyStore.ts';
import { useGameStore } from '../store/useGameStore.ts';
import { useSocket } from '../hooks/useSocket.ts';
import type { ClientGameState, Card } from '@president/game-logic';
import { MIN_PLAYERS } from '@president/game-logic';

export default function LobbyPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { isHost } = usePlayerStore();
  const { players, setPlayers, addPlayer, removePlayer } = useLobbyStore();
  const { setGameState, setHand } = useGameStore();

  useSocket({
    'lobby:playersUpdate': (data: { players: Array<{ id: string; name: string; isHost: boolean }> }) => {
      setPlayers(data.players);
    },
    'lobby:playerJoined': (data: { player: { id: string; name: string; isHost: boolean } }) => {
      addPlayer(data.player);
    },
    'lobby:playerLeft': (data: { playerId: string }) => {
      removePlayer(data.playerId);
    },
    'game:started': (data: { state: ClientGameState }) => {
      setGameState(data.state);
      navigate(`/game/${code}`);
    },
    'game:yourHand': (data: { hand: Card[] }) => {
      setHand(data.hand);
    },
  });

  function handleStart() {
    socket.emit('lobby:start');
  }

  function copyCode() {
    navigator.clipboard.writeText(code ?? '').catch(() => {});
  }

  const canStart = players.length >= MIN_PLAYERS;

  return (
    <div className="flex flex-col items-center h-full px-6 pt-12 pb-6 gap-6">
      {/* Code de salle */}
      <div className="text-center">
        <p className="text-green-300 text-sm mb-1">Code de la salle</p>
        <button
          onClick={copyCode}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 active:scale-95 transition-transform"
        >
          <span className="text-3xl font-mono font-black tracking-[0.3em] text-yellow-400">
            {code}
          </span>
          <span className="text-white/40 text-sm">📋</span>
        </button>
        <p className="text-white/40 text-xs mt-1">Appuie pour copier</p>
      </div>

      {/* Liste des joueurs */}
      <div className="w-full max-w-xs flex-1">
        <p className="text-green-300 text-sm mb-3">
          Joueurs ({players.length}/{6})
        </p>
        <ul className="flex flex-col gap-2">
          {players.map(p => (
            <li
              key={p.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 border border-white/10"
            >
              <span className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-sm font-bold">
                {p.name[0]?.toUpperCase()}
              </span>
              <span className="flex-1 font-semibold">{p.name}</span>
              {p.isHost && (
                <span className="text-xs text-yellow-400 font-bold">HOST</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Bouton démarrer */}
      <div className="w-full max-w-xs">
        {isHost ? (
          <>
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="w-full py-4 rounded-2xl bg-yellow-400 text-green-900 font-black text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-40 disabled:active:scale-100"
            >
              Démarrer la partie
            </button>
            {!canStart && (
              <p className="text-center text-white/40 text-sm mt-2">
                Minimum {MIN_PLAYERS} joueurs
              </p>
            )}
          </>
        ) : (
          <p className="text-center text-white/50">
            En attente du host...
          </p>
        )}
      </div>
    </div>
  );
}
