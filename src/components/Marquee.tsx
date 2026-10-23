import { cn } from "@/lib/utils";

/**
 * Scrolling marquee band ("banderole"). The track holds two identical rows and
 * translates -50%, so the loop is seamless. `tilt` lays the band across the
 * page on a diagonal: the strip is overscanned (115% width, shifted to stay
 * centred) and clipped by the wrapper, so the rotation never creates
 * horizontal overflow. Decorative by nature: the strip is hidden from screen
 * readers because the same message already lives elsewhere.
 */
export function Marquee({
  items,
  tone = "light",
  speed = 40,
  tilt = 0,
  className,
}: {
  items: string[];
  tone?: "light" | "dark";
  /** Seconds for one full pass (width-independent). */
  speed?: number;
  /** Diagonal angle in degrees; 0 keeps the band straight. */
  tilt?: number;
  className?: string;
}) {
  const row = (
    <ul className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((item, i) => (
        <li
          key={`${item}-${i}`}
          className="flex items-center gap-6 whitespace-nowrap pr-6 sm:gap-8 sm:pr-8"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] sm:text-xs">
            {item}
          </span>
          <span
            aria-hidden="true"
            className="size-1 rotate-45 bg-current opacity-40"
          />
        </li>
      ))}
    </ul>
  );

  const band = (
    <div
      className={cn(
        "marquee overflow-hidden py-3.5 sm:py-4",
        tone === "dark"
          ? "border-y border-white/10 bg-[#06143a] text-white/75"
          : "border-y border-border/60 bg-card text-muted-foreground",
        tilt !== 0 && "ml-[-7.5%] w-[115%]",
      )}
      style={tilt !== 0 ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      <div
        className="marquee-track flex w-max"
        style={{ animationDuration: `${speed}s` }}
      >
        {row}
        {row}
      </div>
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative select-none",
        tilt !== 0 && "overflow-hidden py-14 sm:py-16",
        className,
      )}
    >
      {band}
    </div>
  );
}
