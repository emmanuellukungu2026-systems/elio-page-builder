import { ElioMark } from "@/components/ElioMark";
import { SAMPLE_PAGE } from "@/lib/elio";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Github, Instagram, MapPin, Mail } from "lucide-react";

/**
 * The signature Elio glass profile card — the same visual language users get
 * on their public page. Used tilted in the hero, flat in feature sections.
 */
export function ElioCardPreview({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const p = SAMPLE_PAGE;
  return (
    <div className={cn("glass-strong rounded-3xl p-6", className)}>
      <div className="flex items-center gap-4">
        <div
          className="relative flex size-14 items-center justify-center rounded-2xl text-xl font-semibold text-[#221503]"
          style={{ background: `linear-gradient(135deg, ${p.accent}, #67d4f2)` }}
        >
          EL
          <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-background ring-1 ring-border">
            <ElioMark className="size-3" />
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold leading-tight">{p.displayName}</p>
          <p className="truncate text-sm text-muted-foreground">{p.headline}</p>
        </div>
      </div>

      {!compact && (
        <>
          <p className="mt-4 text-sm leading-6 text-foreground/85">{p.bio}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(p.items ?? []).slice(0, 3).map((it) => (
              <span
                key={it.id}
                className="rounded-full border border-border/70 bg-white/[0.03] px-2.5 py-1 text-xs text-muted-foreground"
              >
                {it.title}
              </span>
              ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="size-4 transition-colors hover:text-foreground" />
              <Instagram className="size-4 transition-colors hover:text-foreground" />
              <Github className="size-4 transition-colors hover:text-foreground" />
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" /> {p.location}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
