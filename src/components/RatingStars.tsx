import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
  score: number; // 0 to 5
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumeric?: boolean;
  reviewsCount?: number;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  score,
  maxScore = 5,
  size = 'md',
  showNumeric = true,
  reviewsCount,
  className = ''
}) => {
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base font-bold' : 'text-sm font-semibold';

  const fullStars = Math.floor(score);
  const hasHalfStar = score - fullStars >= 0.3 && score - fullStars < 0.8;
  const extraFull = score - fullStars >= 0.8 ? 1 : 0;
  const actualFullStars = fullStars + extraFull;
  const emptyStars = Math.max(0, maxScore - actualFullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} aria-label={`Rating: ${score} out of ${maxScore}`}>
      <div className="flex items-center text-amber-500">
        {Array.from({ length: actualFullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={iconSize} className="fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && (
          <StarHalf size={iconSize} className="fill-amber-400 text-amber-400" />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={iconSize} className="text-slate-300 dark:text-slate-600" />
        ))}
      </div>
      {showNumeric && (
        <span className={`${textSize} text-slate-800 font-medium ml-0.5`}>
          {score.toFixed(1)}
        </span>
      )}
      {reviewsCount !== undefined && (
        <span className="text-xs text-slate-700 ml-0.5">
          ({reviewsCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};
