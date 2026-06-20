import {
  BookOpen,
  Award,
  GraduationCap,
  Languages,
  Clock,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/public/shared";
import { UniversityLogoBar } from "@/components/public/UniversityLogoBar";
import { CrossSellCard } from "@/components/public/CrossSellCard";
import { FaqSection } from "@/components/public/FaqSection";
import { TimelineSection } from "@/components/public/TimelineSection";
import { PinHeroCollage } from "@/components/public/pin/PinHeroCollage";
import { PinSectionHead } from "@/components/public/pin/PinSectionHead";
import { PinServicesCard } from "@/components/public/pin/PinServicesCard";
import { PinComparison } from "@/components/public/pin/PinComparison";
import { PinPricingTeaser } from "@/components/public/pin/PinPricingTeaser";
import { PinRiskReversal } from "@/components/public/pin/PinRiskReversal";
import { PinFinalCta } from "@/components/public/pin/PinFinalCta";
import { publicRoute, publicPages } from "@/lib/routes";
import { I18nProvider, useTranslation } from "@/lib/i18n/react";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/constants";

const PREFIX = "public.universidad";

const ADMISSION_TYPES = [
  {
    icon: BookOpen,
    titleKey: `${PREFIX}.type_grado_title`,
    descKey: `${PREFIX}.type_grado_desc`,
    metaKey: `${PREFIX}.type_grado_meta`,
  },
  {
    icon: Award,
    titleKey: `${PREFIX}.type_master_title`,
    descKey: `${PREFIX}.type_master_desc`,
    metaKey: `${PREFIX}.type_master_meta`,
  },
  {
    icon: GraduationCap,
    titleKey: `${PREFIX}.type_fp_title`,
    descKey: `${PREFIX}.type_fp_desc`,
    metaKey: `${PREFIX}.type_fp_meta`,
  },
] as const;

const RISK_ITEMS = [
  { icon: Shield, n: 1 },
  { icon: ShieldCheck, n: 2 },
] as const;

interface HeroImageProps {
  src: string;
  srcSet?: string;
  avifSrcSet?: string;
  width: number;
  height: number;
}

export function UniversidadPage({
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
  const preciosHref = publicRoute(publicPages.precios, locale) + "#plans";

  return (
    <>
      <PinHeroCollage
        prefix={PREFIX}
        secondaryHref={preciosHref}
        main={{
          src: heroMain?.src ?? "/images/lifestyle/graduates-celebration-success.webp",
          srcSet: heroMain?.srcSet,
          avifSrcSet: heroMain?.avifSrcSet,
          width: heroMain?.width,
          height: heroMain?.height,
          alt: t(`${PREFIX}.hero_img_alt`),
        }}
        sideRight={{
          src: "/images/lifestyle/salamanca-university-courtyard-sunset.webp",
          alt: "University of Salamanca courtyard at sunset",
        }}
        sideLeft={{
          src: "/images/lifestyle/madrid-almudena-sunset.webp",
          alt: "Madrid skyline with the Royal Palace at sunset",
        }}
        pills={[
          { kind: "icon", icon: Clock, labelKey: "pin_hero_pill_2", pos: "bl" },
        ]}
      />

      <UniversityLogoBar
        titleKey="public.precios.trust_bar_title"
        noBorderTop
      />

      <section className="py-16 sm:py-20 bg-[var(--surface-soft)]">
        <Container>
          <PinSectionHead
            title1={t(`${PREFIX}.pin_types_title_1`)}
            accent={t(`${PREFIX}.pin_types_title_accent`)}
            sub={t(`${PREFIX}.pin_types_sub`)}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {ADMISSION_TYPES.map((item, i) => (
              <PinServicesCard key={item.titleKey} item={item} delay={i * 80} />
            ))}
          </div>
        </Container>
      </section>

      <PinComparison prefix={PREFIX} rowCount={5} background="white" />

      <section className="py-16 sm:py-20 bg-[var(--surface-soft)]">
        <Container>
          <PinSectionHead
            title1={t(`${PREFIX}.pin_process_title_1`)}
            accent={t(`${PREFIX}.pin_process_title_accent`)}
            sub={t(`${PREFIX}.pin_process_sub`)}
          />
          <TimelineSection translationPrefix={PREFIX} count={5} />
        </Container>
      </section>

      <PinPricingTeaser prefix={PREFIX} background="white" />


      <PinRiskReversal prefix={PREFIX} items={RISK_ITEMS} background="white" />

      <CrossSellCard
        title={t(`${PREFIX}.crosssell_title`)}
        description={t(`${PREFIX}.crosssell_desc`)}
        links={[
          {
            label: t(`${PREFIX}.crosssell_espanol`),
            href: publicRoute(publicPages.espanol, locale),
          },
          {
            label: t(`${PREFIX}.crosssell_homologacion`),
            href: publicRoute(publicPages.homologacion, locale),
          },
        ]}
        badgeLabel={t(`${PREFIX}.crosssell_badge`)}
        badgeIcon={Languages}
      />

      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <PinSectionHead
            title1={t(`${PREFIX}.pin_faq_title_1`)}
            accent={t(`${PREFIX}.pin_faq_title_accent`)}
            sub={t(`${PREFIX}.pin_faq_sub`)}
            align="center"
          />
          <FaqSection translationPrefix={PREFIX} />
        </Container>
      </section>

      <PinFinalCta
        prefix={PREFIX}
        bgImage="/images/lifestyle/sevilla-plaza-espana-golden-hour.webp"
        sideItemCount={5}
      />
    </>
  );
}
