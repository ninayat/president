import { useGameStore } from '../../store/useGameStore.ts';
import CardImage from './CardImage.tsx';

interface PlayerHandProps {
  isMyTurn: boolean;
}

export default function PlayerHand({ isMyTurn }: PlayerHandProps) {
  const { myHand, selectedCardIds, toggleCard } = useGameStore();

  if (myHand.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-white/30 text-sm">
        Plus de cartes
      </div>
    );
  }

  const count = myHand.length;
  // Overlap négatif pour les mains chargées
  const overlap = count > 10 ? -28 : count > 7 ? -20 : -12;

  return (
    <div className="flex items-end justify-center px-2 pb-2 overflow-visible">
      <div
        className="flex items-end"
        style={{ gap: 0 }}
      >
        {myHand.map((card, i) => {
          const isSelected = selectedCardIds.has(card.id);
          // Légère rotation en éventail
          const totalAngle = Math.min(count * 3, 30);
          const rotate = count > 1
            ? -totalAngle / 2 + (i / (count - 1)) * totalAngle
            : 0;

          return (
            <div
              key={card.id}
              style={{
                marginLeft: i === 0 ? 0 : overlap,
                zIndex: isSelected ? 100 : i,
                transform: `rotate(${rotate}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <CardImage
                card={card}
                selected={isSelected}
                onClick={isMyTurn ? () => toggleCard(card.id) : undefined}
                width={60}
                layoutId={`hand-${card.id}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
