import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CircleHelp, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const TOUR_KEY = "elio-tour-done";
const TOUR_KEY_PAGE = "elio-tour-page-done";
const STEPS = 5;
/** Page anchors per step: the bubble points at a real section when it exists. */
const ANCHORS: (string | null)[] = ["#how", "/directory", "/services", "/dashboard", "#faq"];

export function CatMascot() {
  const { t } = useI18n();
  const location = useLocation();
  // On public portfolio pages (/u/...) the guide walks through the panels and
  // "View" scrolls to the panel it describes.
  const isPortfolio = location.pathname.startsWith("/u/");
  const storageKey = isPortfolio ? TOUR_KEY_PAGE : TOUR_KEY;
  const guideSteps = t.portfolio.guide;
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0 = welcome bubble, 1..5 = tour steps
  const [justFinished, setJustFinished] = useState(false);

  useEffect(() => {
    let done = false;
    try {
      done = localStorage.getItem(storageKey) === "1";
    } catch {
      /* ignore */
    }
    if (done) return;
    // Small delay so the page settles before the guide greets.
    const timer = setTimeout(() => setOpen(true), 1600);
    return () => clearTimeout(timer);
  }, [storageKey]);

  const finishTour = () => {
    setOpen(false);
    setJustFinished(true);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
    setTimeout(() => setJustFinished(false), 3200);
  };

  const skip = () => {
    setOpen(false);
    try {
      localStorage.setItem(storageKey, "1");
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
      localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
    if (isPortfolio && anchor.startsWith("#pro-")) {
      const idx = Number(anchor.slice(4)); // panel index 0..4
      // Desktop: scroll to the section. Mobile: scroll the snap container.
      const section = document.getElementById(anchor);
      const scroller = document.querySelector<HTMLElement>(".snap-x.snap-mandatory");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      } else if (scroller) {
        scroller.scrollTo({ left: idx * scroller.clientWidth, behavior: "smooth" });
      }
      return;
    }
    if (anchor.startsWith("#")) {
      document.getElementById(anchor.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.assign(anchor);
    }
  };

  // Guide step text: portfolio panels on /u/* pages, landing tour otherwise.
  const stepText = isPortfolio ? guideSteps[step - 1] : t.mascot.steps[step - 1]?.text;
  const stepTitle = isPortfolio ? null : t.mascot.steps[step - 1]?.title;
  // Portfolio anchors are desktop section ids (#pro-0..4); on mobile the
  // horizontal snap container is scrolled panel-by-panel instead.
  const anchor = step > 0 ? (isPortfolio ? `#pro-${step - 1}` : ANCHORS[step - 1]) : null;
  const controlClass =
    "rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[60] flex flex-col items-start gap-2 sm:bottom-6 sm:left-6">
      <AnimatePresence>
        {open && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="pointer-events-auto w-[18.5rem] max-w-[calc(100vw-2rem)] glass-strong rounded-2xl rounded-bl-md p-4 shadow-xl"
          >
            {step === 0 ? (
              <p className="text-sm leading-6 text-foreground/90">
                {isPortfolio ? t.mascot.welcomePage : t.mascot.welcome}
              </p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                >
                  {stepTitle && (
                    <p className="flex items-baseline gap-2 text-sm font-semibold">
                      <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
                        {step}/{STEPS}
                      </span>
                      {stepTitle}
                    </p>
                  )}
                  <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">{stepText}</p>
                </motion.div>
              </AnimatePresence>
            )}

            {/* progress dots */}
            <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
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
                  <button type="button" onClick={back} className={controlClass}>
                    {t.mascot.back}
                  </button>
                )}
                {step === 0 && (
                  <button type="button" onClick={skip} className={controlClass}>
                    {t.mascot.skip}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {step > 0 && anchor && (
                  <button
                    type="button"
                    onClick={() => goAnchor(anchor)}
                    className={cn(controlClass, "border border-border/60")}
                  >
                    {t.mascot.view}
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
        {/* speech tail while the bubble is open */}
        {open && (
          <div
            className="absolute -top-1.5 left-7 size-3 rotate-45 rounded-[2px] border-l border-t border-[rgba(130,160,255,0.16)]"
            style={{ background: "var(--glass-tail, #101a33)" }}
          />
        )}
        <motion.button
          type="button"
          aria-label={open ? t.mascot.close : t.mascot.open}
          title={open ? t.mascot.close : t.mascot.open}
          onClick={() => (open ? skip() : (setStep(0), setOpen(true)))}
          whileTap={{ scale: 0.94 }}
          className="flex size-12 items-center justify-center rounded-full border border-border/70 bg-card/85 text-primary shadow-[0_10px_26px_-14px_rgba(11,25,64,0.55)] backdrop-blur transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {open ? (
            <X className="size-5" strokeWidth={1.6} />
          ) : (
            <CircleHelp className="size-5" strokeWidth={1.6} />
          )}
        </motion.button>
      </div>

      {/* confirmation after finishing */}
      <AnimatePresence>
        {justFinished && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="pointer-events-auto glass-strong rounded-xl px-3.5 py-2 text-xs font-medium shadow-lg"
          >
            {t.mascot.thanks}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
