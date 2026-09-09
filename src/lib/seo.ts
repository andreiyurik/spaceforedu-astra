import type { Locale } from "./constants";

type PageKey =
  | "home"
  | "homologacion"
  | "universidad"
  | "espanol"
  | "precios"
  | "privacy"
  | "legalNotice"
  | "cookies"
  | "blog"
  | "graciasHomologacion"
  | "graciasConsulta";

const SEO: Record<PageKey, Record<Locale, { title: string; description: string }>> = {
  home: {
    es: {
      title: "Space for Edu — Educación en España de principio a fin",
      description:
        "Homologación de títulos, admisión universitaria, español y soporte legal. 15+ años acompañando a estudiantes de todo el mundo.",
    },
    en: {
      title: "Space for Edu — Spanish education end to end",
      description:
        "Degree homologation, university admission, Spanish courses and legal support. 15+ years helping students from around the world.",
    },
    ru: {
      title: "Space for Edu — образование в Испании под ключ",
      description:
        "Омологация дипломов, поступление в вузы, испанский и юр. сопровождение. 15+ лет помогаем студентам со всего мира.",
    },
  },
  homologacion: {
    es: {
      title: "Homologación de títulos en España — Space for Edu",
      description:
        "Acompañamiento experto, tutor personal y panel online. Homologamos tu título ante el Ministerio de Educación español.",
    },
    en: {
      title: "Degree homologation in Spain — Space for Edu",
      description:
        "Expert guidance, personal advisor and online dashboard. We homologate your degree with the Spanish Ministry of Education.",
    },
    ru: {
      title: "Омологация диплома в Испании — Space for Edu",
      description:
        "Экспертное сопровождение, персональный куратор и онлайн-панель. Признаём диплом в Министерстве образования Испании.",
    },
  },
  universidad: {
    es: {
      title: "Acceso a universidades españolas — Space for Edu",
      description:
        "Te ayudamos a entrar en una universidad española: seleccionamos programa, preparamos documentos y te llevamos hasta la matrícula.",
    },
    en: {
      title: "University admission in Spain — Space for Edu",
      description:
        "We help you get into a Spanish university: we select your program, prepare documents and walk you through to enrollment.",
    },
    ru: {
      title: "Поступление в испанские вузы — Space for Edu",
      description:
        "Подберём университет и программу, подготовим документы и доведём до зачисления.",
    },
  },
  espanol: {
    es: {
      title: "Clases de español — Space for Edu",
      description:
        "Clases individuales y en grupo con profesores nativos certificados. Niveles A1–C2 y preparación DELE/SIELE.",
    },
    en: {
      title: "Spanish lessons — Space for Edu",
      description:
        "One-on-one and group lessons with certified native teachers. A1–C2 and DELE/SIELE exam prep.",
    },
    ru: {
      title: "Уроки испанского — Space for Edu",
      description:
        "Индивидуальные и групповые уроки с сертифицированными носителями. От A1 до C2, подготовка к DELE/SIELE.",
    },
  },
  precios: {
    es: {
      title: "Precios — Space for Edu",
      description:
        "Sin sorpresas: revisamos tus documentos antes de cobrar. Elige entre Homologación, Integral y VIP.",
    },
    en: {
      title: "Pricing — Space for Edu",
      description:
        "Transparent pricing: we review your documents before charging. Choose from Homologation, Integral and VIP.",
    },
    ru: {
      title: "Цены — Space for Edu",
      description:
        "Прозрачные цены: сначала проверяем документы, потом берём оплату. Тарифы Омологация, Интеграл и VIP.",
    },
  },
  privacy: {
    es: {
      title: "Política de privacidad — Space for Edu",
      description: "Cómo Space for Edu trata los datos personales.",
    },
    en: {
      title: "Privacy policy — Space for Edu",
      description: "How Space for Edu handles personal data.",
    },
    ru: {
      title: "Политика конфиденциальности — Space for Edu",
      description: "Как Space for Edu обрабатывает персональные данные.",
    },
  },
  legalNotice: {
    es: {
      title: "Aviso legal — Space for Edu",
      description:
        "Información legal de Space for Edu: datos del prestador del servicio conforme a la LSSI-CE.",
    },
    en: {
      title: "Legal notice — Space for Edu",
      description:
        "Legal information about Space for Edu: service provider details per Spanish LSSI-CE.",
    },
    ru: {
      title: "Юридическая информация — Space for Edu",
      description:
        "Юридические данные Space for Edu в соответствии с испанским законом LSSI-CE.",
    },
  },
  blog: {
    es: {
      title: "Blog — Space for Edu",
      description:
        "Artículos expertos sobre homologación de títulos, universidades españolas, cursos de español y vida estudiantil en España. Guías actualizadas por el equipo de Space for Edu.",
    },
    en: {
      title: "Blog — Space for Edu",
      description:
        "Expert articles on degree homologation, Spanish universities, language courses and student life in Spain. Up-to-date guides by the Space for Edu team.",
    },
    ru: {
      title: "Блог — Space for Edu",
      description:
        "Экспертные статьи об омологации дипломов, испанских университетах, курсах испанского и студенческой жизни в Испании. Актуальные гиды от команды Space for Edu.",
    },
  },
  cookies: {
    es: {
      title: "Política de cookies — Space for Edu",
      description:
        "Qué cookies usamos en Space for Edu y cómo gestionarlas.",
    },
    en: {
      title: "Cookies policy — Space for Edu",
      description: "What cookies we use at Space for Edu and how to manage them.",
    },
    ru: {
      title: "Политика cookies — Space for Edu",
      description: "Какие cookies мы используем и как ими управлять.",
    },
  },
  graciasHomologacion: {
    es: {
      title: "Pago recibido — Space for Edu",
      description:
        "Hemos recibido tu pago. Estos son los siguientes pasos de tu homologación y los documentos que necesitamos.",
    },
    en: {
      title: "Payment received — Space for Edu",
      description:
        "We have received your payment. Here are the next steps of your homologation and the documents we need.",
    },
    ru: {
      title: "Оплата получена — Space for Edu",
      description:
        "Мы получили вашу оплату. Вот следующие шаги омологации и документы, которые нам нужны.",
    },
  },
  graciasConsulta: {
    es: {
      title: "Consulta reservada — Space for Edu",
      description:
        "Tu consulta con un experto está reservada. Te contamos qué pasa ahora y cómo prepararla.",
    },
    en: {
      title: "Consultation booked — Space for Edu",
      description:
        "Your expert consultation is booked. Here is what happens next and how to prepare for it.",
    },
    ru: {
      title: "Консультация забронирована — Space for Edu",
      description:
        "Ваша консультация с экспертом забронирована. Рассказываем, что дальше и как подготовиться.",
    },
  },
};

export function getSeo(page: PageKey, locale: Locale) {
  const bundle = SEO[page];
  return bundle[locale] ?? bundle.es;
}
