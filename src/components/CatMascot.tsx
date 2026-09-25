import { useI18n } from "@/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const TOUR_KEY = "elio-tour-done";
const STEPS = 5;
/** Page anchors per step: the bubble points at a real section when it exists. */
const ANCHORS: (string | null)[] = ["#how", "/directory", "/services", "/dashboard", "#faq"];

/** Kawaii studio cat — chunky, blushy, big sparkly eyes. */
function CatFace({ happy = false }: { happy?: boolean }) {
  return (
    <svg viewBox="0 0 72 72" className="size-full" aria-hidden="true">
      <defs>
        <radialGradient id="cat-fur" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#4a5268" />
          <stop offset="55%" stopColor="#363d4f" />
          <stop offset="100%" stopColor="#232838" />
        </radialGradient>
      </defs>

      {/* chunky rounded ears */}
      <path
        d="M12 30 C10 14 13 8 17 7 C21 6 27 13 30 20 Z"
        fill="url(#cat-fur)"
      />
      <path
        d="M60 30 C62 14 59 8 55 7 C51 6 45 13 42 20 Z"
        fill="url(#cat-fur)"
      />
      <path d="M16 24 C15 14 16.5 11 18 10.5 C19.8 10 23 15 24.8 20.5 Z" fill="#f7b8c4" />
      <path d="M56 24 C57 14 55.5 11 54 10.5 C52.2 10 49 15 47.2 20.5 Z" fill="#f7b8c4" />

      {/* big round head */}
      <ellipse cx="36" cy="42" rx="26" ry="23" fill="url(#cat-fur)" />

      {/* fluffy cheek tufts */}
      <circle cx="12" cy="47" r="5" fill="url(#cat-fur)" />
      <circle cx="60" cy="47" r="5" fill="url(#cat-fur)" />

      {/* huge sparkly eyes */}
      {happy ? (
        <>
          <path d="M22 42 q5.5 -7 11 0" stroke="#ffe9c7" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M39 42 q5.5 -7 11 0" stroke="#ffe9c7" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="27" cy="42" rx="5.6" ry="7" fill="#ffe9c7" />
          <ellipse cx="45" cy="42" rx="5.6" ry="7" fill="#ffe9c7" />
          {/* pupils */}
          <ellipse cx="27" cy="43.4" rx="3.4" ry="4.6" fill="#1d2233" />
          <ellipse cx="45" cy="43.4" rx="3.4" ry="4.6" fill="#1d2233" />
          {/* double sparkle highlights */}
          <circle cx="25.4" cy="40.2" r="2" fill="#ffffff" />
          <circle cx="43.4" cy="40.2" r="2" fill="#ffffff" />
          <circle cx="29" cy="46" r="0.9" fill="#ffffff" opacity="0.9" />
          <circle cx="47" cy="46" r="0.9" fill="#ffffff" opacity="0.9" />
        </>
      )}

      {/* blush */}
      <ellipse cx="17.5" cy="49" rx="4.4" ry="2.6" fill="#f78fa7" opacity="0.55" />
      <ellipse cx="54.5" cy="49" rx="4.4" ry="2.6" fill="#f78fa7" opacity="0.55" />

      {/* tiny triangle nose + w-mouth */}
      <path d="M33.6 48.5 h4.8 l-2.4 2.8 Z" fill="#f78fa7" />
      <path
        d={happy ? "M28 53.5 q4 4.4 8 0 q4 4.4 8 0" : "M29.5 53.5 q3.2 3 6.5 0 q3.2 3 6.5 0"}
        stroke="#ffe9c7"
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="round"
      />

      {/* whiskers — soft and curved */}
      <g stroke="#e8edf9" strokeWidth="1.3" strokeLinecap="round" opacity="0.8">
        <path d="M9 44 q7 1.2 10 2" fill="none" />
        <path d="M10 50 q6.5 -0.4 9.4 -1.4" fill="none" />
        <path d="M63 44 q-7 1.2 -10 2" fill="none" />
        <path d="M62 50 q-6.5 -0.4 -9.4 -1.4" fill="none" />
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
          className="relative flex size-16 items-center justify-center rounded-full border border-[#3a4256]/70 bg-gradient-to-b from-[#f9f4ea] to-[#ece2cf] shadow-[0_6px_18px_rgba(2,6,23,0.35),inset_0_-3px_6px_rgba(2,6,23,0.12)]"
        >
          <CatFace happy={justFinished || open} />
          {/* little heart badge instead of a boring question mark */}
          {!open && (
            <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-[#f78fa7] text-[10px] leading-none shadow-md">
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
