import { getCollection } from "astro:content";
import type { Locale } from "./constants";

export async function getBlogPosts(locale: Locale) {
  const posts = await getCollection("blog", (entry) => entry.data.locale === locale);
  return posts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

export async function getAllBlogPosts() {
  const posts = await getCollection("blog");
  return posts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function extractFaq(body: string): Array<{ q: string; a: string }> {
  const faq: Array<{ q: string; a: string }> = [];
  const faqMatch = body.match(
    /##\s+(?:Preguntas frecuentes|Frequently asked questions|Часто задаваемые вопросы)\s*\n([\s\S]*?)(?=\n##\s|\n<!-- faq-end|$)/,
  );
  if (!faqMatch) return faq;

  const section = faqMatch[1];
  const pairs = section.split(/\n\*\*/).filter(Boolean);
  for (const pair of pairs) {
    const lines = pair.trim().split("\n");
    const qLine = lines[0].replace(/\*\*$/, "").trim();
    const aLines = lines
      .slice(1)
      .filter((l) => l.trim().length > 0)
      .join(" ")
      .trim();
    if (qLine && aLines) {
      faq.push({ q: qLine, a: aLines });
    }
  }
  return faq;
}

export function formatDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(
    locale === "es" ? "es-ES" : locale === "ru" ? "ru-RU" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
}
