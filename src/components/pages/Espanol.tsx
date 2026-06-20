import {
  Languages,
  Users,
  User,
  GraduationCap,
  Target,
  CalendarCheck,
  Brain,
  BookOpen,
  Briefcase,
  Home,
  Award,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, TiltCard, AnimatedCounter } from "@/components/public/animations";
import {
  FeatureIcon,
  GradientButton,
  PublicHero,
  PublicSection,
  SectionHeading,
} from "@/components/public/shared";
import { PinFinalCta } from "@/components/public/pin/PinFinalCta";
import { ConsultationDialog } from "@/components/public/ConsultationDialog";
import { CrossSellCard } from "@/components/public/CrossSellCard";
import { FaqSection } from "@/components/public/FaqSection";
import { TimelineSection } from "@/components/public/TimelineSection";
import { renderRichText } from "@/lib/i18n/react";
import { FeatureCardGrid } from "@/components/public/FeatureCardGrid";
import { publicRoute, publicPages } from "@/lib/routes";
import { I18nProvider, useTranslation } from "@/lib/i18n/react";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/constants";

const FORMATS = [
  { icon: User, key: "individual" },
  { icon: Users, key: "group" },
  { icon: TrendingUp, key: "intensive" },
] as const;

const LEVELS = [
  { level: "A1–A2", icon: BookOpen, key: "beginner", color: "from-emerald-500 to-emerald-600" },
  { level: "B1–B2", icon: Briefcase, key: "intermediate", color: "from-brand-secondary to-blue-600" },
  { level: "C1–C2", icon: Award, key: "advanced", color: "from-brand-primary to-red-600" },
] as const;

const ADVANTAGES = [
  { icon: Languages, titleKey: "public.espanol.adv_native_title", descKey: "public.espanol.adv_native_desc" },
  { icon: GraduationCap, titleKey: "public.espanol.adv_dele_title", descKey: "public.espanol.adv_dele_desc" },
  { icon: Brain, titleKey: "public.espanol.adv_method_title", descKey: "public.espanol.adv_method_desc" },
  { icon: CalendarCheck, titleKey: "public.espanol.adv_flexible_title", descKey: "public.espanol.adv_flexible_desc" },
] as const;

