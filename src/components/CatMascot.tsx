import { useI18n } from "@/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const TOUR_KEY = "elio-tour-done";
const STEPS = 5;
/** Page anchors per step: the bubble points at a real section when it exists. */
const ANCHORS: (string | null)[] = ["#how", "/directory", "/services", "/dashboard", "#faq"];

/** Kawaii 3D blue cat — glossy volumes, soft rim light, sparkly eyes. */
function CatFace({ happy = false }: { happy?: boolean }) {
  return (
    <svg viewBox="0 0 72 72" className="size-full" aria-hidden="true">
      <defs>
        {/* fur volume: light from top-left, deep royal base */}
        <radialGradient id="cat-fur" cx="35%" cy="26%" r="85%">
          <stop offset="0%" stopColor="#8fb4ff" />
          <stop offset="38%" stopColor="#5b8bef" />
          <stop offset="72%" stopColor="#3163d9" />
          <stop offset="100%" stopColor="#1c3f9e" />
        </radialGradient>
        {/* inner ear glow */}
        <linearGradient id="cat-ear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffc2d4" />
          <stop offset="100%" stopColor="#f78fa7" />
        </linearGradient>
        {/* eye shine: white → sky blue */}
        <radialGradient id="cat-eye" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#d8ecff" />
          <stop offset="100%" stopColor="#9cc6ff" />
        </radialGradient>
        {/* glossy top highlight on the head */}
        <linearGradient id="cat-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="cat-softshadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0b1f4d" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#cat-softshadow)">
        {/* chunky rounded ears with 3D bevel */}
        <path d="M12 30 C10 14 13 8 17 7 C21 6 27 13 30 20 Z" fill="url(#cat-fur)" />
        <path d="M60 30 C62 14 59 8 55 7 C51 6 45 13 42 20 Z" fill="url(#cat-fur)" />
        {/* ear rim light on the outer edge */}
        <path d="M12 30 C10 14 13 8 17 7" fill="none" stroke="#bcd4ff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        <path d="M60 30 C62 14 59 8 55 7" fill="none" stroke="#bcd4ff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        <path d="M16 24 C15 14 16.5 11 18 10.5 C19.8 10 23 15 24.8 20.5 Z" fill="url(#cat-ear)" />
        <path d="M56 24 C57 14 55.5 11 54 10.5 C52.2 10 49 15 47.2 20.5 Z" fill="url(#cat-ear)" />

        {/* big round head */}
        <ellipse cx="36" cy="42" rx="26" ry="23" fill="url(#cat-fur)" />

        {/* fluffy cheek tufts */}
        <circle cx="12" cy="47" r="5" fill="url(#cat-fur)" />
        <circle cx="60" cy="47" r="5" fill="url(#cat-fur)" />

        {/* glossy top-light + bottom bounce light = volume */}
        <ellipse cx="30" cy="30" rx="17" ry="9" fill="url(#cat-gloss)" opacity="0.55" />
        <ellipse cx="36" cy="62.5" rx="15" ry="3.4" fill="#9cc6ff" opacity="0.28" />
        {/* rim light on the right cheek */}
        <path d="M55 33 C60 38 61.5 47 57 53" fill="none" stroke="#bcd4ff" strokeWidth="2" strokeLinecap="round" opacity="0.55" />

        {/* huge sparkly eyes — deep sockets with glossy domes */}
        {happy ? (
          <>
            <path d="M22 42 q5.5 -7 11 0" stroke="#fff6dc" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M39 42 q5.5 -7 11 0" stroke="#fff6dc" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="27" cy="42" rx="6.2" ry="7.6" fill="#122a63" />
            <ellipse cx="45" cy="42" rx="6.2" ry="7.6" fill="#122a63" />
            <ellipse cx="27" cy="42" rx="5.6" ry="7" fill="url(#cat-eye)" />
            <ellipse cx="45" cy="42" rx="5.6" ry="7" fill="url(#cat-eye)" />
            {/* pupils */}
            <ellipse cx="27" cy="43.6" rx="3.5" ry="4.8" fill="#0e1f4d" />
            <ellipse cx="45" cy="43.6" rx="3.5" ry="4.8" fill="#0e1f4d" />
            {/* double sparkle highlights */}
            <circle cx="25.2" cy="40" r="2.1" fill="#ffffff" />
            <circle cx="43.2" cy="40" r="2.1" fill="#ffffff" />
            <circle cx="29" cy="46" r="0.9" fill="#ffffff" opacity="0.95" />
            <circle cx="47" cy="46" r="0.9" fill="#ffffff" opacity="0.95" />
            {/* lower eye gloss */}
            <ellipse cx="27" cy="47.4" rx="2.4" ry="0.9" fill="#ffffff" opacity="0.4" />
            <ellipse cx="45" cy="47.4" rx="2.4" ry="0.9" fill="#ffffff" opacity="0.4" />
          </>
        )}

        {/* blush — glowing 3D puffs */}
        <ellipse cx="17" cy="49" rx="4.6" ry="2.8" fill="#ff9db5" opacity="0.65" />
        <ellipse cx="55" cy="49" rx="4.6" ry="2.8" fill="#ff9db5" opacity="0.65" />
        <ellipse cx="17" cy="48.4" rx="2.4" ry="1.2" fill="#ffd3de" opacity="0.8" />
        <ellipse cx="55" cy="48.4" rx="2.4" ry="1.2" fill="#ffd3de" opacity="0.8" />

        {/* tiny triangle nose with top gloss + w-mouth */}
        <path d="M33.6 48.5 h4.8 l-2.4 2.8 Z" fill="#f78fa7" />
        <path d="M34.2 48.7 h3.6 l-0.6 0.7 h-2.4 Z" fill="#ffd3de" />
        <path
          d={happy ? "M28 53.5 q4 4.4 8 0 q4 4.4 8 0" : "M29.5 53.5 q3.2 3 6.5 0 q3.2 3 6.5 0"}
          stroke="#fff6dc"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />

        {/* whiskers — soft and curved */}
        <g stroke="#dcebff" strokeWidth="1.3" strokeLinecap="round" opacity="0.85">
          <path d="M9 44 q7 1.2 10 2" fill="none" />
          <path d="M10 50 q6.5 -0.4 9.4 -1.4" fill="none" />
          <path d="M63 44 q-7 1.2 -10 2" fill="none" />
          <path d="M62 50 q-6.5 -0.4 -9.4 -1.4" fill="none" />
        </g>
      </g>
    </svg>
  );
}

