import { Reveal } from "@/components/public/animations";
import { Container } from "@/components/public/shared";
import { useTranslation } from "@/lib/i18n/react";
import { WorldMapArcs } from "@/components/public/WorldMapArcs";

export function PinReachSection({
  prefix,
  countries,
  illustrationSrc = "/images/world.svg",
  background = "soft",
}: {
  prefix: string;
  countries: readonly string[];
  illustrationSrc?: string;
  background?: "soft" | "white";
}) {
  const { t } = useTranslation();
  const sectionBg =
    background === "white" ? "bg-white" : "bg-[var(--surface-soft)]";

  return (
    <section className={`py-16 sm:py-20 ${sectionBg}`}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal direction="up">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-blue-deep)] mb-3">
                {t(`${prefix}.pin_reach_eyebrow`)}
              </span>
              <h2 className="font-display text-[32px] sm:text-[42px] font-bold tracking-[-0.03em] leading-[1.1] text-[var(--ink)] m-0 mb-4">
                {t(`${prefix}.pin_reach_title_1`)}{" "}
                <span className="text-[var(--primary)]">
                  {t(`${prefix}.pin_reach_title_accent`)}
                </span>{" "}
                {t(`${prefix}.pin_reach_title_2`)}
              </h2>
              <p className="text-[15px] leading-[1.55] text-[var(--mute)] m-0 mb-3">
                {t(`${prefix}.pin_reach_sub`)}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {countries.map((c) => (
                  <span
                    key={c}
                    className="bg-[var(--surface-card)] rounded-full px-3 py-1.5 text-[13px] font-semibold text-[var(--body-color)]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal direction="up" delay={100}>
            <div className="bg-white rounded-[32px] overflow-hidden border border-[var(--hairline-soft)] p-8">
              <WorldMapArcs src={illustrationSrc} />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
