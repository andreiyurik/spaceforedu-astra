import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(["es", "en", "ru"]),
    slug: z.string(),
    author: z.object({
      name: z.string(),
      role: z.string(),
      avatar: z.string().optional(),
    }),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    readingTime: z.number().optional(),
  }),
});

export const collections = { blog };
