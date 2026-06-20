import es from "./es.json";
import en from "./en.json";
import ru from "./ru.json";
import type { Locale } from "@/lib/constants";

export type Messages = typeof es;

const bundles: Record<Locale, Messages> = { es, en: en as Messages, ru: ru as Messages };

export function getMessages(locale: Locale): Messages {
  return bundles[locale] ?? bundles.es;
}

/** Walk a dot-notation key through the messages object. */
export function lookup(messages: unknown, key: string): string | undefined {
  const parts = key.split(".");
  let cursor: unknown = messages;
  for (const part of parts) {
    if (cursor && typeof cursor === "object" && part in (cursor as Record<string, unknown>)) {
      cursor = (cursor as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof cursor === "string" ? cursor : undefined;
}

export function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, name) =>
    params[name] !== undefined ? String(params[name]) : `{{${name}}}`,
  );
}

/**
 * Count the consecutive `<prefix>.faq_<i>_q`/`_a` entries present in a bundle.
 * Single source of truth so the rendered FAQ list and its FAQPage JSON-LD can
 * never drift apart (and so no magic count leaks a raw key into the UI).
 */
export function countFaq(messages: Messages, prefix: string): number {
  let n = 0;
  while (
    lookup(messages, `${prefix}.faq_${n + 1}_q`) !== undefined &&
    lookup(messages, `${prefix}.faq_${n + 1}_a`) !== undefined
  ) {
    n++;
  }
  return n;
}

/** Server/Astro-side translator. Returns the key itself if missing. */
export function makeT(messages: Messages) {
  return function t(key: string, params?: Record<string, string | number>): string {
    const raw = lookup(messages, key);
    if (raw === undefined) {
      if (import.meta.env.DEV) console.warn(`[i18n] missing key: ${key}`);
      return key;
    }
    return interpolate(raw, params);
  };
}
