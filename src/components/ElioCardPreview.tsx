import logo from "@/assets/logo.png";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { MessageCircle, MapPin } from "lucide-react";

/**
 * The signature Elio glass business card — the visual language every published
 * page gets. Used tilted in the hero and flat in feature sections.
 */
export function ElioCardPreview({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { t } = useI18n();
  return (
    <div className={cn("glass-strong rounded-3xl p-6", className)}>
      <div className="flex items-center gap-4">
        <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#f0b03f] to-[#b4700a]">
          <img src={logo} alt="" className="size-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold leading-tight">
            Atelier Kivu
          </p>
          <p className="truncate text-sm text-muted-foreground">{t.hero.cardRole}</p>
        </div>
      </div>

      {!compact && (
        <>
          <p className="mt-4 text-sm leading-6 text-foreground/85">
            Joinery & interiors for homes that keep their promises — built to last a
            generation.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {["Kitchen — oak & marble", "Café Ndera fit-out", "Library shelving"].map((title) => (
              <span
                key={title}
                className="rounded-full border border-border/70 bg-white/[0.03] px-2.5 py-1 text-xs text-muted-foreground"
              >
                {title}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-500">
              <MessageCircle className="size-3" /> {t.hero.cardCta}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" /> Goma, DRC
            </span>
          </div>
        </>
      )}
    </div>
  );
}
