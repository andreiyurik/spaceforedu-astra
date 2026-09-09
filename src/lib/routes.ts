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
  terminos: "terminos",
  consulta: "consulta",
  bachillerato: "homologacion-bachillerato",
  blog: "blog",
  guias: "guias",
  // Post-payment landing pages. Stripe's success_url points here, so they are
  // the only clean, measurable conversion point a static site can have.
  // Marked noindex and excluded from the sitemap in astro.config.mjs.
  graciasHomologacion: "gracias-homologacion",
  graciasConsulta: "gracias-consulta",
} as const;

export function publicRoute(page: string, locale: Locale): string {
  return page === "" ? `/${locale}/` : `/${locale}/${page}/`;
}

/** Build a WhatsApp deep link that opens a pre-filled message. */
export function whatsappLink(phone: string, text?: string): string {
  const base = `https://wa.me/${phone.replace(/\D/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
