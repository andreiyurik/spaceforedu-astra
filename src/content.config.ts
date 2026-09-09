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
    translationKey: z.string().optional(),
  }),
});

const guias = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "src/content/guias" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(["es", "en", "ru"]),
    slug: z.string(),
    /** Nombre del pais tal y como se muestra al lector. */
    pais: z.string(),
    /** ISO-3166-1 alfa-2, para agrupar traducciones del mismo pais. */
    paisCodigo: z.string().length(2),
    /** Numero de leads en la base: ordena el indice por volumen real. */
    leads: z.number().optional(),
    /** Datos verificados contra la tabla de estado del HCCH (Convenio 12). */
    apostilla: z.object({
      esParte: z.boolean(),
      enVigorDesde: z.string(),
      /** Objeciones registradas; ninguna afecta a Espana, ver nota en cada guia. */
      nota: z.string().optional(),
    }),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
  }),
});

export const collections = { blog, guias };
