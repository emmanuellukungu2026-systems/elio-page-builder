import { useI18n } from "@/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const TOUR_KEY = "elio-tour-done";
const STEPS = 5;
/** Page anchors per step: the bubble points at a real section when it exists. */
const ANCHORS: (string | null)[] = ["#how", "/directory", "/services", "/dashboard", "#faq"];

/** Sleepy studio cat — hand-drawn SVG mascot of Elio Pages. */
function CatFace({ happy = false }: { happy?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="size-full" aria-hidden="true">
      {/* ears */}
      <path d="M14 22 L10 6 L26 14 Z" fill="#2b2f3a" />
      <path d="M50 22 L54 6 L38 14 Z" fill="#2b2f3a" />
      <path d="M15.5 19.5 L13 10.5 L22.5 15 Z" fill="#f2a4b3" />
      <path d="M48.5 19.5 L51 10.5 L41.5 15 Z" fill="#f2a4b3" />
      {/* head */}
      <circle cx="32" cy="36" r="22" fill="#2b2f3a" />
      {/* eyes */}
      {happy ? (
        <>
          <path d="M20 34 q4 -4 8 0" stroke="#f6e7c9" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M36 34 q4 -4 8 0" stroke="#f6e7c9" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="24" cy="34" rx="3.4" ry="4.4" fill="#f6e7c9" />
          <ellipse cx="40" cy="34" rx="3.4" ry="4.4" fill="#f6e7c9" />
          <circle cx="24.6" cy="34.8" r="1.3" fill="#1a1d26" />
          <circle cx="40.6" cy="34.8" r="1.3" fill="#1a1d26" />
        </>
      )}
      {/* nose + mouth */}
      <path d="M30.4 41 h3.2 l-1.6 2 Z" fill="#f2a4b3" />
      <path
        d={happy ? "M27 45.5 q5 4 10 0" : "M29 45 q3 2.4 6 0"}
        stroke="#f6e7c9"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* whiskers */}
      <g stroke="#cdd5e8" strokeWidth="1.1" strokeLinecap="round" opacity="0.75">
        <path d="M8 38 l8 1.4" />
        <path d="M9 43 l7.5 -1" />
        <path d="M56 38 l-8 1.4" />
        <path d="M55 43 l-7.5 -1" />
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
              : { y: nudge ? [0, -6, 0] : 0, rotate: nudge ? [0, -3, 0] : 0 }
          }
          transition={open ? { duration: 0.2 } : { duration: 0.6 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative flex size-14 items-center justify-center rounded-full border border-border/60 bg-background/85 shadow-lg backdrop-blur-md"
        >
          <CatFace happy={justFinished || open} />
          {/* zzz sparkle when cat is closed/bubble hidden */}
          {!open && !justFinished && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              ?
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
