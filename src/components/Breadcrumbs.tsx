import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (href: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs sm:text-sm text-slate-700 py-3 overflow-x-auto whitespace-nowrap">
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="flex items-center gap-1 hover:text-indigo-600 transition-colors text-slate-700 cursor-pointer"
        id="breadcrumb-home"
      >
        <Home size={14} />
        <span>Home</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight size={14} className="mx-1.5 text-slate-400 shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (item.onClick) item.onClick();
                  else if (item.href) onNavigate(item.href);
                }}
                className="hover:text-indigo-600 transition-colors text-slate-700 cursor-pointer"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
