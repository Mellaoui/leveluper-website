import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per project in src/content/projects/.
// Files starting with "_" (like _template.md) are ignored.
const projects = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(), // one sentence: what it is and who it's for
    status: z.enum(['idea', 'validating', 'building', 'coming-soon', 'live', 'paused', 'archived']),
    category: z.string().optional(),
    url: z.url().optional(), // the project's own website
    repo: z.url().optional(),
    cta: z.object({ label: z.string(), href: z.string() }).optional(),
    stack: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    started: z.coerce.date().optional(),
    updated: z.coerce.date(),
    order: z.number().default(100), // lower = listed first
  }),
});

// One Markdown file per role in src/content/journey/ (the Journey window).
const month = z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM');
const journey = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './src/content/journey' }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    companyUrl: z.url().optional(),
    type: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']),
    start: month,
    end: month.optional(), // leave out for a current role
    location: z.string(),
    remote: z.boolean().default(false),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, journey };
