import logo from "@/assets/logo.png";
import { useI18n } from "@/lib/i18n";
import { photos, photoStrip } from "@/lib/photos";
import type { MotionStyle, MotionValue } from "framer-motion";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Lock, MapPin, MessageCircle, Nfc } from "lucide-react";
import { useRef } from "react";

/**
 * Scroll story: as the visitor scrolls, the black NFC card decomposes into its
 * layers (plate → chip → wordmark → link pill) and a browser window opens on
 * the client's portfolio page. Sticky viewport + framer-motion useScroll, so
 * everything is driven by scroll position (nothing autoplays).
 */

type Opt = MotionValue<number> | number;

/** The physical card, split into 4 stacked sheets that fly apart on scroll. */
function CardStack({ s0, s1, s2, s3 }: { s0?: MotionStyle; s1?: MotionStyle; s2?: MotionStyle; s3?: MotionStyle }) {
  return (
    <div className="relative h-[172px] w-[260px] sm:h-[180px] sm:w-[276px]">
      {/* Sheet 0 — the back plate with circuit traces */}
      <motion.div
        style={s0}
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#111527] to-[#0b0e1a] p-5 shadow-[0_18px_40px_-18px_rgba(11,20,45,0.55)] ring-1 ring-white/10"
      >
        <svg viewBox="0 0 276 180" className="absolute inset-0 size-full" fill="none" aria-hidden="true">
          <path d="M20 150h60l18-18h50" stroke="#1e4fd8" strokeWidth="1.5" opacity="0.35" />
          <path d="M256 40h-40l-14 14h-36" stroke="#1e4fd8" strokeWidth="1.5" opacity="0.25" />
          <circle cx="98" cy="132" r="3" fill="#1e4fd8" opacity="0.5" />
          <circle cx="202" cy="54" r="3" fill="#1e4fd8" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Sheet 1 — logo chip + contactless waves */}
      <motion.div style={s1} className="absolute inset-0">
        <div className="absolute inset-x-5 top-5 flex items-center justify-between">
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
            aria-hidden="true"
          >
            <path d="M6 8.5a7 7 0 0 1 0 7" />
            <path d="M9.5 6.5a10 10 0 0 1 0 11" />
            <path d="M13 4.5a13.5 13.5 0 0 1 0 15" />
          </svg>
        </div>
      </motion.div>

      {/* Sheet 2 — wordmark + profile link */}
      <motion.div style={s2} className="absolute inset-0">
        <div className="absolute inset-x-5 top-[78px] sm:top-[82px]">
          <p className="font-display text-base font-semibold leading-tight text-white">
            Elio <span className="text-white/60">Pages</span>
          </p>
          <p className="mt-0.5 text-[11px] text-white/55">/u/atelier-kivu</p>
        </div>
      </motion.div>

      {/* Sheet 3 — the NFC pill */}
      <motion.div style={s3} className="absolute inset-0">
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/80">
          <Nfc className="size-3" /> NFC
        </span>
      </motion.div>
    </div>
  );
}

/**
 * The portfolio page that opens once the card has come apart.
 * `o` / `y` are optional scroll-driven values; without them it renders static.
 */
