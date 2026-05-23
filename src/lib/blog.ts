import { getCollection } from "astro:content";
import { execFileSync } from "node:child_process";
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
  const text = content
    .replace(/^(import|export)\s.+$/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/^---[\s\S]*?---/m, "");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function extractFaq(body: string): Array<{ q: string; a: string }> {
  const faq: Array<{ q: string; a: string }> = [];
  const faqMatch = body.match(
    /##\s+(?:Preguntas frecuentes|Frequently [Aa]sked [Qq]uestions|FAQ|Часто задаваемые вопросы)\s*\n([\s\S]*?)(?=\n##\s|$)/i,
  );
  if (!faqMatch) return faq;

  const section = faqMatch[1];
  const re = /\*\*(.+?)\*\*\s*\n\n([\s\S]*?)(?=\n\*\*|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(section)) !== null) {
    const q = m[1].trim();
    const a = m[2].trim().replace(/\n/g, " ");
    if (q && a) faq.push({ q, a });
  }
  return faq;
}

export async function getTranslations(
  translationKey: string | undefined,
  currentLocale: Locale,
): Promise<Array<{ locale: Locale; slug: string }>> {
  if (!translationKey) return [];
  const all = await getCollection(
    "blog",
    (entry) =>
      entry.data.translationKey === translationKey &&
      entry.data.locale !== currentLocale,
  );
  return all.map((p) => ({ locale: p.data.locale as Locale, slug: p.data.slug }));
}

export function getLastModified(filePath: string | undefined, fallback: Date): Date {
  if (!filePath) return fallback;
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%aI", "--", filePath], {
      encoding: "utf-8",
      timeout: 5000,
    }).trim();
    return iso ? new Date(iso) : fallback;
  } catch {
    return fallback;
  }
}

export function formatDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(
    locale === "es" ? "es-ES" : locale === "ru" ? "ru-RU" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
}
