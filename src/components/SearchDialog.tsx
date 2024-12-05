import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';

interface SearchResult {
  title: string;
  date: string;
  presenter: string;
  summary: string;
  tags: string[];
  slug?: string;
}

export function SearchDialog({ sessions }: { sessions: SearchResult[] }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

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

  const handleSelect = (value: string, slug?: string) => {
    if (value.startsWith('#')) {
      const tag = value.slice(1);
      window.location.href = `/tag/${tag}`;
    } else if (slug) {
      window.location.href = `/session/${slug}`;
    }
    setOpen(false);
  };

  return (
    <>
      <button
        className="fixed right-4 top-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-gray-600 shadow-md hover:bg-gray-50"
        onClick={() => setOpen(true)}
      >
        <span>Search</span>
        <kbd className="rounded bg-gray-100 px-2 py-0.5 text-xs">⌘K</kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search"
        className="fixed left-1/2 top-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl"
      >
        <Command.Input 
          value={search}
          onValueChange={setSearch}
          placeholder="Search knowledge sessions or tags (#)..."
          className="w-full border-b border-gray-200 pb-2 text-gray-600 outline-none placeholder:text-gray-400"
        />
        <Command.List className="mt-4 max-h-[300px] overflow-y-auto">
          <Command.Empty className="py-2 text-sm text-gray-500">
            No results found.
          </Command.Empty>
          
          {search.startsWith('#') ? (
            // Show tag results
            <Command.Group heading="Tags">
              {allTags
                .filter(tag => 
                  tag.toLowerCase().includes(search.toLowerCase().slice(1))
                )
                .map(tag => (
                  <Command.Item
                    key={tag}
                    value={`#${tag}`}
                    onSelect={() => handleSelect(`#${tag}`)}
                    className="flex cursor-pointer flex-col gap-1 rounded-lg p-2 aria-selected:bg-gray-100"
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
            // Show session results
            <Command.Group heading="Sessions">
              {sessions
                .filter(session => {
                  const searchLower = search.toLowerCase();
                  return (
                    session.title.toLowerCase().includes(searchLower) ||
                    session.presenter.toLowerCase().includes(searchLower) ||
                    session.tags.some(tag => tag.toLowerCase().includes(searchLower))
                  );
                })
                .map((session) => (
                  <Command.Item
                    key={session.title}
                    value={session.title}
                    onSelect={() => handleSelect(session.title, session.slug)}
                    className="flex cursor-pointer flex-col gap-1 rounded-lg p-2 aria-selected:bg-gray-100"
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