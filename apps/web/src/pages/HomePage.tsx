import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket.ts';
import { usePlayerStore } from '../store/usePlayerStore.ts';
import { useLobbyStore } from '../store/useLobbyStore.ts';
import { useSocket } from '../hooks/useSocket.ts';

type Mode = 'idle' | 'create' | 'join';

export default function HomePage() {
  const navigate = useNavigate();
  const { setPlayer, setRoom } = usePlayerStore();
  const { setPlayers, reset: resetLobby } = useLobbyStore();

  const [mode, setMode] = useState<Mode>('idle');
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { resetLobby(); }, [resetLobby]);

  useSocket({
    'lobby:created': ({ roomCode: code, playerId }: { roomCode: string; playerId: string }) => {
      setPlayer(playerId, name.trim());
      setRoom(code, true);
      navigate(`/lobby/${code}`);
    },
    'lobby:joined': ({
      roomCode: code,
      playerId,
      players,
    }: {
      roomCode: string;
      playerId: string;
      players: Array<{ id: string; name: string; isHost: boolean }>;
    }) => {
      setPlayer(playerId, name.trim());
      setRoom(code, false);
      setPlayers(players);
      navigate(`/lobby/${code}`);
    },
    'lobby:error': ({ message }: { message: string }) => {
      setError(message);
    },
  });

  function handleCreate() {
    setError('');
    if (!name.trim()) { setError('Entre ton pseudo'); return; }
    socket.emit('lobby:create', { playerName: name.trim() });
  }

  function handleJoin() {
    setError('');
    if (!name.trim()) { setError('Entre ton pseudo'); return; }
    if (!roomCode.trim()) { setError('Entre le code de la salle'); return; }
    socket.emit('lobby:join', { roomCode: roomCode.trim().toUpperCase(), playerName: name.trim() });
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-8">
      {/* Logo */}
      <div className="text-center">
        <div className="text-6xl mb-2">🃏</div>
        <h1 className="text-4xl font-black tracking-tight text-white">Président</h1>
        <p className="text-green-300 text-sm mt-1">Multijoueur en ligne</p>
      </div>

      {/* Input pseudo */}
      <div className="w-full max-w-xs flex flex-col gap-3">
        <input
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-center text-lg font-semibold outline-none focus:border-yellow-400 focus:bg-white/15 transition"
          placeholder="Ton pseudo"
          value={name}
          maxLength={16}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && mode === 'join' ? handleJoin() : handleCreate()}
        />

        {mode === 'join' && (
          <input
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-center text-xl font-mono tracking-[0.3em] uppercase outline-none focus:border-yellow-400 transition"
            placeholder="CODE"
            value={roomCode}
            maxLength={6}
            onChange={e => setRoomCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
        )}

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}
      </div>

      {/* Boutons */}
      <div className="w-full max-w-xs flex flex-col gap-3">
        {mode === 'idle' && (
          <>
            <button
              onClick={() => setMode('create')}
              className="w-full py-4 rounded-2xl bg-yellow-400 text-green-900 font-black text-lg shadow-lg active:scale-95 transition-transform"
            >
              Créer une partie
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full py-4 rounded-2xl bg-white/15 border border-white/20 text-white font-bold text-lg active:scale-95 transition-transform"
            >
              Rejoindre
            </button>
          </>
        )}

        {mode === 'create' && (
          <>
            <button
              onClick={handleCreate}
              className="w-full py-4 rounded-2xl bg-yellow-400 text-green-900 font-black text-lg shadow-lg active:scale-95 transition-transform"
            >
              Créer la salle
            </button>
            <button
              onClick={() => setMode('idle')}
              className="w-full py-3 rounded-2xl text-white/60 text-sm active:scale-95 transition-transform"
            >
              Retour
            </button>
          </>
        )}

        {mode === 'join' && (
          <>
            <button
              onClick={handleJoin}
              className="w-full py-4 rounded-2xl bg-yellow-400 text-green-900 font-black text-lg shadow-lg active:scale-95 transition-transform"
            >
              Rejoindre
            </button>
            <button
              onClick={() => setMode('idle')}
              className="w-full py-3 rounded-2xl text-white/60 text-sm active:scale-95 transition-transform"
            >
              Retour
            </button>
          </>
        )}
      </div>
    </div>
  );
}
