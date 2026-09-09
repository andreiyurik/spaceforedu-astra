import { useEffect, useState } from "react";
import { Clock, Flame, MessageCircle, CheckCircle2, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CONTACT_WHATSAPP } from "@/lib/constants";
import { whatsappLink } from "@/lib/routes";
import { useTranslation } from "@/lib/i18n/react";
import {
  buildConsultationStrings,
  type ConsultationStrings,
} from "@/lib/consultation";

const SUCCESS_AUTO_CLOSE_MS = 2500;

/**
 * Trigger + dialog for the consultation flow, driven entirely by resolved
 * `strings` so it needs no i18n context. Two thin wrappers feed it:
 *  - <ConsultationDialog> for React pages (resolves strings from the ambient
 *    <I18nProvider> and uses caller-supplied `children` as the trigger).
 *  - <ConsultationDialogButton> for Astro leaf islands (strings resolved
 *    server-side and passed as props — keeps the serialized island payload to a
 *    handful of strings instead of the whole message bundle — with its own
 *    trigger button).
 */
function ConsultationDialogView({
  strings,
  trigger,
}: {
  strings: ConsultationStrings;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const href = CONTACT_WHATSAPP
    ? whatsappLink(CONTACT_WHATSAPP, strings.waMessage)
    : "#";

  // Reset success state whenever the dialog fully closes.
  useEffect(() => {
    if (!open && success) {
      const id = window.setTimeout(() => setSuccess(false), 200);
      return () => window.clearTimeout(id);
    }
  }, [open, success]);

  function handleWhatsAppClick() {
    setSuccess(true);
    window.setTimeout(() => setOpen(false), SUCCESS_AUTO_CLOSE_MS);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto inline-flex rounded-full bg-[var(--success-pale)] p-4">
              <CheckCircle2 className="h-10 w-10 text-[var(--success-deep)]" />
            </div>
            <DialogTitle className="text-xl">{strings.successTitle}</DialogTitle>
            <DialogDescription className="text-sm">
              {strings.successDesc}
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg">{strings.title}</DialogTitle>
              <DialogDescription>{strings.desc}</DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                {strings.duration}
              </Badge>
            </div>

            <div className="space-y-3">
              {strings.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[var(--success-deep)] mt-0.5 shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[var(--warn-pale)] border border-[var(--warn-hairline)] px-3 py-2">
              <Flame className="h-4 w-4 text-[var(--warn-amber)] shrink-0" />
              <span className="text-sm font-medium text-[var(--warn-amber)]">
                {strings.spots}
              </span>
            </div>

            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="block"
            >
              <Button
                size="lg"
                className="w-full min-h-[44px] text-base bg-[#25D366] hover:bg-[#1ebe57] border-0 transition-colors duration-150"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {strings.waButton}
              </Button>
            </a>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              {strings.waHint}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** React-page usage: trigger is supplied as children; strings come from context. */
export function ConsultationDialog({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  return (
    <ConsultationDialogView strings={buildConsultationStrings(t)} trigger={children} />
  );
}

/** Astro leaf-island usage: strings resolved server-side, own trigger button. */
export function ConsultationDialogButton({
  strings,
  triggerLabel,
  triggerClass,
  arrow = false,
  ctaId,
}: {
  strings: ConsultationStrings;
  triggerLabel: string;
  triggerClass?: string;
  /** Render a trailing arrow that slides on hover (the trigger must use `group`). */
  arrow?: boolean;
  /** Emitted as `data-cta`, the hook the GTM trigger listens on. */
  ctaId?: string;
}) {
  return (
    <ConsultationDialogView
      strings={strings}
      trigger={
        <button type="button" className={triggerClass} data-cta={ctaId}>
          {triggerLabel}
          {arrow && (
            <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
          )}
        </button>
      }
    />
  );
}
