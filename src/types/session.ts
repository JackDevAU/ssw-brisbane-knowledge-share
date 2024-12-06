import type { CollectionEntry } from 'astro:content';

export type Session = CollectionEntry<'knowledge'>;
export type SessionData = Session['data'];