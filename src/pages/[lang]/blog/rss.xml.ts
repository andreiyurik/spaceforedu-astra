import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { LOCALES, SITE_URL, assertLocale, type Locale } from "@/lib/constants";
import { getBlogPosts } from "@/lib/blog";

const FEED_TITLES: Record<Locale, { title: string; description: string }> = {
  es: {
    title: "Space for Edu — Blog",
    description: "Artículos expertos sobre educación en España, homologación y vida estudiantil.",
  },
  en: {
    title: "Space for Edu — Blog",
    description: "Expert articles on education in Spain, degree homologation and student life.",
  },
  ru: {
    title: "Space for Edu — Блог",
    description: "Экспертные статьи об образовании в Испании, омологации и студенческой жизни.",
  },
};

export function getStaticPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}

export async function GET(context: APIContext) {
  const locale = assertLocale(context.params.lang);
  const posts = await getBlogPosts(locale);
  const meta = FEED_TITLES[locale] ?? FEED_TITLES.es;

  return rss({
    title: meta.title,
    description: meta.description,
    site: SITE_URL,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/${locale}/blog/${post.data.slug}/`,
      categories: post.data.tags,
    })),
    customData: `<language>${locale}</language>`,
  });
}
