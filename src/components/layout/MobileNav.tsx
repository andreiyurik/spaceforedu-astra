import { useState } from "react";
import {
  Menu,
  X,
  Phone,
  GraduationCap,
  Building2,
  BookOpen,
  CreditCard,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import type { Locale } from "@/lib/constants";

const NAV_ICONS: Record<string, React.ElementType> = {
  homologacion: GraduationCap,
  universidad: Building2,
  espanol: BookOpen,
  precios: CreditCard,
  blog: Newspaper,
};

export default function MobileNav({
  locale,
  currentPath,
  localeHrefs,
  navLabels,
  navHrefs,
  menuLabel,
  closeLabel,
  ctaLabel,
  ctaAriaLabel,
  waHref,
  whatsappPhone,
  whatsappFormatted,
  phoneAriaLabel,
}: {
  locale: Locale;
  currentPath: string;
  /** Destino explicito por idioma; ver LanguageSwitcher. */
  localeHrefs?: Partial<Record<Locale, string>>;
  navLabels: Record<"homologacion" | "universidad" | "espanol" | "precios" | "blog", string>;
  navHrefs: Record<
    "homologacion" | "universidad" | "espanol" | "precios" | "blog" | "home",
    string
  >;
  menuLabel: string;
  closeLabel: string;
  ctaLabel: string;
  ctaAriaLabel: string;
  waHref: string;
  whatsappPhone: string;
  whatsappFormatted: string;
  phoneAriaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const keys = ["homologacion", "universidad", "espanol", "precios", "blog"] as const;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-11"
          aria-label={menuLabel}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-80 flex flex-col p-0 bg-white"
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">{menuLabel}</SheetTitle>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--hairline-soft)]">
          <a
            href={navHrefs.home}
            onClick={() => setOpen(false)}
            className="flex items-center"
          >
            <span className="font-display text-[18px] font-bold tracking-[-0.02em] text-[var(--ink-soft)]">
              Space for <span className="text-[var(--primary-pressed)]">Edu</span>
            </span>
          </a>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-11 shrink-0"
              aria-label={closeLabel}
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-3 pt-3 overflow-y-auto">
          {keys.map((key) => {
            const href = navHrefs[key];
            const Icon = NAV_ICONS[key];
            const isActive = currentPath.startsWith(href);
            const className = [
              "flex items-center gap-3 px-4 py-3 text-[15px] font-semibold rounded-full transition-colors min-h-[44px]",
              isActive
                ? "bg-[var(--ink)] text-white"
                : "text-[var(--body-color)] hover:bg-[var(--surface-card)] hover:text-[var(--ink)]",
            ].join(" ");
            return (
              <a
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className={className}
              >
                <Icon
                  className={[
                    "h-5 w-5 shrink-0",
                    isActive ? "text-white" : "text-[var(--mute)]",
                  ].join(" ")}
                />
                {navLabels[key]}
              </a>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pb-6 pt-4 border-t border-[var(--hairline-soft)] space-y-3">
          {whatsappPhone && (
            <a
              href={`tel:+${whatsappPhone}`}
              onClick={() => setOpen(false)}
              aria-label={phoneAriaLabel}
              className="flex items-center gap-2.5 text-[15px] font-medium text-[var(--ink)] min-h-[44px] px-1"
            >
              <Phone
                className="h-5 w-5 text-[var(--primary)] shrink-0"
                aria-hidden="true"
              />
              <span>{whatsappFormatted}</span>
            </a>
          )}
          <div className="flex justify-start">
            <LanguageSwitcher locale={locale} currentPath={currentPath} localeHrefs={localeHrefs} />
          </div>
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              aria-label={ctaAriaLabel}
              className="block"
            >
              <Button className="w-full min-h-[44px] h-12 bg-[var(--primary)] hover:bg-[var(--primary-pressed)] border-0 text-white text-[15px] font-bold rounded-2xl">
                {ctaLabel}
              </Button>
            </a>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
