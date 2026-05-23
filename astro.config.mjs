// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import rehypeSlug from "rehype-slug";

const SITE = "https://spaceforedu.com";

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
      filter: (page) => page !== `${SITE}/`,
      // Add x-default pointing to the Spanish (default-locale) URL.
      serialize(item) {
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
