// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import rehypeSlug from "rehype-slug";
import { readdirSync, readFileSync } from "node:fs";

const SITE = "https://spaceforedu.com";

/**
 * lastmod para el sitemap, leido del frontmatter de cada articulo.
 *
 * Solo se emite para el blog. Para el resto de paginas no hay una fecha de
 * modificacion fiable a mano desde aqui (la correspondencia ruta -> fichero pasa
 * por publicPages, en TypeScript), y un lastmod inventado es peor que ninguno:
 * Google descarta el elemento entero de un sitio cuando detecta que no es de fiar.
 * Clave del mapa: "<locale>/<slug>".
 */
const blogLastmod = (() => {
  const map = new Map();
  for (const locale of ["es", "en", "ru"]) {
    const dir = `src/content/blog/${locale}`;
    let files;
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    } catch {
      continue;
    }
    for (const file of files) {
      const raw = readFileSync(`${dir}/${file}`, "utf-8");
      const fm = raw.split("---")[1] ?? "";
      const slug = fm.match(/^slug:\s*"?([^"\n]+)"?/m)?.[1]?.trim();
      const published = fm.match(/^publishedAt:\s*"?([\d-]+)"?/m)?.[1];
      const updated = fm.match(/^updatedAt:\s*"?([\d-]+)"?/m)?.[1];
      const date = updated ?? published;
      if (slug && date) map.set(`${locale}/${slug}`, new Date(date));
    }
  }
  return map;
})();

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: "static",
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "viewport",
  },
  integrations: [
    react(),
    mdx({ rehypePlugins: [rehypeSlug] }),
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: { es: "es", en: "en", ru: "ru" },
      },
      // Drop the bare-root URL — it's a meta-refresh redirect to /es/, and including
      // it produces duplicate hreflang="es" entries (once for "/" and once for "/es/").
      // Keep out of the index: the bare root (a redirect), the ad landing pages and
      // the post-payment pages. All three are marked noindex, and sending Google a
      // noindex URL in the sitemap is a contradictory signal that wastes crawl budget.
      filter: (page) =>
        page !== `${SITE}/` &&
        !page.includes("/lp/") &&
        !page.includes("/gracias-"),
      // Add x-default pointing to the Spanish (default-locale) URL.
      serialize(item) {
        const blog = item.url.match(/\/(es|en|ru)\/blog\/([^/]+)\/?$/);
        if (blog) {
          const date = blogLastmod.get(`${blog[1]}/${blog[2]}`);
          if (date) item.lastmod = date.toISOString();
        }
        if (!item.links) return item;
        const esLink = item.links.find((l) => l.lang === "es");
        if (esLink) {
          item.links = [
            ...item.links,
            { lang: "x-default", url: esLink.url },
          ];
        }
        return item;
      },
    }),
  ],
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en", "ru"],
    routing: {
      prefixDefaultLocale: true,
      // Astro's auto-generated meta-refresh has a fixed 2s delay and overrides
      // src/pages/index.astro; we provide our own delay-0 redirect template.
      redirectToDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // @resvg/resvg-js and satori are Node.js-only (used in OG image endpoints).
      // Excluding them from Vite's SSR bundle prevents ".node binary" errors in dev.
      external: ["@resvg/resvg-js", "@resvg/resvg-js-linux-x64-gnu", "@resvg/resvg-js-linux-x64-musl"],
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
