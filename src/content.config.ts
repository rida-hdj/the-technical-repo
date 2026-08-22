import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const baseFields = {
  title: z.string(),
  author: z.string(),
  authorGithub: z.string(),
  description: z.string(),
  image: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
};

const mainPostSchema = z.object({
  ...baseFields,
  type: z.literal('main'),
  small: z.string().optional(),
});

const smallPostSchema = z.object({
  ...baseFields,
  type: z.literal('small'),
  order: z.number(),
});

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/i, ''),
  }),
  schema: z.discriminatedUnion('type', [mainPostSchema, smallPostSchema]),
});

export type MainPostData = z.infer<typeof mainPostSchema>;
export type SmallPostData = z.infer<typeof smallPostSchema>;

export const collections = { posts };
