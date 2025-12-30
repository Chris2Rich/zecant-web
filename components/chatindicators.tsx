import React from 'react';
import { Search, CheckCircle2 } from 'lucide-react';

interface SearchIndicatorProps {
  query: string | null;
  isActive: boolean;
}

export const SearchIndicator: React.FC<SearchIndicatorProps> = ({ query, isActive }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-500/5 border border-blue-500/10 rounded-lg">
      <div className="flex items-center gap-2 flex-shrink-0">
        {isActive ? (
          <div className="relative">
            <Search className="w-4 h-4 text-blue-500" />
            <div className="absolute inset-0 animate-ping">
              <Search className="w-4 h-4 text-blue-500/40" />
            </div>
          </div>
        ) : (
          <CheckCircle2 className="w-4 h-4 text-blue-500" />
        )}
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {isActive ? "Searching" : "Search complete"}
        </span>
      </div>
      {query && (
        <>
          <div className="h-4 w-px bg-blue-500/20" />
          <span className="text-xs text-muted-foreground truncate flex-1">
            {query}
          </span>
        </>
      )}
    </div>
  );
};