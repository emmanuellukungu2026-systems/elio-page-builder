import { ElioMascot } from "@/components/ElioMascot";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

const TOUR_KEY = "elio-tour-done";
const TOUR_KEY_PAGE = "elio-tour-page-done";

/**
 * Landing tour — every step circles a real element of the page. Selectors
 * match the `data-tour` attributes laid out in Landing / CardOrdering, in the
 * order the visitor meets them: the entry point, how it works, the styles,
 * the card, the tap, the call to action.
 */
const SPOTLIGHT_SELECTORS = [
  '[data-tour="hero-cta"]',
  '[data-tour="how"]',
  '[data-tour="models"]',
  '[data-tour="cards"]',
  '[data-tour="nfc"]',
  '[data-tour="final"]',
];

/** Pages without a spotlight keep the bubble tour; "View" jumps here. */
const ANCHORS: (string | null)[] = [
  "#how",
  "/directory",
  "/services",
  "/dashboard",
  "#faq",
];

type Rect = { top: number; left: number; width: number; height: number };
type Step = { title: string | null; text: string };

const sameRect = (a: Rect | null, b: Rect) =>
  !!a &&
  a.top === b.top &&
  a.left === b.left &&
  a.width === b.width &&
  a.height === b.height;

/** Viewport padding for the spotlight hole and the floating card. */
const PAD = 14;
const GAP = 18;

