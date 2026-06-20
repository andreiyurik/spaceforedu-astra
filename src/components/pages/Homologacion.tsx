import {
  FileCheck,
  Building2,
  Scale,
  Languages,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/public/shared";
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

const PREFIX = "public.homologacion";

const WHAT_ITEMS = [
  {
    icon: Scale,
    titleKey: `${PREFIX}.what_legal_title`,
    descKey: `${PREFIX}.what_legal_desc`,
    metaKey: `${PREFIX}.what_legal_meta`,
  },
  {
    icon: Building2,
    titleKey: `${PREFIX}.what_work_title`,
    descKey: `${PREFIX}.what_work_desc`,
    metaKey: `${PREFIX}.what_work_meta`,
  },
  {
    icon: FileCheck,
    titleKey: `${PREFIX}.what_study_title`,
    descKey: `${PREFIX}.what_study_desc`,
    metaKey: `${PREFIX}.what_study_meta`,
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

export function HomologacionPage({
  locale,
  messages,
  heroMain,
}: {
  locale: Locale | string;
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
  locale: Locale | string;
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
          src: heroMain?.src ?? "/images/services/homologacion/salamanca-streets-university-garden.webp",
          srcSet: heroMain?.srcSet,
          avifSrcSet: heroMain?.avifSrcSet,
          width: heroMain?.width,
          height: heroMain?.height,
          alt: t(`${PREFIX}.hero_img_alt`),
        }}
        sideRight={{
          src: "/images/lifestyle/spain-flag-waving-blue-sky.webp",
          alt: "Spanish flag waving against a clear blue sky",
        }}
        sideLeft={{
          src: "/images/lifestyle/madrid-almudena-sunset.webp",
          alt: "Almudena Cathedral and Royal Palace of Madrid at sunset",
        }}
      />

      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <PinSectionHead
            title1={t(`${PREFIX}.pin_what_title_1`)}
            accent={t(`${PREFIX}.pin_what_title_accent`)}
            sub={t(`${PREFIX}.pin_what_sub`)}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {WHAT_ITEMS.map((item, i) => (
              <PinServicesCard key={item.titleKey} item={item} delay={i * 80} />
            ))}
          </div>
        </Container>
      </section>

      <PinComparison prefix={PREFIX} rowCount={5} />

      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <PinSectionHead
            title1={t(`${PREFIX}.pin_process_title_1`)}
            accent={t(`${PREFIX}.pin_process_title_accent`)}
            sub={t(`${PREFIX}.pin_process_sub`)}
          />
          <TimelineSection translationPrefix={PREFIX} count={4} />
        </Container>
      </section>

      <PinPricingTeaser prefix={PREFIX} />


      <PinRiskReversal prefix={PREFIX} items={RISK_ITEMS} />

      <CrossSellCard
        title={t(`${PREFIX}.crosssell_title`)}
        description={t(`${PREFIX}.crosssell_desc`)}
        links={[
          {
            label: t(`${PREFIX}.crosssell_espanol`),
            href: publicRoute(publicPages.espanol, locale),
          },
          {
            label: t(`${PREFIX}.crosssell_universidad`),
            href: publicRoute(publicPages.universidad, locale),
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
          <FaqSection translationPrefix={PREFIX} count={5} />
        </Container>
      </section>

      <PinFinalCta
        prefix={PREFIX}
        bgImage="/images/lifestyle/madrid-almudena-sunset.webp"
        sideItemCount={5}
      />
    </>
  );
}
