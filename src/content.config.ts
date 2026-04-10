import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const flavors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/flavors' }),
  schema: z.object({
    flavor_name: z.string(),
    mood_number: z.string().optional(),
    product_image: z.string().optional(),
    product_video: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    status: z.string().optional(),
    in_stock: z.boolean().optional().default(true),
    pinned: z.boolean().optional().default(false),
    locations: z.array(z.string()).optional(),
  }),
});

const collabs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/collabs' }),
  schema: z.object({
    partner_name: z.string(),
    partner_logo: z.string().optional(),
    hero_image: z.string().optional(),
    hero_video: z.string().optional(),
    project_type: z.string().optional(),
    year: z.number().optional(),
    flavor_name: z.string().optional(),
    published: z.boolean().optional().default(true),
    intro: z.string().optional(),
    challenge: z.string().optional(),
    process: z.string().optional(),
    result: z.string().optional(),
    work_station_images: z.array(z.string()).optional(),
    work_station_video: z.string().optional(),
  }),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: z.object({
    name: z.string(),
    address: z.string().optional(),
    hours: z.string().optional(),
    maps: z.string().optional(),
    thumb: z.string().optional(),
    delivery: z.boolean().optional().default(false),
    formats: z.array(z.string()).optional(),
  }),
});

export const collections = { flavors, collabs, locations };
