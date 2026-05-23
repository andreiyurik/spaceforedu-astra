import type { Locale } from "./constants";

export const publicPages = {
  home: "",
  homologacion: "homologation",
  universidad: "university",
  espanol: "spanish",
  precios: "pricing",
  privacyPolicy: "privacy-policy",
  legalNotice: "aviso-legal",
  cookies: "cookies",
  blog: "blog",
} as const;

export function publicRoute(page: string, locale: Locale | string): string {
  return page === "" ? `/${locale}/` : `/${locale}/${page}/`;
}

/** Build a WhatsApp deep link that opens a pre-filled message. */
export function whatsappLink(phone: string, text?: string): string {
  const base = `https://wa.me/${phone.replace(/\D/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