export function EspanolPage({
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

interface HeroImageProps {
  src: string;
  srcSet?: string;
  avifSrcSet?: string;
  width: number;
  height: number;
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
      <PublicHero
        fullBleed
        title1={t("public.espanol.hero_title_1")}
        titleAccent={t("public.espanol.hero_title_accent")}
        subtitle={<span>{renderRichText(t("public.espanol.hero_subtitle"))}</span>}
        actions={
          <div className="flex flex-col sm:flex-row gap-3">
            <ConsultationDialog>
              <GradientButton className="w-full sm:w-auto">
                {t("public.espanol.cta_trial")}
              </GradientButton>
            </ConsultationDialog>
            <a href={preciosHref}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-h-[44px] text-base transition-all duration-300"
              >
                {t("public.espanol.cta_pricing")}
              </Button>
            </a>
          </div>
        }
        footer={
          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-6 gap-y-1 text-sm text-muted-foreground">
            {[
              { value: "100+", key: "students" },
              { value: "A1–C2", key: "levels" },
              { value: "3", key: "formats" },
            ].map(({ value, key }, i) => (
              <div key={key} className="flex items-center gap-x-2 sm:gap-x-6">
                {i > 0 && <span className="text-border">·</span>}
                <span>
                  <span className="font-semibold text-foreground">{value}</span>{" "}
                  {t(`public.espanol.hero_stat_${key}`)}
                </span>
              </div>
            ))}
          </div>
        }
        illustration={
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/15 rounded-3xl blur-2xl" />
            <picture>
              {heroMain?.avifSrcSet && (
                <source
                  type="image/avif"
                  srcSet={heroMain.avifSrcSet}
                  sizes="(min-width: 1024px) 40vw, 90vw"
                />
              )}
              <img
                src={heroMain?.src ?? "/images/services/espanol/students-spanish-class-focused.webp"}
                srcSet={heroMain?.srcSet}
                sizes="(min-width: 1024px) 40vw, 90vw"
                alt={t("public.espanol.hero_img_alt")}
                width={heroMain?.width ?? 700}
                height={heroMain?.height ?? 500}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
            </picture>
          </div>
        }
      />

      <PublicSection className="bg-white">
        <SectionHeading
          title={t("public.espanol.formats_title")}
          subtitle={t("public.espanol.formats_subtitle")}
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {FORMATS.map(({ icon, key }, i) => (
            <Reveal key={key} direction="up" delay={i * 120}>
              <TiltCard className="h-full">
                <Card className="h-full border bg-white transition-all duration-300 hover:shadow-xl hover:shadow-brand-secondary/5 group">
                  <CardContent className="p-8 text-center">
                    <FeatureIcon icon={icon} className="mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {t(`public.espanol.format_${key}_title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(`public.espanol.format_${key}_desc`)}
                    </p>
                    <p className="text-xs text-[var(--accent-blue-deep)] font-medium mt-3">
                      {t(`public.espanol.format_${key}_note`)}
                    </p>
                  </CardContent>
                </Card>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </PublicSection>

      <PublicSection className="bg-slate-50" dots>
        <SectionHeading
          title={t("public.espanol.journey_title")}
          subtitle={t("public.espanol.journey_subtitle")}
        />
        <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
          {LEVELS.map(({ level, icon: Icon, key, color }, i) => (
            <Reveal key={key} direction="up" delay={i * 150}>
              <TiltCard className="h-full">
                <Card className="h-full border bg-white transition-all duration-300 hover:shadow-xl hover:shadow-brand-secondary/5 group overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`bg-gradient-to-r ${color} px-6 py-4 text-white`}>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{level}</span>
                        <Icon aria-hidden="true" className="h-6 w-6 opacity-80" />
                      </div>
                      <p className="text-sm opacity-90 font-medium mt-1">
                        {t(`public.espanol.journey_${key}_label`)}
                      </p>
                    </div>
                    <div className="p-6 space-y-3">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="flex items-start gap-2.5">
                          <Target
                            aria-hidden="true"
                            className="h-4 w-4 text-brand-secondary mt-0.5 shrink-0"
                          />
                          <span className="text-sm text-muted-foreground">
                            {t(`public.espanol.journey_${key}_${j}`)}
                          </span>
                        </div>
                      ))}
                      <p className="text-xs font-medium text-foreground pt-2 border-t">
                        {t(`public.espanol.journey_${key}_time`)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </PublicSection>

      <PublicSection className="bg-white">
        <SectionHeading
          title={t("public.espanol.steps_title")}
          subtitle={t("public.espanol.steps_subtitle")}
        />
        <TimelineSection
          translationPrefix="public.espanol"
          count={4}
          keyPattern="step"
        />
      </PublicSection>

      <PublicSection className="bg-slate-50" dots>
        <SectionHeading
          title={t("public.espanol.adv_title")}
          subtitle={t("public.espanol.adv_subtitle")}
        />
        <FeatureCardGrid items={ADVANTAGES} columns={4} />
      </PublicSection>

      <PublicSection className="bg-white">
        <SectionHeading
          title={t("public.espanol.proof_title")}
          subtitle={t("public.espanol.proof_subtitle")}
        />
        <div className="grid gap-4 sm:gap-8 sm:grid-cols-4 max-w-4xl mx-auto text-center">
          {[
            { value: 100, suffix: "+", key: "students" },
            { value: 85, suffix: "%", key: "dele" },
            { value: 4, suffix: "", key: "months" },
            { value: 15, suffix: "+", key: "years" },
          ].map(({ value, suffix, key }, i) => (
            <Reveal key={key} direction="up" delay={i * 150}>
              <div className="p-4 sm:p-6">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                  <AnimatedCounter value={value} suffix={suffix} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground font-medium">
                  {t(`public.espanol.proof_${key}`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </PublicSection>

      <CrossSellCard
        title={t("public.espanol.crosssell_title")}
        description={t("public.espanol.crosssell_desc")}
        links={[
          {
            label: t("public.espanol.crosssell_homologacion"),
            href: publicRoute(publicPages.homologacion, locale),
          },
          {
            label: t("public.espanol.crosssell_universidad"),
            href: publicRoute(publicPages.universidad, locale),
          },
        ]}
        badgeLabel={t("public.espanol.crosssell_badge")}
        badgeIcon={Home}
      />

      <PublicSection className="bg-white">
        <SectionHeading title={t("public.espanol.faq_title")} />
        <FaqSection translationPrefix="public.espanol" />
      </PublicSection>

      <PinFinalCta
        prefix="public.espanol"
        bgImage="/images/lifestyle/spain-flag-waving-blue-sky.webp"
        sideItemCount={5}
      />
    </>
  );
}
