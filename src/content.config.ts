import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/*.md',
    generateId: ({ entry }) =>
      entry.replace(/\.(md|mdx)$/i, '').split('/').pop() as string,
  }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    authorGithub: z.string(),
    description: z.string(),
    type: z.enum(['main', 'small']),
    parent: z.string().optional(),
    image: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };