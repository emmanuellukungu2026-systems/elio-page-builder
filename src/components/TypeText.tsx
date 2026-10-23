import { Fragment, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

type Word = { text: string; start: number; hl: boolean };

/**
 * Splits `Your work, on one *clean page*.` into the plain text (markers
 * removed) plus the word list with character offsets and highlight flags.
 */
function parse(text: string): { plain: string; words: Word[] } {
  const parts = text.split("*");
  const plain = parts.join("");

  // Character ranges of the highlighted (odd) parts, in plain coordinates.
  const regions: Array<[number, number]> = [];
  let off = 0;
  parts.forEach((part, i) => {
    if (i % 2 === 1) regions.push([off, off + part.length]);
    off += part.length;
  });

  const words: Word[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(plain)) !== null) {
    const start = m.index;
    words.push({
      text: m[0],
      start,
      hl: regions.some(([a, b]) => start >= a && start < b),
    });
  }
  return { plain, words };
}

/**
 * Types a line letter by letter the first time it scrolls into view.
 *
 * - The full line sits underneath at `opacity: 0`, so the layout never shifts
 *   while typing and screen readers still get the text.
 * - The caret blinks during typing and is absolutely positioned, so it can
 *   never push a word onto the next line.
 * - Words wrapped in `*…*` get an animated underline sweep once typed.
 * - Fires once: scrolling back never replays the effect.
 * - Reduced motion: the full text is there immediately, no caret.
 *
 * Normally the trigger is "entered the viewport"; pass `active` to drive it
 * from scroll choreography instead (used by the cinematic stage).
 */
export function TypeText({
  text,
  speed = 30,
  delay = 0,
  active,
  placeholder = "hidden",
  className,
}: {
  text: string;
  /** Milliseconds per character. */
  speed?: number;
  /** Wait before typing starts. */
  delay?: number;
  /** External trigger. When provided it replaces the viewport trigger. */
  active?: boolean;
  /** What shows before typing: nothing, or the finished line (stage cards). */
  placeholder?: "hidden" | "full";
  className?: string;
}) {
  const { plain, words } = useMemo(() => parse(text), [text]);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const [reduce] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [phase, setPhase] = useState<"idle" | "typing" | "done">(() =>
    // Reduced motion: everything present from the first paint, never type.
    reduce ? "done" : "idle",
  );
  const [count, setCount] = useState(() => (reduce ? plain.length : 0));

  const trigger = active ?? inView;

  // Begin typing when triggered.
  useEffect(() => {
    if (reduce || !trigger || phase !== "idle") return;
    const start = window.setTimeout(() => {
      setCount(0);
      setPhase("typing");
    }, delay);
    return () => window.clearTimeout(start);
  }, [trigger, phase, delay, reduce]);

  // Typing loop — one timeout per character, all cleaned up on unmount.
  useEffect(() => {
    if (phase !== "typing") return;
    if (count >= plain.length) {
      const settle = window.setTimeout(() => setPhase("done"), 360);
      return () => window.clearTimeout(settle);
    }
    const tick = window.setTimeout(() => setCount((c) => c + 1), speed);
    return () => window.clearTimeout(tick);
  }, [phase, count, plain.length, speed]);

  // How much of the line is drawn right now.
  const typed =
    phase === "done" || (phase === "idle" && placeholder === "full")
      ? plain.length
      : count;

  const shown = words.filter((w) => w.start < typed);

  return (
    <span ref={ref} className={cn("type-text", className)}>
      {/* Spacer: reserves the final layout and carries the accessible text. */}
      <span className="type-text__spacer">{plain}</span>
      {/* The characters revealed so far. */}
      <span className="type-text__layer" aria-hidden="true">
        {shown.map((w, i) => {
          const end = w.start + w.text.length;
          const piece = plain.slice(w.start, Math.min(end, typed));
          const spaceAfter = typed > end && plain[end] === " " ? " " : "";
          const isLast = i === shown.length - 1;
          const caret = phase === "typing" && isLast;
          return (
            <Fragment key={w.start}>
              <span
                className={cn(
                  "type-word",
                  w.hl && "type-word--hl",
                  w.hl && typed >= end && "type-word--hl-on",
                )}
              >
                {piece}
                {caret && <span className="type-caret" aria-hidden="true" />}
              </span>
              {spaceAfter}
            </Fragment>
          );
        })}
      </span>
    </span>
  );
}
