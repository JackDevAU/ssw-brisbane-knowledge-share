import React, { useState, useEffect, useRef } from 'react';
import { Command } from 'cmdk';

import { SearchResults } from './SearchResults';
import type { Session } from '../types/session';
import { SearchButton } from './SearchButton';

interface SearchDialogProps {
  sessions?: Session[];
}

export function SearchDialog({ sessions = [] }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const allTags = Array.from(new Set(sessions.flatMap(session => session.data.tags)));

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const scrollSelectedIntoView = (index: number) => {
    if (!listRef.current) return;

    const items = listRef.current.querySelectorAll('[cmdk-item]');
    const selectedItem = items[index] as HTMLElement;
    
    if (selectedItem) {
      const container = listRef.current;
      const containerRect = container.getBoundingClientRect();
      const itemRect = selectedItem.getBoundingClientRect();

      if (itemRect.bottom > containerRect.bottom) {
        container.scrollTop += itemRect.bottom - containerRect.bottom;
      } else if (itemRect.top < containerRect.top) {
        container.scrollTop -= containerRect.top - itemRect.top;
      }
    }
  };

  const getFilteredItems = () => {
    if (search.startsWith('#')) {
      return allTags.filter(tag => 
        tag.toLowerCase().includes(search.toLowerCase().slice(1))
      );
    } else {
      return sessions.filter(session => {
        const searchLower = search.toLowerCase();
        return (
          session.data.title.toLowerCase().includes(searchLower) ||
          session.data.presenter.toLowerCase().includes(searchLower) ||
          session.data.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = getFilteredItems();

    if (e.key === 'Tab') {
      e.preventDefault();
      
      let newIndex;
      if (e.shiftKey) {
        newIndex = (selectedIndex - 1 + items.length) % items.length;
      } else {
        newIndex = (selectedIndex + 1) % items.length;
      }
      
      setSelectedIndex(newIndex);
      scrollSelectedIntoView(newIndex);
    } else if (e.key === 'Enter' && items.length > 0) {
      e.preventDefault();
      const selectedItem = items[selectedIndex];
      
      if (search.startsWith('#')) {
        handleSelect(`#${selectedItem}`);
      } else {
        const session = selectedItem as Session;
        handleSelect(session.data.title, session.slug);
      }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = e.key === 'ArrowDown' 
        ? (selectedIndex + 1) % items.length
        : (selectedIndex - 1 + items.length) % items.length;
      setSelectedIndex(newIndex);
      scrollSelectedIntoView(newIndex);
    }
  };

  const handleSelect = (value: string, slug?: string) => {
    if (value.startsWith('#')) {
      const tag = value.slice(1);
      window.location.href = `/tag/${tag}`;
    } else if (slug) {
      window.location.href = `/session/${slug}`;
    }
    setOpen(false);
  };

  const filteredItems = getFilteredItems();
  const isTagSearch = search.startsWith('#');

  return (
    <>
      <SearchButton onClick={() => setOpen(true)} />

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search"
        shouldFilter={false}
        ref={ref}
        onKeyDown={handleKeyDown}
        className="fixed left-1/2 top-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl"
      >
        <Command.Input 
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setSelectedIndex(0);
          }}
          placeholder="Search knowledge sessions or tags (#)..."
          className="w-full border-b border-gray-200 pb-2 text-gray-600 outline-none placeholder:text-gray-400"
        />
        <Command.List 
          ref={listRef}
          className="mt-4 max-h-[300px] overflow-y-auto scroll-smooth"
        >
          <Command.Empty className="py-2 text-sm text-gray-500">
            No results found.
          </Command.Empty>
          
          <SearchResults
            items={filteredItems}
            selectedIndex={selectedIndex}
            isTagSearch={isTagSearch}
            sessions={sessions}
            onSelect={handleSelect}
          />
        </Command.List>
      </Command.Dialog>
    </>
  );
}