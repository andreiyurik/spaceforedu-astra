import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Messages } from "./index";
import { lookup, interpolate } from "./index";
import type { Locale } from "@/lib/constants";

interface I18nValue {
  locale: Locale;
  messages: Messages;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ locale, messages }), [locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return ctx;
}

export function useTranslation() {
  const { locale, messages } = useI18n();
  const t = (key: string, params?: Record<string, string | number>): string => {
    const raw = lookup(messages, key);
    if (raw === undefined) {
      if (import.meta.env.DEV) console.warn(`[i18n] missing key: ${key}`);
      return key;
    }
    return interpolate(raw, params);
  };
  return { t, locale };
}

/**
 * Render an i18n string that may contain `<strong>...</strong>` segments.
 * Only the `<strong>` tag is recognised — anything else is rendered as plain text,
 * which keeps untrusted HTML out of the DOM while supporting basic emphasis.
 */
export function renderRichText(text: string): ReactNode {
  if (!text.includes("<strong>")) return text;
  const parts: ReactNode[] = [];
  const re = /<strong>(.*?)<\/strong>/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(<strong key={key++}>{match[1]}</strong>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