function BrowserWindow({ o, y }: { o?: Opt[]; y?: Opt[] }) {
  const { t } = useI18n();
  const reveal = (i: number): MotionStyle => ({
    opacity: o?.[i] ?? 1,
    y: y?.[i === 0 ? 0 : 1] ?? 0,
  });

  const projects = [
    { src: photoStrip[1], label: "Kitchen — oak & marble" },
    { src: photoStrip[2], label: "Café Ndera fit-out" },
    { src: photoStrip[6], label: "Studio portraits" },
    { src: photoStrip[7], label: "Kivu joinery line" },
  ];

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e1a] shadow-[0_30px_80px_-30px_rgba(11,20,45,0.75)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#111527] px-3 py-2.5 sm:px-4">
        <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="size-2.5 rounded-full bg-[#28c840]/80" />
        <div className="ml-2 flex min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-white/[0.06] px-2.5 py-1 font-mono text-[11px] text-white/60">
          <Lock className="size-3 shrink-0 text-emerald-400" />
          <span className="truncate">eliopages.app/u/atelier-kivu</span>
        </div>
      </div>

      {/* The page itself */}
      <div className="bg-white">
        {/* Cover */}
        <motion.div style={reveal(0)} className="relative h-20 sm:h-24">
          <img src={photos.craft} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#16308f]/70 via-[#1e4fd8]/35 to-transparent" />
        </motion.div>

        {/* Identity */}
        <motion.div style={reveal(1)} className="relative px-4 pb-3 pt-0 sm:px-5">
          <div className="-mt-7 flex size-14 items-center justify-center overflow-hidden rounded-2xl border-[3px] border-white bg-white shadow-sm">
            <img src={photos.portraits} alt="" className="size-full object-cover" />
          </div>
          <p className="mt-2 text-sm font-bold leading-tight text-[#0b0e1a]">Atelier Kivu</p>
          <p className="text-[11px] text-[#5a6478]">{t.hero.cardRole}</p>
          <p className="mt-1 flex items-center gap-1 text-[10px] text-[#5a6478]">
            <MapPin className="size-3" /> Goma, DRC
          </p>
        </motion.div>

        {/* Project grid */}
        <div className="grid grid-cols-2 gap-2 px-4 pb-3 sm:px-5">
          {projects.map((p, i) => (
            <motion.div
              key={p.label}
              style={reveal(i < 2 ? 2 : 3)}
              className="overflow-hidden rounded-lg border border-[#0b0e1a]/8 bg-[#f4f6fb]"
            >
              <img src={p.src} alt="" loading="lazy" className="h-12 w-full object-cover sm:h-14" />
              <p className="truncate px-2 py-1 text-[9px] font-medium text-[#0b0e1a]/80">{p.label}</p>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <motion.div style={reveal(4)} className="px-4 pb-4 sm:px-5">
          <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#1fa855] py-2 text-[11px] font-semibold text-white">
            <MessageCircle className="size-3.5" /> {t.hero.cardCta}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function CardToSite({ className }: { className?: string }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // --- Card decomposition -------------------------------------------------
  const cardOpacity = useTransform(p, [0.3, 0.46], [1, 0]);
  const s0y = useTransform(p, [0.1, 0.34], [0, 70]);
  const s0s = useTransform(p, [0.1, 0.34], [1, 0.9]);
  const s0r = useTransform(p, [0.1, 0.34], [0, -3]);
  const s1y = useTransform(p, [0.1, 0.34], [0, 24]);
  const s2y = useTransform(p, [0.1, 0.34], [0, -24]);
  const s3y = useTransform(p, [0.1, 0.34], [0, -70]);
  const s3s = useTransform(p, [0.1, 0.34], [1, 1.05]);
  const s3r = useTransform(p, [0.1, 0.34], [0, 3]);

  // --- Browser opening ----------------------------------------------------
  const browserOpacity = useTransform(p, [0.4, 0.56], [0, 1]);
  const browserY = useTransform(p, [0.4, 0.58], [44, 0]);
  const browserScale = useTransform(p, [0.4, 0.58], [0.94, 1]);
  const o0 = useTransform(p, [0.55, 0.63], [0, 1]);
  const o1 = useTransform(p, [0.6, 0.68], [0, 1]);
  const o2 = useTransform(p, [0.66, 0.74], [0, 1]);
  const o3 = useTransform(p, [0.71, 0.79], [0, 1]);
  const o4 = useTransform(p, [0.76, 0.85], [0, 1]);
  const y0 = useTransform(o0, [0, 1], [18, 0]);
  const y1 = useTransform(o1, [0, 1], [14, 0]);

  // --- Captions + progress ------------------------------------------------
  const cap1 = useTransform(p, [0, 0.06, 0.26], [1, 1, 0]);
  const cap2 = useTransform(p, [0.26, 0.36, 0.5], [0, 1, 0]);
  const cap3 = useTransform(p, [0.5, 0.62], [0, 1]);
  const hint = useTransform(p, [0, 0.05], [1, 0]);

  // Reduced motion: show the two states side by side, nothing scroll-driven.
  if (reduce) {
    return (
      <div className={"flex flex-col items-center gap-8 px-4 " + (className ?? "")}>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <CardStack />
          <div className="w-full max-w-[560px]">
            <BrowserWindow />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{t.transform.step3}</p>
      </div>
    );
  }

  return (
    <div ref={ref} className={"relative h-[300vh] " + (className ?? "")}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-7 overflow-hidden px-4">
        {/* Stage: card (left/center) morphing into the browser */}
        <div className="relative flex h-[340px] w-full max-w-3xl items-center justify-center sm:h-[400px]">
          <motion.div style={{ opacity: cardOpacity }} className="absolute">
            <CardStack
              s0={{ y: s0y, scale: s0s, rotate: s0r }}
              s1={{ y: s1y }}
              s2={{ y: s2y }}
              s3={{ y: s3y, scale: s3s, rotate: s3r }}
            />
          </motion.div>

          <motion.div
            style={{ opacity: browserOpacity, y: browserY, scale: browserScale }}
            className="w-full max-w-[600px]"
          >
            <BrowserWindow o={[o0, o1, o2, o3, o4]} y={[y0, y1]} />
          </motion.div>
        </div>

        {/* Phase captions */}
        <div className="relative h-5 w-full max-w-md text-center text-sm font-medium text-muted-foreground">
          <motion.span style={{ opacity: cap1 }} className="absolute inset-0">
            {t.transform.step1}
          </motion.span>
          <motion.span style={{ opacity: cap2 }} className="absolute inset-0">
            {t.transform.step2}
          </motion.span>
          <motion.span style={{ opacity: cap3 }} className="absolute inset-0">
            {t.transform.step3}
          </motion.span>
        </div>

        {/* Scroll hint + progress */}
        <div className="flex flex-col items-center gap-3">
          <motion.span style={{ opacity: hint }} className="text-xs uppercase tracking-[0.18em] text-muted-foreground/70">
            ↓ {t.transform.hint}
          </motion.span>
          <div className="h-1 w-36 overflow-hidden rounded-full bg-white/10">
            <motion.div
              style={{ scaleX: p }}
              className="h-full origin-left bg-gradient-to-r from-[#1e4fd8] to-[#0e7490]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
