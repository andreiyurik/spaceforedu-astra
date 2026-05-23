import { useEffect, useState } from "react";
import { ConsultationDialog } from "@/components/public/ConsultationDialog";
import { Button } from "@/components/ui/button";
import { CONTACT_WHATSAPP } from "@/lib/constants";
import { I18nProvider, useTranslation } from "@/lib/i18n/react";
import type { Messages } from "@/lib/i18n";
import type { Locale } from "@/lib/constants";

// Official WhatsApp glyph (simple-icons, CC0). Inline so we keep the recognizable
// silhouette instead of a generic chat bubble — critical for LATAM recognition.
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
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
  locale: Locale | string;
  messages: Messages;
}) {
  return (
    <I18nProvider locale={locale} messages={messages}>
      <StickyCtaBarInner />
    </I18nProvider>
  );
}
