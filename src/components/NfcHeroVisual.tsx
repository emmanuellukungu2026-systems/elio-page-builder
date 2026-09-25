import logo from "@/assets/logo.png";
import { photos } from "@/lib/photos";
import { useI18n } from "@/lib/i18n";
import { Nfc, MessageCircle, QrCode, MapPin } from "lucide-react";

/**
 * The hero visual, inspired by the konchiwa.app ad: a hand-tap moment reduced
 * to its essentials — a black NFC card hovering above a phone that is already
 * showing the client's Elio page. Pure CSS/SVG so it stays crisp at any size.
 */
export function NfcHeroVisual({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <div className={"relative mx-auto w-full max-w-[19rem] " + (className ?? "")}>
      {/* ============ The phone ============ */}
      <div className="relative mx-auto w-56 rotate-[3deg] rounded-[2.4rem] border border-[#0b0e1a]/80 bg-[#0b0e1a] p-[7px] shadow-[0_24px_60px_-24px_rgba(11,20,45,0.45)]">
        <div className="overflow-hidden rounded-[2rem] bg-white">
          {/* Notch */}
          <div className="relative flex h-7 items-center justify-center bg-[#0b0e1a]">
            <span className="h-1.5 w-16 rounded-full bg-white/20" />
          </div>

          {/* Cover strip + avatar */}
          <div className="relative h-20 bg-gradient-to-br from-[#16308f] via-[#1e4fd8] to-[#0e7490]">
            <div className="absolute -bottom-6 left-4 flex size-14 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-white shadow-sm">
              <img src={photos.portraits} alt="" className="size-full object-cover" />
            </div>
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-white backdrop-blur">
              <Nfc className="size-2.5" /> NFC
            </span>
          </div>

          {/* Profile body */}
          <div className="px-4 pb-4 pt-8">
            <p className="text-[13px] font-bold leading-tight text-[#0b0e1a]">Atelier Kivu</p>
            <p className="text-[10px] text-[#5a6478]">{t.hero.cardRole}</p>
            <p className="mt-2 flex items-center gap-1 text-[9px] text-[#5a6478]">
              <MapPin className="size-2.5" /> Goma, DRC
            </p>

            {/* Two project rows, like the ad's profile list */}
            <div className="mt-3 space-y-1.5">
              {[
                "Kitchen — oak & marble",
                "Café Ndera fit-out",
              ].map((row) => (
                <div
                  key={row}
                  className="flex items-center gap-2 rounded-lg border border-[#0b0e1a]/8 bg-[#f4f6fb] px-2 py-1.5"
                >
                  <span className="size-5 shrink-0 overflow-hidden rounded-md">
                    <img src={photos.craft} alt="" className="size-full object-cover" />
                  </span>
                  <span className="truncate text-[9px] font-medium text-[#0b0e1a]/80">{row}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA — the green that reads as "message me" everywhere */}
            <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-[#1fa855] py-2 text-[10px] font-semibold text-white">
              <MessageCircle className="size-3" /> {t.hero.cardCta}
            </div>
          </div>
        </div>
      </div>

      {/* ============ The NFC card, tapping the phone ============ */}
      <div className="absolute -left-8 -top-10 w-44 -rotate-[14deg] sm:-left-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111527] to-[#0b0e1a] p-4 shadow-[0_18px_40px_-18px_rgba(11,20,45,0.55)] ring-1 ring-white/10">
          {/* Card artwork: chip + wordmark */}
          <div className="flex items-center justify-between">
            <div className="flex size-7 items-center justify-center overflow-hidden rounded-lg bg-white">
              <img src={logo} alt="" className="size-full object-cover" />
            </div>
            {/* contactless waves */}
            <svg viewBox="0 0 24 24" className="size-5 text-white/70" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 8.5a7 7 0 0 1 0 7" />
              <path d="M9.5 6.5a10 10 0 0 1 0 11" />
              <path d="M13 4.5a13.5 13.5 0 0 1 0 15" />
            </svg>
          </div>
          <p className="mt-5 font-display text-[13px] font-semibold leading-tight text-white">
            Elio <span className="text-white/60">Pages</span>
          </p>
          <p className="text-[9px] text-white/50">/u/atelier-kivu</p>
        </div>

        {/* Waves from the card toward the phone */}
        <svg
          viewBox="0 0 90 70"
          className="absolute -right-14 top-6 h-16 w-20 text-[#1e4fd8]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 12c14 8 14 38 0 46" opacity="0.35" />
          <path d="M22 8c20 12 20 42 0 54" opacity="0.6" />
          <path d="M40 4c26 16 26 46 0 62" opacity="0.9" />
        </svg>
      </div>

      {/* ============ Floating chips, echoing the ad's icon row ============ */}
      <div className="glass-strong absolute -bottom-5 left-0 flex items-center gap-1.5 rounded-2xl px-3 py-2 text-[11px] font-medium">
        <QrCode className="size-3.5 text-[#1e4fd8]" />
        QR
      </div>
      <div className="glass-strong absolute -right-3 top-24 flex items-center gap-1.5 rounded-2xl px-3 py-2 text-[11px] font-medium">
        <Nfc className="size-3.5 text-[#1e4fd8]" />
        NFC
      </div>

      {/* Soft stage light under the composition */}
      <div className="pointer-events-none absolute inset-x-8 bottom-[-12%] -z-10 h-24 rounded-full bg-[#1e4fd8]/12 blur-2xl" />
    </div>
  );
}
