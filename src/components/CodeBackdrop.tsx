/**
 * Decorative "code" backdrop for the hero on small screens: a dark editor
 * window filled with real (readable) TypeScript — how an Elio page gets
 * built — dimmed under a navy veil so the headline and CTAs stay crisp on
 * top of it. Pure CSS/SVG, no photo, crisp at any density.
 */

type Tok = { t: string; c: string };

const kw = (t: string): Tok => ({ t, c: "text-[#7db4ff]" });
const str = (t: string): Tok => ({ t, c: "text-[#7dd3fc]" });
const fn = (t: string): Tok => ({ t, c: "text-white/85" });
const pt = (t: string): Tok => ({ t, c: "text-white/45" });
const cm = (t: string): Tok => ({ t, c: "text-white/30" });

const CODE: Tok[][] = [
  [kw("import"), pt(" { "), fn("ElioPage"), pt(" } "), kw("from"), pt(" "), str('"@elio/pages"'), pt(";")],
  [],
  [kw("const"), pt(" "), fn("page"), pt(" = "), kw("await"), pt(" "), fn("ElioPage"), pt("."), fn("create"), pt("({")],
  [pt("  "), fn("username"), pt(": "), str('"atelier-kivu"'), pt(",")],
  [pt("  "), fn("template"), pt(": "), str('"cover"'), pt(",")],
  [pt("  "), fn("theme"), pt(": { accent: "), str('"#1e4fd8"'), pt(" },")],
  [pt("  "), fn("nfc"), pt(": { "), fn("card"), pt(": "), kw("true"), pt(" },")],
  [pt("  "), fn("cta"), pt(": "), str('"WhatsApp"'), pt(",")],
  [pt("});")],
  [],
  [fn("page"), pt("."), fn("publish"), pt("();"), pt("  "), cm("// live in minutes")],
];

const SECOND: Tok[][] = [
  [kw("export"), kw(" default"), pt(" "), fn("page"), pt(".")],
  [pt("{"), cm(" nfc: ")],
  [pt("  tap"), pt("() "), cm("→ opens /u/atelier-kivu")],
  [pt("}")],
];

export function CodeBackdrop({ className }: { className?: string }) {
  return (
    <div className={"pointer-events-none select-none " + (className ?? "")} aria-hidden="true">
      {/* Faint dot grid, like graph paper behind a screen */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "radial-gradient(rgba(125,180,255,0.55) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Soft blue glow behind the main window */}
      <div className="absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e4fd8]/25 blur-3xl" />

      {/* Main editor window, slightly rotated so it reads as a poster element */}
      <div className="absolute left-1/2 top-1/2 w-[min(30rem,92vw)] -translate-x-1/2 -translate-y-1/2 -rotate-1">
        <div className="overflow-hidden rounded-[1.4rem] border border-white/15 bg-[#081535]/70 shadow-[0_40px_90px_-40px_rgba(2,8,30,0.9)] backdrop-blur-[2px]">
          {/* Title bar with traffic lights */}
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/10" />
            <span className="ml-3 font-mono text-[10px] tracking-wide text-white/35">
              elio-pages · studio.ts
            </span>
          </div>

          {/* Real TypeScript, coloured like an editor */}
          <div className="px-3 py-4 font-mono text-[10.5px] leading-[1.9] sm:text-[11.5px]">
            {CODE.map((line, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-4 shrink-0 text-right text-white/20">{i + 1}</span>
                <code className="whitespace-pre">
                  {line.map((tok, j) => (
                    <span key={j} className={tok.c}>
                      {tok.t}
                    </span>
                  ))}
                  {i === CODE.length - 1 && (
                    <span className="ml-0.5 inline-block h-3.5 w-[6px] translate-y-0.5 animate-pulse bg-[#7db4ff]/80" />
                  )}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* A second, smaller window peeking in from the bottom-right */}
      <div className="absolute -bottom-6 right-[-3rem] w-56 -rotate-2">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#061129]/75 backdrop-blur-[2px]">
          <div className="border-b border-white/10 px-3 py-2 font-mono text-[9px] text-white/30">
            client.ts
          </div>
          <div className="px-3 py-3 font-mono text-[9.5px] leading-[1.8]">
            {SECOND.map((line, i) => (
              <div key={i} className="flex gap-2 whitespace-pre">
                <span className="w-3 shrink-0 text-right text-white/15">{i + 1}</span>
                <code>
                  {line.map((tok, j) => (
                    <span key={j} className={tok.c}>
                      {tok.t}
                    </span>
                  ))}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bracket accents, big and very faint */}
      <svg
        className="absolute -left-8 top-6 size-36 text-[#4f7dff]/15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6H10a6 6 0 0 0-6 6v8a6 6 0 0 1-6 6 6 6 0 0 1 6 6v8a6 6 0 0 0 6 6h8" />
        <path d="M42 6h8a6 6 0 0 1 6 6v8a6 6 0 0 0 6 6 6 6 0 0 0-6 6v8a6 6 0 0 1-6 6h-8" />
      </svg>
    </div>
  );
}
