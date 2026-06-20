import { Reveal } from "@/components/public/animations";
import { useTranslation, useI18n } from "@/lib/i18n/react";
import { countFaq } from "@/lib/i18n";

interface FaqSectionProps {
  translationPrefix: string;
}

export function FaqSection({ translationPrefix }: FaqSectionProps) {
  const { t } = useTranslation();
  const { messages } = useI18n();
  const count = countFaq(messages, translationPrefix);

  return (
    <Reveal direction="up" delay={100}>
      <div className="max-w-2xl mx-auto divide-y divide-[var(--hairline-soft)]">
        {Array.from({ length: count }, (_, i) => (
          <details
            key={i}
            className="group py-4 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex items-start justify-between gap-4 cursor-pointer list-none text-left text-[15px] font-semibold text-[var(--ink)] hover:text-[var(--primary)] transition-colors min-h-[44px]">
              <span>{t(`${translationPrefix}.faq_${i + 1}_q`)}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0 mt-0.5 text-[var(--mute)] transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="mt-3 text-[14px] leading-relaxed text-[var(--mute)]">
              {t(`${translationPrefix}.faq_${i + 1}_a`)}
            </div>
          </details>
        ))}
      </div>
    </Reveal>
  );
}
