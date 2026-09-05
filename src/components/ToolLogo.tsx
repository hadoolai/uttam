import React, { useState } from 'react';

interface ToolLogoProps {
  src: string;
  name: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const ToolLogo: React.FC<ToolLogoProps> = ({
  src,
  name,
  className = 'w-full h-full object-contain',
  loading = 'lazy',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    const initials = name
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || name.slice(0, 2).toUpperCase();

    return (
      <div
        className="w-full h-full flex items-center justify-center bg-slate-800 text-white font-bold text-xs rounded-md select-none"
        aria-label={`${name} official logo`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} official logo`}
      className={className}
      loading={loading}
      onError={() => setHasError(true)}
    />
  );
};
