/**
 * Decorative "code" backdrop for the hero on small screens: a dark editor
 * window with monospace syntax-coloured lines, blurred and dimmed so the
 * headline and CTAs stay perfectly readable on top of it.
 * Pure CSS/SVG — no photo, no asset, stays crisp at any density.
 */
const LINES: Array<Array<{ w: number; c: string }>> = [
  [
    { w: 14, c: "rgba(125, 180, 255, 0.5)" },
    { w: 22, c: "rgba(255, 255, 255, 0.22)" },
  ],
  [
    { w: 8, c: "rgba(125, 180, 255, 0.34)" },
    { w: 30, c: "rgba(255, 255, 255, 0.16)" },
  ],
  [
    { w: 20, c: "rgba(56, 189, 248, 0.42)" },
    { w: 12, c: "rgba(255, 255, 255, 0.14)" },
  ],
  [
    { w: 10, c: "rgba(255, 255, 255, 0.2)" },
    { w: 26, c: "rgba(125, 180, 255, 0.3)" },
  ],
  [{ w: 34, c: "rgba(255, 255, 255, 0.12)" }],
  [
    { w: 12, c: "rgba(56, 189, 248, 0.36)" },
    { w: 18, c: "rgba(255, 255, 255, 0.18)" },
  ],
  [
    { w: 24, c: "rgba(255, 255, 255, 0.16)" },
    { w: 10, c: "rgba(125, 180, 255, 0.4)" },
  ],
  [{ w: 16, c: "rgba(255, 255, 255, 0.12)" }],
  [
    { w: 8, c: "rgba(125, 180, 255, 0.28)" },
    { w: 22, c: "rgba(255, 255, 255, 0.16)" },
  ],
  [{ w: 28, c: "rgba(255, 255, 255, 0.1)" }],
];

export function CodeBackdrop({ className }: { className?: string }) {
  return (
    <div className={"pointer-events-none select-none " + (className ?? "")} aria-hidden="true">
      {/* Faint dot grid, like graph paper behind a screen */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(125,180,255,0.55) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* The editor window, slightly rotated so it reads as a poster element */}
      <div className="absolute left-1/2 top-1/2 w-[34rem] max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-2">
        <div className="overflow-hidden rounded-[1.4rem] border border-white/15 bg-[#081535]/70 shadow-[0_40px_90px_-40px_rgba(2,8,30,0.9)] backdrop-blur-[2px]">
          {/* Title bar with traffic lights */}
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/10" />
            <span className="ml-3 font-mono text-[10px] tracking-wide text-white/35">
              elio-pages · studio
            </span>
          </div>

          {/* Code body */}
          <div className="space-y-2.5 px-4 py-5 font-mono text-[11px] leading-none">
            {LINES.map((line, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-3 shrink-0 text-right text-white/20">{i + 1}</span>
                <span className="flex items-center gap-1.5">
                  {line.map((seg, j) => (
                    <span
                      key={j}
                      className="h-1.5 rounded-full"
                      style={{ width: seg.w, backgroundColor: seg.c }}
                    />
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bracket / curly-brace accents, big and very faint */}
      <svg
        className="absolute -right-6 top-10 size-40 text-[#4f7dff]/15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6H10a6 6 0 0 0-6 6v8a6 6 0 0 1-6 6 6 6 0 0 1 6 6v8a6 6 0 0 0 6 6h8" />
        <path d="M42 6h8a6 6 0 0 1 6 6v8a6 6 0 0 0 6 6 6 6 0 0 0-6 6v8a6 6 0 0 1-6 6h-8" />
      </svg>

      {/* Soft blue glow behind the window */}
      <div className="absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e4fd8]/25 blur-3xl" />
    </div>
  );
}
