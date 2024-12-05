import { defineCollection, z } from 'astro:content';

const knowledgeCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    presenter: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    videoUrl: z.string().optional(),
    slides: z.string().optional(),
    githubRepo: z.string().optional(),
    presentationLength: z.string().optional()
  })
});

export const collections = {
  'knowledge': knowledgeCollection,
};