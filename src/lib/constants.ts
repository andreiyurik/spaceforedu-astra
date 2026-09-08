export const CONTACT_WHATSAPP = import.meta.env.PUBLIC_CONTACT_WHATSAPP ?? "";
export const CONTACT_EMAIL = import.meta.env.PUBLIC_CONTACT_EMAIL ?? "";
export const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? "https://spaceforedu.com";

export const FEATURE_DASHBOARD =
  import.meta.env.PUBLIC_FEATURE_DASHBOARD === "true";

export const SOCIAL_FACEBOOK = import.meta.env.PUBLIC_SOCIAL_FACEBOOK ?? "";
export const SOCIAL_YOUTUBE = import.meta.env.PUBLIC_SOCIAL_YOUTUBE ?? "";
export const SOCIAL_LINKEDIN = import.meta.env.PUBLIC_SOCIAL_LINKEDIN ?? "";
export const SOCIAL_TELEGRAM = import.meta.env.PUBLIC_SOCIAL_TELEGRAM ?? "";
export const SOCIAL_TWITTER = import.meta.env.PUBLIC_SOCIAL_TWITTER ?? "";
export const SOCIAL_GOOGLE_BUSINESS = import.meta.env.PUBLIC_SOCIAL_GOOGLE_BUSINESS ?? "";

export const LOCALES = ["es", "en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

export function assertLocale(lang: string | undefined): Locale {
  if (lang != null && LOCALES.includes(lang as Locale)) return lang as Locale;
  throw new Error(`Invalid locale: ${lang}`);
}

// Build-time guard: fail the production build if the .env.example placeholder
// leaked through. Every CTA on the site is a wa.me deep link built from this
// number, so a placeholder ships a site whose entire funnel is dead — and a
// console.warn does not stop a deploy, it just scrolls past in the CI log.
if (import.meta.env.PROD && CONTACT_WHATSAPP === "34600000000") {
  throw new Error(
    "[space-for-edu] PUBLIC_CONTACT_WHATSAPP is still the placeholder " +
      "'34600000000'. Refusing to build for production: every WhatsApp CTA " +
      "and the JSON-LD telephone would be non-functional.",
  );
}