export function CatMascot() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0 = welcome bubble, 1..5 = tour steps
  const [justFinished, setJustFinished] = useState(false);
  const [nudge, setNudge] = useState(false);

  useEffect(() => {
    let done = false;
    try {
      done = localStorage.getItem(TOUR_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (done) return;
    // Small delay so the landing hero settles before the mascot greets.
    const timer = setTimeout(() => setOpen(true), 1600);
    return () => clearTimeout(timer);
  }, []);

  // Gentle nudge every ~12s while idle on the welcome bubble.
  useEffect(() => {
    if (!open || step !== 0) return;
    const iv = setInterval(() => setNudge((n) => !n), 1200);
    return () => clearInterval(iv);
  }, [open, step]);

  const finishTour = () => {
    setOpen(false);
    setJustFinished(true);
    try {
      localStorage.setItem(TOUR_KEY, "1");
    } catch {
      /* ignore */
    }
    setTimeout(() => setJustFinished(false), 3200);
  };

  const skip = () => {
    setOpen(false);
    try {
      localStorage.setItem(TOUR_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const next = () => {
    if (step >= STEPS) finishTour();
    else setStep(step + 1);
  };

  const back = () => setStep(Math.max(0, step - 1));

  const goAnchor = (anchor: string) => {
    setOpen(false);
    try {
      localStorage.setItem(TOUR_KEY, "1");
    } catch {
      /* ignore */
    }
    if (anchor.startsWith("#")) {
      document.getElementById(anchor.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.assign(anchor);
    }
  };

  const stepData = step > 0 ? t.mascot.steps[step - 1] : null;
  const anchor = step > 0 ? ANCHORS[step - 1] : null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[60] flex flex-col items-start gap-2 sm:bottom-6 sm:left-6">
      <AnimatePresence>
        {open && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-auto w-[19rem] max-w-[calc(100vw-2rem)] glass-strong rounded-3xl rounded-bl-md p-4 shadow-xl"
          >
            {step === 0 ? (
              <p className="text-sm leading-6 text-foreground/90">{t.mascot.welcome}</p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="flex items-center justify-between font-display text-sm font-bold">
                    <span>
                      {step}/{STEPS} · {stepData?.title}
                    </span>
                  </p>
                  <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">{stepData?.text}</p>
                </motion.div>
              </AnimatePresence>
            )}

            {/* progress dots */}
            <div className="mt-3 flex items-center gap-1.5">
              {Array.from({ length: STEPS + 1 }).map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 18 : 6,
                    background: i <= step ? "var(--primary)" : "var(--border)",
                  }}
                />
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={back}
                    className="rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {t.mascot.back}
                  </button>
                )}
                {step === 0 && (
                  <button
                    type="button"
                    onClick={skip}
                    className="rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {t.mascot.skip}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => anchor && goAnchor(anchor)}
                    className="rounded-lg border border-border/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    Voir
                  </button>
                )}
                <button
                  type="button"
                  onClick={next}
                  className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-transform active:scale-95"
                >
                  {step >= STEPS ? t.mascot.done : t.mascot.next}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto relative">
        {/* speech tail hint when bubble open */}
        {open && (
          <div
            className="absolute -top-1.5 left-7 size-3 rotate-45 rounded-[2px] border-l border-t border-[rgba(130,160,255,0.16)]"
            style={{ background: "var(--glass-tail, #101a33)" }}
          />
        )}
        <motion.button
          type="button"
          aria-label={open ? "Close tour" : "Open tour"}
          onClick={() => (open ? skip() : (setStep(0), setOpen(true)))}
          animate={
            open
              ? { y: 0, rotate: 0 }
              : { y: nudge ? [0, -7, 0] : 0, rotate: nudge ? [0, -4, 0] : 0 }
          }
          transition={open ? { duration: 0.2 } : { duration: 0.6 }}
          whileHover={{ scale: 1.08, rotate: -3 }}
          whileTap={{ scale: 0.92 }}
          className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-b from-[#dcebff] to-[#a9c6f5] shadow-[0_8px_20px_rgba(28,63,158,0.45),0_2px_4px_rgba(28,63,158,0.3),inset_0_2px_3px_rgba(255,255,255,0.85),inset_0_-4px_6px_rgba(28,63,158,0.25)] ring-1 ring-white/60"
        >
          <CatFace happy={justFinished || open} />
          {/* little heart badge instead of a boring question mark */}
          {!open && (
            <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-gradient-to-b from-[#ffadc0] to-[#f06c8e] text-[10px] leading-none shadow-[0_2px_6px_rgba(240,108,142,0.5),inset_0_1px_1px_rgba(255,255,255,0.7)]">
              <svg viewBox="0 0 12 12" className="size-3 fill-white" aria-hidden="true">
                <path d="M6 10.5 C3.2 8.4 1.2 6.6 1.2 4.4 C1.2 2.9 2.4 1.8 3.8 1.8 C4.7 1.8 5.5 2.3 6 3 C6.5 2.3 7.3 1.8 8.2 1.8 C9.6 1.8 10.8 2.9 10.8 4.4 C10.8 6.6 8.8 8.4 6 10.5 Z" />
              </svg>
            </span>
          )}
        </motion.button>
      </div>

      {/* thank-you sparkle after finishing */}
      <AnimatePresence>
        {justFinished && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="pointer-events-auto glass-strong rounded-2xl px-3.5 py-2 text-xs font-medium shadow-lg"
          >
            🎉 {t.mascot.steps[STEPS - 1].title}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
