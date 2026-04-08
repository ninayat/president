import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore.ts';
import GameBoard from '../components/game/GameBoard.tsx';

export default function GamePage() {
  const { code } = useParams<{ code: string }>();
  const { gameState } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameState) {
      // Si pas d'état de jeu (ex: rechargement de page), retour accueil
      navigate('/');
    }
  }, [gameState, navigate]);

  if (!gameState) return null;

  return (
    <div className="w-full h-full">
      <GameBoard />
    </div>
  );
}
