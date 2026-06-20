import {
  FileCheck,
  GraduationCap,
  Languages,
  ShieldCheck,
  HandCoins,
  ArrowRight,
  Globe2,
} from "lucide-react";
import type { CSSProperties } from "react";
import { Reveal, AnimatedCounter } from "@/components/public/animations";
import { Container } from "@/components/public/shared";
import { ConsultationDialog } from "@/components/public/ConsultationDialog";
import { UniversityLogoBar } from "@/components/public/UniversityLogoBar";
import { PinComparison } from "@/components/public/pin/PinComparison";
import { PinFinalCta } from "@/components/public/pin/PinFinalCta";
import { publicRoute, publicPages } from "@/lib/routes";
import { I18nProvider, useTranslation } from "@/lib/i18n/react";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/constants";

const H = "public.home";

interface HeroImageProps {
  src: string;
  srcSet?: string;
  avifSrcSet?: string;
  width: number;
  height: number;
}

/** Split a stat string like "1700+" / "98%" into an animatable number + suffix. */
function parseStat(raw: string): { num: number; suffix: string } {
  const m = raw.match(/^(\d[\d\s.,]*)(.*)$/);
  if (!m) return { num: 0, suffix: raw };
  return { num: parseInt(m[1].replace(/[\s.,]/g, ""), 10), suffix: m[2] };
}

/** Collage tile layout — kept inline so it survives View-Transition swaps. */
const tileFrame: CSSProperties = {
  position: "absolute",
  borderRadius: "28px",
  overflow: "hidden",
  boxShadow:
    "0 2px 4px rgba(38,34,30,0.05), 0 22px 44px -24px rgba(38,34,30,0.32)",
};
const tileImg = (objectPosition = "center"): CSSProperties => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition,
});

export function HomePage({
  locale,
  messages,
  heroMain,
}: {
  locale: Locale;
  messages: Messages;
  heroMain?: HeroImageProps;
}) {
  return (
    <I18nProvider locale={locale} messages={messages}>
      <PageBody locale={locale} heroMain={heroMain} />
    </I18nProvider>
  );
}

