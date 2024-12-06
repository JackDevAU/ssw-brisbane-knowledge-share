import React, { useState, useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import type { SearchResult } from '../types/search';

export function SearchDialog({ sessions }: { sessions: SearchResult[] }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Get unique tags from all sessions
  const allTags = Array.from(new Set(sessions.flatMap(session => session.tags)));

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

  // Function to scroll selected item into view
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
          session.title.toLowerCase().includes(searchLower) ||
          session.presenter.toLowerCase().includes(searchLower) ||
          session.tags.some(tag => tag.toLowerCase().includes(searchLower))
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
        handleSelect(selectedItem.title, selectedItem.slug);
      }
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

  return (
    <>
      <button
        className="w-full flex items-center justify-between rounded-lg bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
        onClick={() => setOpen(true)}
      >
        <span>Search sessions...</span>
        <kbd className="rounded bg-white/20 px-2 py-0.5 text-xs">⌘K</kbd>
      </button>

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
          
          {search.startsWith('#') ? (
            <Command.Group heading="Tags">
              {filteredItems.map((tag, index) => (
                <Command.Item
                  key={tag}
                  value={`#${tag}`}
                  onSelect={() => handleSelect(`#${tag}`)}
                  className={`flex cursor-pointer flex-col gap-1 rounded-lg p-2 ${
                    index === selectedIndex ? 'bg-gray-100' : ''
                  } hover:bg-gray-100`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">#{tag}</span>
                    <span className="text-sm text-gray-500">
                      {sessions.filter(s => s.tags.includes(tag)).length} sessions
                    </span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          ) : (
            <Command.Group heading="Sessions">
              {filteredItems.map((session, index) => (
                <Command.Item
                  key={session.title}
                  value={session.title}
                  onSelect={() => handleSelect(session.title, session.slug)}
                  className={`flex cursor-pointer flex-col gap-1 rounded-lg p-2 ${
                    index === selectedIndex ? 'bg-gray-100' : ''
                  } hover:bg-gray-100`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{session.title}</span>
                    <span className="text-sm text-gray-500">{session.date}</span>
                  </div>
                  <span className="text-sm text-gray-600">by {session.presenter}</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {session.tags.map(tag => (
                      <span 
                        key={tag}
                        className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command.Dialog>
    </>
  );
}