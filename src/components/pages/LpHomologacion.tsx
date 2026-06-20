import {
  UserCheck,
  Award,
  ShieldCheck,
  FileSearch,
  FileStack,
  Landmark,
  BadgeCheck,
} from "lucide-react";
import { Container } from "@/components/public/shared";
import { Reveal } from "@/components/public/animations";
import { WaButton } from "@/components/public/WhatsAppCta";
import { I18nProvider, useTranslation } from "@/lib/i18n/react";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/constants";

const P = "lp.hom";
const H = "public.homologacion";

const LOGOS = [
  { src: "/images/universities/usal.webp", alt: "Universidad de Salamanca" },
  { src: "/images/universities/ucm.webp", alt: "Universidad Complutense de Madrid" },
  { src: "/images/universities/uam.svg", alt: "Universidad Autónoma de Madrid" },
  { src: "/images/universities/ub.svg", alt: "Universitat de Barcelona" },
  { src: "/images/universities/uc3m.svg", alt: "Universidad Carlos III" },
  { src: "/images/universities/ugr.svg", alt: "Universidad de Granada" },
];

export function LpHomologacionPage({
  locale,
  messages,
  waHref,
}: {
  locale: Locale;
  messages: Messages;
  waHref: string;
}) {
  return (
    <I18nProvider locale={locale} messages={messages}>
      <Body waHref={waHref} />
    </I18nProvider>
  );
}

