import { useEffect, useState } from "react";
import { ConsultationDialog } from "@/components/public/ConsultationDialog";
import { CONTACT_WHATSAPP } from "@/lib/constants";
import { I18nProvider, useTranslation } from "@/lib/i18n/react";
import { ICON_PATHS } from "@/lib/icon-paths";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/constants";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox={ICON_PATHS.whatsapp.viewBox}
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={ICON_PATHS.whatsapp.d} />
    </svg>
  );
}

// Spain business hours: Mon–Fri 09:00–19:00 Europe/Madrid.
// Recomputed every minute so long-open tabs don't show a stale "online" dot
// across the 09:00 / 19:00 boundary.
function useIsOnline(): boolean {
  const [online, setOnline] = useState(false);
  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const hour = Number(
        now.toLocaleString("en-US", {
          timeZone: "Europe/Madrid",
          hour: "numeric",
          hour12: false,
        }),
      );
      const weekday = now.toLocaleString("en-US", {
        timeZone: "Europe/Madrid",
        weekday: "short",
      });
      setOnline(hour >= 9 && hour < 19 && !["Sat", "Sun"].includes(weekday));
    };
    compute();
    const id = window.setInterval(compute, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return online;
}

function StickyCtaBarInner() {
  const { t } = useTranslation();
  const isOnline = useIsOnline();
  const hasWhatsApp = CONTACT_WHATSAPP.length > 0;
  const waHref = hasWhatsApp ? `https://wa.me/${CONTACT_WHATSAPP}` : null;

  return (
    <>
      {/* Mobile: full-width bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden bg-white shadow-[0_-1px_8px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-stretch h-[48px]">
          {hasWhatsApp && (
            <>
              <a
                href={`tel:+${CONTACT_WHATSAPP}`}
                data-cta="sticky-tel"
                aria-label={t("a11y.phone_aria")}
                className="flex items-center justify-center w-13 text-[var(--primary)] active:bg-[var(--surface-card)] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </a>
              <span className="w-px self-stretch my-2 bg-[var(--hairline-soft)]" aria-hidden="true" />
              <a
                href={waHref!}
                data-cta="sticky-whatsapp-movil"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("public.sticky_cta.whatsapp_aria")}
                className="flex items-center justify-center w-13 text-[#25D366] active:bg-[var(--surface-card)] transition-colors"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <span className="w-px self-stretch my-2 bg-[var(--hairline-soft)]" aria-hidden="true" />
            </>
          )}
          <ConsultationDialog>
            <button
              type="button"
              data-cta="sticky-consulta"
              className="flex-1 flex items-center justify-center bg-[var(--primary)] text-white text-sm font-bold active:bg-[var(--primary-pressed)] transition-colors"
            >
              {t("public.sticky_cta.consultation")}
            </button>
          </ConsultationDialog>
        </div>
      </div>

      {/* Desktop: floating premium WhatsApp button */}
      {waHref && (
        <a
          href={waHref}
          data-cta="sticky-whatsapp-escritorio"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("public.sticky_cta.whatsapp_aria")}
          className="hidden lg:flex fixed bottom-6 right-6 z-40 items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white ring-2 ring-white/90 shadow-lg shadow-[#25D366]/30 hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {isOnline && (
            <span
              className="absolute top-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-[#22a655] ring-2 ring-white"
              aria-hidden="true"
            />
          )}
        </a>
      )}
    </>
  );
}

export function StickyCtaBar({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  return (
    <I18nProvider locale={locale} messages={messages}>
      <StickyCtaBarInner />
    </I18nProvider>
  );
}
