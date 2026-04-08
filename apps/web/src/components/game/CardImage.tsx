import { motion } from 'framer-motion';
import { cardImagePath, cardBackPath } from '@president/game-logic';
import type { Card } from '@president/game-logic';

interface CardImageProps {
  card?: Card;
  faceDown?: boolean;
  selected?: boolean;
  onClick?: () => void;
  width?: number;
  layoutId?: string;
  className?: string;
}

const CARD_ASPECT = 340 / 242;

export default function CardImage({
  card,
  faceDown = false,
  selected = false,
  onClick,
  width = 64,
  layoutId,
  className = '',
}: CardImageProps) {
  const height = Math.round(width * CARD_ASPECT);
  const src = faceDown || !card ? cardBackPath() : cardImagePath(card);

  return (
    <motion.img
      layoutId={layoutId}
      src={src}
      width={width}
      height={height}
      alt={card ? `${card.rank} de ${card.suit}` : 'Carte dos'}
      onClick={onClick}
      className={`card-image select-none ${selected ? 'selected' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ width, height }}
      initial={false}
      animate={{ y: selected ? -16 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      draggable={false}
    />
  );
}