export function CatMascot() {
  const { t } = useI18n();
  const location = useLocation();
  // On public portfolio pages (/u/...) the guide walks through the panels and
  // "View" scrolls to the panel it describes.
  const isPortfolio = location.pathname.startsWith("/u/");
  // The landing page gets the full interactive tour: it dims the page and
  // draws a circle around the element each step talks about.
  const isSpotlight = location.pathname === "/";
  const storageKey = isPortfolio ? TOUR_KEY_PAGE : TOUR_KEY;

  const steps: Step[] = isPortfolio
    ? t.portfolio.guide.map((text) => ({ title: null, text }))
    : isSpotlight
      ? t.mascot.tourSteps.slice(0, SPOTLIGHT_SELECTORS.length)
      : t.mascot.steps;
  const STEPS = steps.length;

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0 = welcome bubble, 1..STEPS = tour steps
  const [justFinished, setJustFinished] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);
  const [ready, setReady] = useState(false);
  const [cardSize, setCardSize] = useState({ w: 312, h: 208 });
  const cardRef = useRef<HTMLDivElement>(null);

  const selector =
    isSpotlight && open && step > 0 ? (SPOTLIGHT_SELECTORS[step - 1] ?? null) : null;
  // Without a target (any other page) the card stays parked above the mascot.
  const parked = !isSpotlight || !rect;

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

  const markDone = () => {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
  };

  const finishTour = () => {
    setOpen(false);
    setJustFinished(true);
    markDone();
    setTimeout(() => setJustFinished(false), 3200);
  };

  const skip = () => {
    setOpen(false);
    markDone();
  };

  const next = () => {
    if (step >= STEPS) finishTour();
    else setStep(step + 1);
  };

  const back = () => setStep(Math.max(0, step - 1));

  /* ---- keyboard: Esc leaves, arrows walk the steps ---- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step, STEPS, storageKey]);

  /* ---- spotlight: bring the target into view and track its box ---- */
  useEffect(() => {
    if (!selector) {
      setRect(null);
      setReady(false);
      return;
    }
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) {
      // No target on this route: centre the card instead of circling nothing.
      setRect(null);
      setReady(true);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReady(false);
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });

    const measure = () => {
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Intersection of the element with the padded viewport, so an element
      // taller than the screen still gets a ring that fits the visible part.
      const left = Math.max(8, Math.min(r.left, vw - 8));
      const top = Math.max(8, Math.min(r.top, vh - 8));
      const right = Math.min(vw - 8, Math.max(r.right, 8));
      const bottom = Math.min(vh - 8, Math.max(r.bottom, 8));
      const box: Rect = {
        top,
        left,
        width: Math.max(0, right - left),
        height: Math.max(0, bottom - top),
      };
      // Target scrolled out of sight: drop the ring rather than dimming a
      // page with no hole in it (the card then parks next to the mascot).
      if (box.width < 4 || box.height < 4) {
        setRect(null);
        return;
      }
      setRect((prev) => (sameRect(prev, box) ? prev : box));
    };

    measure();
    window.addEventListener("scroll", measure, { capture: true, passive: true });
    window.addEventListener("resize", measure);

    // Keep tracking while the smooth scroll is still travelling.
    let raf = 0;
    const started = performance.now();
    const loop = () => {
      measure();
      if (performance.now() - started < 1400) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // The card waits for the page to settle before it pops in.
    const timer = window.setTimeout(() => setReady(true), reduce ? 60 : 700);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("scroll", measure, { capture: true });
      window.removeEventListener("resize", measure);
    };
  }, [selector]);

  /* ---- the card follows the target, so it needs its own size ---- */
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    setCardSize((prev) =>
      Math.abs(prev.w - w) < 1 && Math.abs(prev.h - h) < 1 ? prev : { w, h },
    );
  }, [open, step, ready, parked]);

  const goAnchor = (anchor: string) => {
    setOpen(false);
    markDone();
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

  const current = step > 0 ? steps[step - 1] : null;
  // Portfolio anchors are desktop section ids (#pro-0..4); on mobile the
  // horizontal snap container is scrolled panel-by-panel instead.
  const anchor =
    step > 0 && !isSpotlight
      ? isPortfolio
        ? `#pro-${step - 1}`
        : (ANCHORS[step - 1] ?? null)
      : null;

  const controlClass =
    "rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  /* Card placement: under the circle when there is room, above it otherwise. */
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const cardW = Math.min(cardSize.w, vw - PAD * 2);
  let cardLeft = Math.max(PAD, (vw - cardW) / 2);
  let cardTop = Math.max(PAD, (vh - cardSize.h) / 2);
  if (rect) {
    cardLeft = Math.min(
      Math.max(PAD, rect.left + rect.width / 2 - cardW / 2),
      Math.max(PAD, vw - PAD - cardW),
    );
    const below = rect.top + rect.height + GAP;
    const above = rect.top - GAP - cardSize.h;
    cardTop =
      below + cardSize.h <= vh - PAD
        ? below
        : above >= PAD
          ? above
          : Math.max(PAD, vh - PAD - cardSize.h);
  }

  const showSpotlight = open && isSpotlight && step > 0 && !!rect && ready;
  const cardStyle = parked
    ? { width: "18.5rem", maxWidth: "calc(100vw - 2rem)" }
    : { position: "fixed" as const, left: cardLeft, top: cardTop, width: cardW };

  return (
    <>
      {/* ============ the circle drawn around the current element ============ */}
      <AnimatePresence>
        {showSpotlight && rect && (
          <motion.div
            key="spotlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto fixed inset-0 z-[55]"
            aria-hidden="true"
          >
            {/* Clipped so the huge spread shadow becomes a dimmed page with a
                clean, rounded hole around the element being explained. */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute"
                style={{
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                  borderRadius: 18,
                  boxShadow: "0 0 0 9999px rgba(7, 13, 31, 0.62)",
                }}
              >
                <svg
                  className="absolute inset-0 h-full w-full overflow-visible"
                  viewBox={`0 0 ${rect.width} ${rect.height}`}
                  preserveAspectRatio="none"
                >
                  <rect
                    x="3.5"
                    y="3.5"
                    width={Math.max(0, rect.width - 7)}
                    height={Math.max(0, rect.height - 7)}
                    rx="15"
                    fill="none"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="7"
                  />
                  <rect
                    x="3.5"
                    y="3.5"
                    width={Math.max(0, rect.width - 7)}
                    height={Math.max(0, rect.height - 7)}
                    rx="15"
                    fill="none"
                    stroke="#4f7dff"
                    strokeWidth="2.5"
                    strokeDasharray="10 9"
                    strokeLinecap="round"
                    className="tour-dash"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed bottom-4 left-4 z-[60] flex flex-col items-start gap-2 sm:bottom-6 sm:left-6">
        {/* ---------- welcome bubble, anchored on the mascot ---------- */}
        <AnimatePresence>
          {open && step === 0 && (
            <motion.div
              key="bubble"
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="pointer-events-auto w-[18.5rem] max-w-[calc(100vw-2rem)] glass-strong rounded-2xl rounded-bl-md p-4 shadow-xl"
            >
              <div className="flex items-start gap-3">
                <ElioMascot className="size-12 shrink-0" wave />
                <p className="text-sm leading-6 text-foreground/90">
                  {isPortfolio ? t.mascot.welcomePage : t.mascot.welcome}
                </p>
              </div>
              {tourDots()}
              <div className="mt-3 flex items-center justify-between gap-2">
                <button type="button" onClick={skip} className={controlClass}>
                  {t.mascot.skip}
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-transform active:scale-95"
                >
                  {isSpotlight ? t.mascot.start : t.mascot.next}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- step card, parked next to the circled element ---------- */}
        <AnimatePresence>
          {open && step > 0 && (
            <motion.div
              key="card"
              ref={cardRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: ready || parked ? 1 : 0, y: ready || parked ? 0 : 8 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              style={cardStyle}
              className={cn(
                "pointer-events-auto glass-strong rounded-2xl rounded-bl-md p-4 shadow-2xl",
                parked ? "" : "z-[61]",
              )}
            >
              <div className="flex items-start gap-3">
                <ElioMascot className="size-11 shrink-0" />
                <div className="min-w-0">
                  {current?.title && (
                    <p className="flex items-baseline gap-2 text-sm font-semibold">
                      <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
                        {step}/{STEPS}
                      </span>
                      {current.title}
                    </p>
                  )}
                  <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
                    {current?.text}
                  </p>
                </div>
              </div>

              {tourDots()}

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button type="button" onClick={back} className={controlClass}>
                    {t.mascot.back}
                  </button>
                  <button type="button" onClick={skip} className={controlClass}>
                    {t.mascot.skip}
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  {anchor && (
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

        {/* ---------- the mascot itself ---------- */}
        <div className="pointer-events-auto relative">
          {/* speech tail while the welcome bubble is open */}
          {open && step === 0 && (
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
            className="flex size-12 items-center justify-center rounded-full border border-border/70 bg-card/85 p-1 shadow-[0_10px_26px_-14px_rgba(11,25,64,0.55)] backdrop-blur transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ElioMascot className="size-10" />
            {open && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                <X className="size-2.5" strokeWidth={3} />
              </span>
            )}
          </motion.button>
        </div>

        {/* ---------- confirmation after finishing ---------- */}
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
    </>
  );

  /** Progress pills shared by the welcome bubble and the step card. */
  function tourDots() {
    return (
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
    );
  }
}
