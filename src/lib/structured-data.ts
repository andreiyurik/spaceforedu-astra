import type { Messages } from "@/lib/i18n";
import { lookup, countFaq } from "@/lib/i18n";
import {
  SITE_URL,
  CONTACT_WHATSAPP,
  CONTACT_EMAIL,
  LOCALES,
  SOCIAL_FACEBOOK,
  SOCIAL_YOUTUBE,
  SOCIAL_LINKEDIN,
  SOCIAL_TELEGRAM,
  SOCIAL_TWITTER,
  SOCIAL_GOOGLE_BUSINESS,
} from "@/lib/constants";
import { publicRoute } from "@/lib/routes";
import type { Locale } from "@/lib/constants";

const ORG_ID = `${SITE_URL}/#org`;

export function organization(): object {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    "@id": ORG_ID,
    name: "Space for Edu",
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    image: `${SITE_URL}/og.jpg`,
    foundingDate: "2010",
    areaServed: "ES",
    knowsLanguage: ["es", "en", "ru"],
    slogan: "Educación en España, de principio a fin",
    description:
      "Spain-based education consultancy specialising in degree homologation, university admission and Spanish courses. 15+ years of experience, 1700+ successful cases, 98% favourable resolution rate.",
    ...(CONTACT_WHATSAPP || CONTACT_EMAIL
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: Array.from(LOCALES),
            ...(CONTACT_WHATSAPP ? { telephone: `+${CONTACT_WHATSAPP}` } : {}),
            ...(CONTACT_EMAIL ? { email: CONTACT_EMAIL } : {}),
          },
        }
      : {}),
    ...(() => {
      const links = [
        SOCIAL_FACEBOOK,
        SOCIAL_YOUTUBE,
        SOCIAL_LINKEDIN,
        SOCIAL_TELEGRAM,
        SOCIAL_TWITTER,
        SOCIAL_GOOGLE_BUSINESS,
      ].filter(Boolean);
      return links.length > 0 ? { sameAs: links } : {};
    })(),
  };
}

export function service(params: {
  locale: Locale;
  name: string;
  description: string;
  page: string;
  serviceType: string;
  audience?: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: params.name,
    description: params.description,
    serviceType: params.serviceType,
    areaServed: "ES",
    availableLanguage: ["es", "en", "ru"],
    provider: { "@id": ORG_ID },
    url: SITE_URL + publicRoute(params.page, params.locale),
    ...(params.audience
      ? { audience: { "@type": "Audience", audienceType: params.audience } }
      : {}),
  };
}

export function website(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Space for Edu",
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#org` },
    inLanguage: Array.from(LOCALES),
  };
}

const SERVICE_LIST_LABELS: Record<
  Locale,
  {
    listName: string;
    services: Array<{ name: string; description: string }>;
  }
> = {
  es: {
    listName: "Servicios educativos en España",
    services: [
      { name: "Homologación de títulos", description: "Reconocimiento oficial de títulos extranjeros ante el Ministerio de Educación español." },
      { name: "Acceso a universidades", description: "Acompañamiento integral para ingresar a una universidad española." },
      { name: "Clases de español", description: "Clases individuales y grupales con profesores nativos certificados, niveles A1–C2." },
    ],
  },
  en: {
    listName: "Educational services in Spain",
    services: [
      { name: "Degree homologation", description: "Official recognition of foreign degrees by the Spanish Ministry of Education." },
      { name: "University admission", description: "End-to-end support for enrolment in Spanish universities." },
      { name: "Spanish language courses", description: "Individual and group lessons with certified native teachers, levels A1–C2." },
    ],
  },
  ru: {
    listName: "Образовательные услуги в Испании",
    services: [
      { name: "Омологация диплома", description: "Официальное признание иностранных дипломов Министерством образования Испании." },
      { name: "Поступление в вузы", description: "Комплексная помощь с поступлением в испанские университеты." },
      { name: "Уроки испанского", description: "Индивидуальные и групповые занятия с сертифицированными носителями языка, уровни A1–C2." },
    ],
  },
};

export function serviceList(locale: Locale): object {
  const labels = SERVICE_LIST_LABELS[locale] ?? SERVICE_LIST_LABELS.es;
  const pages = ["homologation", "university", "spanish"];
  const services = labels.services.map((s, i) => ({ ...s, url: publicRoute(pages[i], locale) }));
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: labels.listName,
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.name,
        description: s.description,
        url: SITE_URL + s.url,
        provider: { "@id": `${SITE_URL}/#org` },
        areaServed: "ES",
      },
    })),
  };
}

type BreadcrumbLabels = {
  home: string;
};

const BREADCRUMB_LABELS: Record<Locale, BreadcrumbLabels> = {
  es: { home: "Inicio" },
  en: { home: "Home" },
  ru: { home: "Главная" },
};

/**
 * Build a BreadcrumbList JSON-LD: Home → current page.
 * `pageName` is the human-readable label of the current page (e.g. "Homologación").
 * `pagePath` is the route key used by publicRoute (e.g. "homologation").
 */
export function breadcrumbList(
  locale: Locale,
  pageName: string,
  pagePath: string,
): object {
  const labels = BREADCRUMB_LABELS[locale] ?? BREADCRUMB_LABELS.es;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: labels.home,
        item: SITE_URL + publicRoute("", locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageName,
        item: SITE_URL + publicRoute(pagePath, locale),
      },
    ],
  };
}

export function blogPosting(params: {
  locale: Locale;
  title: string;
  description: string;
  slug: string;
  authorName: string;
  authorRole: string;
  publishedAt: Date;
  updatedAt?: Date;
  image?: string;
  tags?: string[];
}): object {
  const url = `${SITE_URL}/${params.locale}/blog/${params.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: params.title,
    description: params.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    datePublished: params.publishedAt.toISOString(),
    ...(params.updatedAt
      ? { dateModified: params.updatedAt.toISOString() }
      : { dateModified: params.publishedAt.toISOString() }),
    ...(params.image
      ? { image: { "@type": "ImageObject", url: params.image.startsWith("http") ? params.image : SITE_URL + params.image } }
      : {}),
    ...(params.tags?.length ? { keywords: params.tags.join(", ") } : {}),
    inLanguage: params.locale,
  };
}

export function blogBreadcrumb(
  locale: Locale,
  postTitle: string,
  postSlug: string,
): object {
  const labels = BREADCRUMB_LABELS[locale] ?? BREADCRUMB_LABELS.es;
  const blogLabel = locale === "ru" ? "Блог" : "Blog";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: labels.home,
        item: SITE_URL + publicRoute("", locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: blogLabel,
        item: `${SITE_URL}/${locale}/blog/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: postTitle,
        item: `${SITE_URL}/${locale}/blog/${postSlug}/`,
      },
    ],
  };
}

export function blogFaqPage(
  faq: Array<{ q: string; a: string }>,
): object | null {
  if (faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * Build a FAQPage JSON-LD from i18n keys matching `<prefix>.faq_<i>_q/_a`.
 * The count is derived from the bundle so the structured data always matches
 * what `<FaqSection>` renders — no magic number to keep in sync.
 */
export function faqPage(
  messages: Messages,
  prefix: string,
  count: number = countFaq(messages, prefix),
): object | null {
  const mainEntity = [];
  for (let i = 1; i <= count; i++) {
    const q = lookup(messages, `${prefix}.faq_${i}_q`);
    const a = lookup(messages, `${prefix}.faq_${i}_a`);
    if (!q || !a) continue;
    mainEntity.push({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    });
  }
  if (mainEntity.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
