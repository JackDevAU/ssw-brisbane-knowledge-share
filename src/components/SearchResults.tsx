
import React from 'react';
import { Command } from 'cmdk';
import type { Session } from '../types/session';
import { formatDate } from '../utils/formatDate';


interface SearchResultsProps {
  items: (Session | string)[];
  selectedIndex: number;
  isTagSearch: boolean;
  sessions: Session[];
  onSelect: (value: string, slug?: string) => void;
}

export function SearchResults({ items, selectedIndex, isTagSearch, sessions, onSelect }: SearchResultsProps) {
  if (isTagSearch) {
    return (
      <Command.Group heading="Tags">
        {items.map((tag, index) => (
          <Command.Item
            key={tag as string}
            value={`#${tag}`}
            onSelect={() => onSelect(`#${tag}`)}
            className={`flex cursor-pointer flex-col gap-1 rounded-lg p-2 ${
              index === selectedIndex ? 'bg-gray-100' : ''
            } hover:bg-gray-100`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">#{tag}</span>
              <span className="text-sm text-gray-500">
                {sessions.filter(s => s.data.tags.includes(tag as string)).length} sessions
              </span>
            </div>
          </Command.Item>
        ))}
      </Command.Group>
    );
  }

  return (
    <Command.Group heading="Sessions">
      {items.map((session, index) => {
        const { data, slug } = session as Session;
        return (
          <Command.Item
            key={data.title}
            value={data.title}
            onSelect={() => onSelect(data.title, slug)}
            className={`flex cursor-pointer flex-col gap-1 rounded-lg p-2 ${
              index === selectedIndex ? 'bg-gray-100' : ''
            } hover:bg-gray-100`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{data.title}</span>
              <span className="text-sm text-gray-500">{formatDate(data.date)}</span>
            </div>
            <span className="text-sm text-gray-600">by {data.presenter}</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {data.tags.map(tag => (
                <span 
                  key={tag}
                  className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Command.Item>
        );
      })}
    </Command.Group>
  );
}