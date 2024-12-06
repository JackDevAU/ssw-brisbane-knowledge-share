import React from 'react';

interface SearchButtonProps {
  onClick: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <button
      className="w-full flex items-center justify-between rounded-lg bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
      onClick={onClick}
    >
      <span>Search sessions...</span>
      <kbd className="rounded bg-white/20 px-2 py-0.5 text-xs">⌘K</kbd>
    </button>
  );
}