import { type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/public/animations";
import { Container } from "@/components/public/shared";
import { ConsultationDialog } from "@/components/public/ConsultationDialog";
import { useTranslation } from "@/lib/i18n/react";

export interface CollageImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  srcSet?: string;
  /** Optional AVIF srcSet rendered as a <source> for browsers that support AVIF
   *  (Safari < 16 / older Android Chrome fall through to the WebP <img>). */
  avifSrcSet?: string;
  sizes?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}

export interface PinHeroPill {
  kind: "dot" | "icon";
  icon?: LucideIcon;
  labelKey: string;
  /** Explicit placement on the collage. Defaults to index-based (first = top-right, second = bottom-left). */
  pos?: "tr" | "bl";
}

export function PinHeroCollage({
  prefix,
  secondaryHref,
  main,
  sideRight,
  sideLeft,
  pills,
  badgeValueKey = "pin_hero_badge_years",
  badgeLabelKey = "pin_hero_badge_years_label",
}: {
  prefix: string;
  secondaryHref: string;
  main: CollageImage;
  sideRight: CollageImage;
  sideLeft: CollageImage;
  pills?: PinHeroPill[];
  badgeValueKey?: string;
  badgeLabelKey?: string;
}) {
  const { t } = useTranslation();
  const k = (suffix: string) => t(`${prefix}.${suffix}`);

  return (
    <section className="bg-[var(--surface-soft)] pt-16 pb-8 sm:pt-20">
      <Container>
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <Reveal direction="up">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-blue-deep)] mb-5">
                {k("pin_hero_eyebrow")}
              </span>
            </Reveal>
            <Reveal direction="up" delay={50}>
              <h1 className="font-display text-[40px] sm:text-[56px] lg:text-[64px] font-semibold tracking-[-0.022em] text-[var(--ink)] leading-[1.05] m-0">
                {k("pin_hero_title_1")}{" "}
                <span className="text-[var(--primary)]">{k("pin_hero_title_accent")}</span>
              </h1>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <p className="mt-5 text-[18px] leading-[1.5] text-[var(--mute)] max-w-[520px]">
                {k("pin_hero_subtitle")}
              </p>
            </Reveal>
            <Reveal direction="up" delay={150}>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <ConsultationDialog>
                  <button className="pin-btn pin-btn-primary h-12 px-6 text-[15px]">
                    {k("pin_hero_cta_primary")}
                  </button>
                </ConsultationDialog>
                <a href={secondaryHref}>
                  <button className="pin-btn pin-btn-secondary h-12 px-6 text-[15px]">
                    {k("pin_hero_cta_secondary")}
                  </button>
                </a>
              </div>
            </Reveal>
            <Reveal direction="up" delay={200}>
              <p className="mt-7 text-[13px] text-[var(--mute)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22a655] inline-block" />
                {k("pin_hero_reassure")}
              </p>
            </Reveal>
            <Reveal direction="up" delay={250}>
              <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-[var(--hairline-soft)]">
                {[1, 2, 3].map((n) => (
                  <div key={n}>
                    <div className="font-display text-[28px] sm:text-[36px] font-bold text-[var(--ink)] tracking-[-0.03em] leading-none">
                      {k(`pin_hero_stat_${n}_value`)}
                    </div>
                    <div className="text-[13px] text-[var(--mute)] mt-1.5 leading-tight">
                      {k(`pin_hero_stat_${n}_label`)}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal direction="up" delay={100}>
            <div className="relative h-[460px] sm:h-[560px] hidden md:block">
              <div className="absolute top-0 right-0 w-[62%] h-[64%] rounded-[32px] overflow-hidden bg-[var(--surface-card)]">
                <CollagePicture
                  image={main}
                  defaultSizes="(min-width: 1024px) 40vw, 50vw"
                  defaultLoading="eager"
                  defaultFetchPriority="high"
                />
              </div>
              <div className="absolute bottom-0 right-[14%] w-[46%] h-[38%] rounded-[32px] overflow-hidden bg-[var(--surface-card)]">
                <CollagePicture
                  image={sideRight}
                  defaultSizes="(min-width: 1024px) 24vw, 30vw"
                />
              </div>
              <div className="absolute bottom-[8%] left-0 w-[38%] h-[42%] rounded-[32px] overflow-hidden bg-[var(--surface-card)]">
                <CollagePicture
                  image={sideLeft}
                  defaultSizes="(min-width: 1024px) 20vw, 25vw"
                />
              </div>
              <div
                className="absolute top-[18%] left-0 w-[30%] h-[30%] rounded-[32px] flex flex-col items-center justify-center text-center p-4 box-border"
                style={{ background: "#f4e9d7", color: "var(--primary)" }}
              >
                <span className="font-display text-[36px] font-bold tracking-[-0.03em] leading-none">
                  {k(badgeValueKey)}
                </span>
                <small className="text-[11px] text-[var(--mute)] font-medium leading-tight mt-1 font-sans">
                  {k(badgeLabelKey)}
                </small>
              </div>
              {pills?.map((pill, i) => {
                const Icon = pill.icon;
                const placement = pill.pos ?? (i === 0 ? "tr" : "bl");
                const pos =
                  placement === "tr"
                    ? "top-[36%] right-[-8px]"
                    : "bottom-[2%] left-[40%]";
                return (
                  <div
                    key={i}
                    className={`absolute ${pos} bg-white border border-[var(--hairline-soft)] rounded-full px-4 py-2.5 flex items-center gap-2 text-[13px] font-bold text-[var(--ink)] shadow-sm`}
                  >
                    {pill.kind === "dot" ? (
                      <span className="w-2 h-2 rounded-full bg-[#22a655] inline-block" />
                    ) : Icon ? (
                      <Icon className="h-4 w-4 text-[var(--primary)]" />
                    ) : null}
                    {k(pill.labelKey)}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function CollagePicture({
  image,
  defaultSizes,
  defaultLoading = "lazy",
  defaultFetchPriority,
}: {
  image: CollageImage;
  defaultSizes: string;
  defaultLoading?: "eager" | "lazy";
  defaultFetchPriority?: "high" | "low" | "auto";
}) {
  const sizes = image.sizes ?? defaultSizes;
  const loading = image.loading ?? defaultLoading;
  const fetchPriority = image.fetchPriority ?? defaultFetchPriority;

  const img = (
    <img
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      srcSet={image.srcSet}
      sizes={sizes}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      className="w-full h-full object-cover"
    />
  );

  if (!image.avifSrcSet) return img;

  return (
    <picture>
      <source type="image/avif" srcSet={image.avifSrcSet} sizes={sizes} />
      {img}
    </picture>
  );
}
