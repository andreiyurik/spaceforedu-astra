import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FlagIcon } from "@/components/common/FlagIcon";
import { LOCALES, type Locale } from "@/lib/constants";

const LANGUAGES = [
  { code: "es", label: "Español", countryCode: "es" },
  { code: "en", label: "English", countryCode: "gb" },
  { code: "ru", label: "Русский", countryCode: "ru" },
] as const;

interface LanguageSwitcherProps {
  /** Current locale of the rendered page. */
  locale: Locale;
  /** Pathname including locale prefix, e.g. "/es/homologation/". */
  currentPath: string;
  /**
   * Destino explicito por idioma, para rutas cuyo slug NO es igual en los tres
   * idiomas (los articulos del blog). Sin esto, sustituir el prefijo lleva a 404.
   */
  localeHrefs?: Partial<Record<Locale, string>>;
  /** Use on dark backgrounds (e.g. sidebar, dark panel). */
  variant?: "default" | "ghost-dark";
}

export function LanguageSwitcher({
  locale,
  currentPath,
  variant = "default",
  localeHrefs,
}: LanguageSwitcherProps) {
  const changeLanguage = (code: string) => {
    const explicito = localeHrefs?.[code as Locale];
    if (explicito) {
      window.location.assign(explicito);
      return;
    }
    const pattern = new RegExp(`^/(${LOCALES.join("|")})(/|$)`);
    const nextPath = pattern.test(currentPath)
      ? currentPath.replace(pattern, `/${code}$2`)
      : `/${code}${currentPath}`;
    window.location.assign(nextPath);
  };

  const current =
    LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  const buttonClass =
    variant === "ghost-dark"
      ? "text-white/70 hover:text-white hover:bg-white/10 border-transparent"
      : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-11 gap-2 px-4 font-normal ${buttonClass}`}
        >
          <FlagIcon code={current.countryCode} />
          <span className="text-sm">{current.code.toUpperCase()}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {LANGUAGES.map((lang) => {
          const isActive = locale === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="gap-3 cursor-pointer"
            >
              <FlagIcon code={lang.countryCode} className="shadow-sm" />
              <span className="flex-1">{lang.label}</span>
              {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