function PageBody({
  locale,
  heroMain,
}: {
  locale: Locale;
  heroMain?: HeroImageProps;
}) {
  const { t } = useTranslation();
  const pricingHref = publicRoute(publicPages.precios, locale) + "#plans";

  const services = [
    {
      icon: FileCheck,
      title: t(`${H}.service_homologacion_title`),
      desc: t(`${H}.pin_service_homologation_desc`),
      href: publicRoute(publicPages.homologacion, locale),
    },
    {
      icon: GraduationCap,
      title: t(`${H}.service_universidad_title`),
      desc: t(`${H}.pin_service_university_desc`),
      href: publicRoute(publicPages.universidad, locale),
    },
    {
      icon: Languages,
      title: t(`${H}.service_espanol_title`),
      desc: t(`${H}.pin_service_spanish_desc`),
      href: publicRoute(publicPages.espanol, locale),
    },
  ];

  const stats = [
    { value: t(`${H}.pin_hero_stat_1_value`), label: t(`${H}.pin_hero_stat_1_label`) },
    { value: t(`${H}.pin_hero_stat_2_value`), label: t(`${H}.pin_hero_stat_2_label`) },
    { value: t(`${H}.pin_hero_stat_3_value`), label: t(`${H}.pin_hero_stat_3_label`) },
  ];

  const risk = [
    { icon: ShieldCheck, title: t(`${H}.pin_risk_item_1_title`), desc: t(`${H}.pin_risk_item_1_desc`) },
    { icon: HandCoins, title: t(`${H}.pin_risk_item_2_title`), desc: t(`${H}.pin_risk_item_2_desc`) },
    { icon: FileCheck, title: t(`${H}.pin_risk_item_3_title`), desc: t(`${H}.pin_risk_item_3_desc`) },
  ];

  const testimonials = [
    { quote: t(`${H}.pin_test_1_quote`), name: t(`${H}.pin_test_1_name`), where: t(`${H}.pin_test_1_where`) },
    { quote: t(`${H}.pin_test_2_quote`), name: t(`${H}.pin_test_2_name`), where: t(`${H}.pin_test_2_where`) },
  ];

  return (
    <>
      {/* ───────────────── Hero ───────────────── */}
      <section className="bg-[var(--surface-soft)] overflow-hidden">
        <Container className="pt-12 pb-10 sm:pt-16 sm:pb-12 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <Reveal direction="up">
                <span className="t-eyebrow">{t(`${H}.pin_hero_eyebrow`)}</span>
              </Reveal>
              <Reveal direction="up" delay={60}>
                <h1 className="mt-4 font-display font-semibold tracking-[-0.025em] text-[var(--ink)] text-[38px] leading-[1.04] sm:text-[52px] lg:text-[60px]">
                  {t(`${H}.pin_hero_title_1`)}{" "}
                  <span className="text-[var(--primary)]">{t(`${H}.pin_hero_title_accent`)}</span>
                </h1>
              </Reveal>
              <Reveal direction="up" delay={120}>
                <p className="mt-6 max-w-[520px] text-[18px] leading-[1.55] text-[var(--mute)]">
                  {t(`${H}.pin_hero_subtitle`)}
                </p>
              </Reveal>
              <Reveal direction="up" delay={180}>
                <div className="mt-8 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <ConsultationDialog>
                      <button
                        type="button"
                        className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[var(--charcoal)] px-8 text-[16px] font-bold text-white shadow-[0_12px_30px_-12px_rgba(38,34,30,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--ink)] hover:shadow-[0_18px_40px_-14px_rgba(38,34,30,0.6)] active:translate-y-0"
                      >
                        {t(`${H}.hero_cta_consult`)}
                        <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </ConsultationDialog>
                    <a
                      href={pricingHref}
                      className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[var(--hairline)] bg-white px-7 text-[16px] font-bold text-[var(--ink)] transition-all hover:-translate-y-0.5 hover:bg-[var(--surface-card)] hover:shadow-[0_10px_24px_-12px_rgba(38,34,30,0.25)]"
                    >
                      {t(`${H}.pin_hero_cta_secondary`)}
                    </a>
                  </div>
                  <span className="pl-1 text-[13px] text-[var(--mute)]">
                    {t(`${H}.pin_hero_reassure`)}
                  </span>
                </div>
              </Reveal>

              {/* Social-proof row — anchored to the headline, no floating gap */}
              <Reveal direction="up" delay={240}>
                <div className="mt-10 grid max-w-[460px] grid-cols-3 gap-4 border-t border-[var(--hairline-soft)] pt-7">
                  {stats.map(({ value, label }) => {
                    const { num, suffix } = parseStat(value);
                    return (
                      <div key={label}>
                        <div className="font-display text-[28px] font-bold leading-none tracking-[-0.03em] text-[var(--ink)]">
                          <AnimatedCounter value={num} suffix={suffix} />
                        </div>
                        <div className="mt-2 text-[12px] leading-[1.3] text-[var(--mute)]">
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>

            {/* Art-directed collage: student + Almudena + flag + a tenure badge.
                No floating pills — the imagery carries it.
                Layout is set via inline styles (not utility/`.hero-tile`
                classes) so it survives client-side View-Transition swaps —
                a custom CSS class can momentarily drop on locale switch,
                which would collapse the absolute layout. */}
            <Reveal direction="left" delay={120}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "500px",
                  marginInline: "auto",
                  // aspect-ratio (not a utility height class) keeps the collage
                  // from collapsing when arbitrary classes drop mid View-Transition.
                  aspectRatio: "10 / 11",
                }}
              >
                {/* Main — student, top-right */}
                <div className="hero-tile" style={{ ...tileFrame, top: 0, right: 0, height: "64%", width: "64%" }}>
                  <img
                    src={heroMain?.src ?? "/images/hero/hero-student-salamanca-docs.webp"}
                    srcSet={heroMain?.srcSet}
                    sizes="(min-width: 1024px) 30vw, 60vw"
                    alt={t(`${H}.hero_img_alt`)}
                    width={heroMain?.width ?? 1280}
                    height={heroMain?.height ?? 1280}
                    loading="eager"
                    className="anim-kenburns"
                    style={tileImg("60% 30%")}
                  />
                </div>
                {/* Spanish flag — bottom, centre-right */}
                <div className="hero-tile" style={{ ...tileFrame, bottom: 0, right: "14%", height: "38%", width: "46%" }}>
                  <img
                    src="/images/lifestyle/spain-flag-waving-blue-sky.webp"
                    alt="Spanish flag waving against a clear blue sky"
                    loading="lazy"
                    style={tileImg()}
                  />
                </div>
                {/* Almudena cathedral — bottom-left */}
                <div className="hero-tile" style={{ ...tileFrame, bottom: "8%", left: 0, height: "42%", width: "38%" }}>
                  <img
                    src="/images/lifestyle/madrid-almudena-sunset.webp"
                    alt="Almudena Cathedral and the Royal Palace of Madrid at sunset"
                    loading="lazy"
                    style={tileImg()}
                  />
                </div>
                {/* Tenure badge — mid-left */}
                <div
                  className="flex flex-col items-center justify-center p-3 text-center"
                  style={{
                    position: "absolute",
                    top: "16%",
                    left: 0,
                    height: "30%",
                    width: "31%",
                    borderRadius: "24px",
                    background: "#f4e9d7",
                    boxShadow: "0 2px 4px rgba(38,34,30,0.05)",
                  }}
                >
                  <span className="font-display text-[30px] sm:text-[38px] font-bold leading-none tracking-[-0.03em] text-[var(--primary)]">
                    {t(`${H}.pin_hero_badge_years`)}
                  </span>
                  <span className="mt-1.5 text-[10px] sm:text-[11px] font-medium leading-tight text-[var(--mute)]">
                    {t(`${H}.pin_hero_badge_years_label`)}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ───────────────── Logo trust bar (animated marquee) ───────────────── */}
      <UniversityLogoBar titleKey={`${H}.logo_bar_title`} />

      {/* ───────────────── Three services ───────────────── */}
      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <Reveal direction="up">
            <h2 className="max-w-[640px] font-display text-[32px] sm:text-[44px] font-bold tracking-[-0.02em] leading-[1.1] text-[var(--ink)]">
              {t(`${H}.pin_services_title_1`)}{" "}
              <span className="text-[var(--primary)]">{t(`${H}.pin_services_title_accent`)}</span>
            </h2>
            <p className="mt-4 max-w-[560px] text-[17px] leading-[1.6] text-[var(--mute)]">
              {t(`${H}.pin_services_sub`)}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {services.map(({ icon: Icon, title, desc, href }, i) => (
              <Reveal key={title} direction="up" delay={i * 90}>
                <a
                  href={href}
                  className="group flex h-full flex-col rounded-[28px] border border-[var(--hairline-soft)] bg-[var(--surface-soft)] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--hairline)] hover:bg-white hover:shadow-[0_24px_48px_-28px_rgba(38,34,30,0.35)]"
                >
                  <Icon className="h-8 w-8 text-[var(--primary)]" aria-hidden="true" strokeWidth={1.6} />
                  <h3 className="mt-6 font-display text-[21px] font-bold tracking-[-0.01em] text-[var(--ink)]">
                    {title}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-[var(--mute)]">{desc}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-bold text-[var(--primary)]">
                    {t(`${H}.pin_service_arrow`).replace(/\s*→\s*$/, "")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────────── Honest comparison ───────────────── */}
      <PinComparison prefix={H} rowCount={5} />

      {/* ───────────────── Risk reversal ───────────────── */}
      <section className="bg-white">
        <Container className="py-16 sm:py-24">
          <Reveal direction="up">
            <h2 className="font-display text-[32px] sm:text-[44px] font-bold tracking-[-0.02em] leading-[1.1] text-[var(--ink)]">
              {t(`${H}.pin_risk_title_1`)}{" "}
              <span className="text-[var(--primary)]">{t(`${H}.pin_risk_title_accent`)}</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-3">
            {risk.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} direction="up" delay={i * 90}>
                <div>
                  <Icon className="h-8 w-8 text-[var(--primary)]" aria-hidden="true" strokeWidth={1.6} />
                  <h3 className="mt-5 font-display text-[19px] font-bold leading-[1.25] tracking-[-0.01em] text-[var(--ink)]">
                    {title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--mute)]">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────────── Testimonials ───────────────── */}
      <section className="bg-[var(--surface-soft)]">
        <Container className="py-16 sm:py-24">
          <Reveal direction="up">
            <h2 className="font-display text-[32px] sm:text-[44px] font-bold tracking-[-0.02em] leading-[1.1] text-[var(--ink)]">
              {t(`${H}.pin_test_title_1`)}{" "}
              <span className="text-[var(--primary)]">{t(`${H}.pin_test_title_accent`)}</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {testimonials.map(({ quote, name, where }, i) => (
              <Reveal key={name} direction="up" delay={i * 90}>
                <figure className="flex h-full flex-col rounded-[28px] border border-[var(--hairline-soft)] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgba(38,34,30,0.30)]">
                  <blockquote className="flex-1 font-display text-[19px] font-medium leading-[1.5] tracking-[-0.005em] text-[var(--ink-soft)]">
                    “{quote}”
                  </blockquote>
                  <figcaption className="mt-6">
                    <div className="text-[15px] font-bold text-[var(--ink)]">{name}</div>
                    <div className="text-[13px] text-[var(--mute)]">{where}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────────────── Reach ───────────────── */}
      <section className="bg-white">
        <Container className="py-16 sm:py-20">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-12">
            <Globe2 className="h-12 w-12 shrink-0 text-[var(--primary)]" strokeWidth={1.4} aria-hidden="true" />
            <div>
              <span className="t-eyebrow">{t(`${H}.pin_reach_eyebrow`)}</span>
              <h2 className="mt-3 font-display text-[26px] sm:text-[32px] font-bold leading-[1.15] tracking-[-0.015em] text-[var(--ink)]">
                {t(`${H}.pin_reach_title_1`)}{" "}
                <span className="text-[var(--primary)]">{t(`${H}.pin_reach_title_accent`)}</span>{" "}
                {t(`${H}.pin_reach_title_2`)}
              </h2>
              <p className="mt-3 max-w-[680px] text-[15px] leading-[1.6] text-[var(--mute)]">
                {t(`${H}.pin_reach_sub`)}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ───────────────── Final CTA ───────────────── */}
      <PinFinalCta prefix={H} sideItemCount={5} />
    </>
  );
}
