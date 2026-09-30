import { NfcHeroVisual } from "@/components/NfcHeroVisual";
import { useI18n } from "@/lib/i18n";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

/** How long each poster stays on screen before the automatic cross-fade. */
const SLIDE_MS = 5200;

/** The card-tap moment first, then the client faces — same duotone poster look. */
const SLIDES = [
  { key: "card", src: null },
  { key: "portrait", src: photos.portraits },
  { key: "team", src: photos.team },
] as const;

/**
 * Self-playing poster carousel for the hero: the NFC card + phone composition,
 * then duotone client photography. Cross-fades automatically, pauses on hover
 * or focus, and honours the user's reduced-motion preference.
 */
export function HeroCarousel({ className }: { className?: string }) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const go = useCallback(
    (next: number) => setIndex((next + SLIDES.length) % SLIDES.length),
    [],
  );

  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion]);

  const slide = SLIDES[index];

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-[4/5] rounded-[1.75rem] border border-white/20 bg-white/[0.04] shadow-[0_30px_70px_-30px_rgba(3,10,40,0.9)]">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.key}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.995 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.21, 0.6, 0.35, 1] }}
            className="absolute inset-0"
          >
            {slide.src ? (
              <div className="absolute inset-0 overflow-hidden rounded-[1.75rem]">
                <img src={slide.src} alt="" className="size-full object-cover object-top" />
                {/* Blue duotone wash, like the reference ads */}
                <div className="absolute inset-0 bg-[#1e4fd8] mix-blend-color" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06143a]/85 via-transparent to-[#06143a]/30" />
              </div>
            ) : (
              /* The card + phone composition, breathing on the blue stage */
              <div className="absolute inset-0 grid place-items-center">
                <div className="w-[16.5rem]">
                  <NfcHeroVisual />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => go(i)}
            aria-label={`${t.hero.slide} ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "w-7 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </div>
  );
}