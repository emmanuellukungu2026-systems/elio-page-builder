import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { profileUrl } from "@/lib/elio";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Check, Copy, ExternalLink, Nfc } from "lucide-react";
import { useState } from "react";

/**
 * The "one tap" story made tangible: a black NFC card (physically scannable)
 * plus the plain profile link. Replaces the QR code everywhere.
 */
export function NfcLinkCard({ username, className }: { username: string; className?: string }) {
  const { t, lang } = useI18n();
  const a = t.admin;
  const [copied, setCopied] = useState(false);
  const url = profileUrl(username);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const cardLabel =
    lang === "fr"
      ? "Carte NFC — un geste, la page s'ouvre"
      : lang === "tr"
        ? "NFC kart — tek dokunuş, sayfa açılır"
        : "NFC card — one tap, the page opens";

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* The physical card */}
      <div className="relative w-full max-w-[260px] -rotate-[4deg] rounded-2xl bg-gradient-to-br from-[#111527] to-[#0b0e1a] p-5 shadow-[0_18px_40px_-18px_rgba(11,20,45,0.55)] ring-1 ring-white/10">
        <div className="flex items-center justify-between">
          <div className="flex size-9 items-center justify-center overflow-hidden rounded-lg bg-white">
            <img src={logo} alt="" className="size-full object-cover" />
          </div>
          <svg
            viewBox="0 0 24 24"
            className="size-6 text-white/70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M6 8.5a7 7 0 0 1 0 7" />
            <path d="M9.5 6.5a10 10 0 0 1 0 11" />
            <path d="M13 4.5a13.5 13.5 0 0 1 0 15" />
          </svg>
        </div>
        <p className="mt-6 font-display text-base font-semibold leading-tight text-white">
          Elio <span className="text-white/60">Pages</span>
        </p>
        <p className="text-[11px] text-white/55">/u/{username}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/80">
          <Nfc className="size-3" /> {cardLabel}
        </span>
      </div>

      {/* The link — one click on any device */}
      <div className="w-full max-w-[260px]">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={copy}
            className="mt-0 flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl border border-border/60 bg-white/[0.03] px-3 py-2.5 font-mono text-sm transition-colors hover:bg-white/[0.06]"
            title={a.nfcCopyLink}
          >
            <span className="truncate">/u/{username}</span>
            {copied ? (
              <Check className="size-4 shrink-0 text-emerald-500" />
            ) : (
              <Copy className="size-4 shrink-0 text-muted-foreground" />
            )}
          </button>
          <a href={url} target="_blank" rel="noreferrer">
            <Button size="icon" variant="ghost" className="rounded-xl" aria-label="Open">
              <ExternalLink className="size-4" />
            </Button>
          </a>
        </div>
        <p className="mt-2 text-center text-[11px] leading-4 text-muted-foreground">{a.nfcText}</p>
      </div>
    </div>
  );
}