function Body({ waHref }: { waHref: string }) {
  const { t } = useTranslation();
  const wa = t(`${P}.wa_cta`);

  const chips = [
    { icon: Award, label: t(`${P}.chip_years`) },
    { icon: Landmark, label: t(`${P}.chip_ministry`) },
    { icon: BadgeCheck, label: t(`${P}.chip_world`) },
  ];

  const why = [
    { icon: UserCheck, title: t(`${H}.adv_advisor_title`), desc: t(`${H}.adv_advisor_desc`) },
    { icon: Award, title: t(`${H}.adv_expertise_title`), desc: t(`${H}.adv_expertise_desc`) },
    { icon: ShieldCheck, title: t(`${H}.adv_transparency_title`), desc: t(`${H}.adv_transparency_desc`) },
  ];

  const steps = [
    { icon: FileSearch, title: t(`${H}.process_1_title`), desc: t(`${H}.process_1_desc`) },
    { icon: FileStack, title: t(`${H}.process_2_title`), desc: t(`${H}.process_2_desc`) },
    { icon: Landmark, title: t(`${H}.process_3_title`), desc: t(`${H}.process_3_desc`) },
  ];

  return (
    <>
      {/* ───────────────── Hero ───────────────── */}
      <section className="bg-[var(--surface-soft)] overflow-hidden">
        <Container className="py-14 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <Reveal direction="up">
                <span className="t-eyebrow">{t(`${P}.eyebrow`)}</span>
              </Reveal>
              <Reveal direction="up" delay={60}>
                <h1 className="mt-4 font-display font-semibold tracking-[-0.025em] text-[var(--ink)] text-[40px] leading-[1.04] sm:text-[56px] lg:text-[64px]">
                  {t(`${H}.hero_title_1`)}{" "}
                  <span className="text-[var(--primary)]">{t(`${H}.hero_title_accent`)}</span>
                </h1>
              </Reveal>
              <Reveal direction="up" delay={120}>
                <p className="mt-6 max-w-[480px] text-[18px] leading-[1.55] text-[var(--mute)]">
                  {t(`${P}.subtitle`)}
                </p>
              </Reveal>
              <Reveal direction="up" delay={180}>
                <div className="mt-9 flex flex-col items-start gap-3">
                  <WaButton href={waHref} label={wa} />
                  <span className="text-[13px] text-[var(--ash)] pl-1">
                    {t(`${P}.wa_reassure`)}
                  </span>
                </div>
              </Reveal>
            </div>

            <Reveal direction="left" delay={120}>
              <div className="relative">
                <img
                  src="/images/hero/hero-student-salamanca-docs.webp"
                  alt={t(`${H}.hero_photo_alt`)}
                  width={1280}
                  height={1280}
                  loading="eager"
                  className="w-full aspect-[4/5] sm:aspect-square object-cover rounded-[32px]"
                />
              </div>
            </Reveal>
          </div>

          {/* trust chips */}
          <Reveal direction="up" delay={240}>
            <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--hairline-soft)] pt-7">
              {chips.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--body-color)]">
                  <Icon className="h-[18px] w-[18px] text-[var(--primary)]" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ───────────────── Logo trust bar ───────────────── */}
      <section className="bg-white border-y border-[var(--hairline-soft)]">
        <Container className="py-10">
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--ash)]">
            {t(`${P}.logos_title`)}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {LOGOS.map(({ src, alt }) => (
              <img
                key={src}
                src={src}
                alt={alt}
                className="h-7 sm:h-8 w-auto object-contain opacity-55 grayscale transition hover:opacity-80"
                loading="lazy"
              />
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────────── Why trust us ───────────────── */}
      <section className="bg-white">
        <Container className="py-20 sm:py-28">
          <Reveal direction="up">
            <h2 className="max-w-[640px] font-display text-[32px] sm:text-[44px] font-bold tracking-[-0.02em] leading-[1.1] text-[var(--ink)]">
              {t(`${P}.why_title`)}{" "}
              <span className="text-[var(--primary)]">{t(`${P}.why_accent`)}</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-3">
            {why.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} direction="up" delay={i * 90}>
                <div>
                  <Icon className="h-8 w-8 text-[var(--primary)]" aria-hidden="true" strokeWidth={1.6} />
                  <h3 className="mt-5 font-display text-[21px] font-bold tracking-[-0.01em] text-[var(--ink)]">
                    {title}
                  </h3>
                  <p className="mt-2.5 text-[16px] leading-[1.6] text-[var(--mute)]">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Risk reversal — the trust anchor */}
          <Reveal direction="up" delay={120}>
            <div className="mt-16 flex flex-col gap-6 rounded-[32px] bg-[var(--surface-card)] p-8 sm:flex-row sm:items-center sm:gap-10 sm:p-12">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/12">
                <ShieldCheck className="h-7 w-7 text-[var(--primary)]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-[24px] sm:text-[28px] font-bold tracking-[-0.01em] leading-[1.15] text-[var(--ink)]">
                  {t(`${P}.risk_title`)}
                </h3>
                <p className="mt-3 max-w-[640px] text-[16px] leading-[1.6] text-[var(--body-color)]">
                  {t(`${P}.risk_desc`)}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ───────────────── How it works ───────────────── */}
      <section className="bg-[var(--surface-soft)]">
        <Container className="py-20 sm:py-28">
          <Reveal direction="up">
            <h2 className="font-display text-[32px] sm:text-[44px] font-bold tracking-[-0.02em] leading-[1.1] text-[var(--ink)]">
              {t(`${P}.steps_title`)}{" "}
              <span className="text-[var(--primary)]">{t(`${P}.steps_accent`)}</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} direction="up" delay={i * 90}>
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <span className="font-display text-[40px] font-bold leading-none text-[var(--stone)]">
                      0{i + 1}
                    </span>
                    <Icon className="h-7 w-7 text-[var(--primary)]" aria-hidden="true" strokeWidth={1.6} />
                  </div>
                  <h3 className="mt-5 font-display text-[20px] font-bold tracking-[-0.01em] text-[var(--ink)]">
                    {title}
                  </h3>
                  <p className="mt-2.5 text-[16px] leading-[1.6] text-[var(--mute)]">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────────── Testimonial ───────────────── */}
      <section className="bg-white">
        <Container className="py-20 sm:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal direction="up">
              <img
                src="/images/services/espanol/students-spanish-class-focused.webp"
                alt=""
                className="aspect-[4/5] w-full max-w-[360px] rounded-[32px] object-cover"
                loading="lazy"
              />
            </Reveal>
            <Reveal direction="up" delay={100}>
              <div>
                <span className="t-eyebrow">{t(`${P}.proof_eyebrow`)}</span>
                <blockquote className="mt-5 font-display text-[24px] sm:text-[30px] font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--ink)]">
                  “{t(`${H}.testimonial_1_text`)}”
                </blockquote>
                <div className="mt-6">
                  <div className="text-[16px] font-bold text-[var(--ink)]">
                    {t(`${H}.testimonial_1_name`)}
                  </div>
                  <div className="text-[14px] text-[var(--mute)]">
                    {t(`${H}.testimonial_1_role`)}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ───────────────── Final CTA ───────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(38,38,34,0.78), rgba(38,38,34,0.88)), url(/images/lifestyle/madrid-almudena-sunset.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container className="py-24 sm:py-32 text-center">
          <Reveal direction="up">
            <h2 className="mx-auto max-w-[720px] font-display text-[34px] sm:text-[48px] font-bold tracking-[-0.02em] leading-[1.08] text-white">
              {t(`${P}.final_title`)}{" "}
              <span className="text-[#ff8079]">{t(`${P}.final_accent`)}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-[1.55] text-white/80">
              {t(`${P}.final_sub`)}
            </p>
            <div className="mt-9 flex flex-col items-center gap-3">
              <WaButton href={waHref} label={wa} />
              <span className="text-[13px] text-white/65">{t(`${P}.wa_reassure`)}</span>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Mobile sticky WhatsApp */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--hairline-soft)] bg-white/95 px-4 py-3 backdrop-blur lg:hidden pb-[calc(12px+env(safe-area-inset-bottom))]">
        <WaButton href={waHref} label={wa} size="md" className="w-full" />
      </div>
    </>
  );
}
