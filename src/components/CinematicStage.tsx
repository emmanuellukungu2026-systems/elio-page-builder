import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { TypeText } from "@/components/TypeText";
import { useIsMobile } from "@/hooks/use-mobile";

export type StageItem = {
  key: string;
  accent: string;
  name: string;
  title: string;
  text: string;
  link: string;
  Icon: LucideIcon;
  href: string;
};

/* Scroll choreography — all values are fractions of the pinned scroll range. */
const STAGE_END = 0.96;
const INTRO_END_DESKTOP = 0.12;
const TYPE_AT = 0.2; // local time at which the title starts typing

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a || 1));
  return t * t * (3 - 2 * t);
};

/**
 * The pinned, scroll-driven product sequence that replaces the plain card row.
 *
 * Layout: the section is 360vh tall and holds a sticky 100svh stage. Scroll
 * position drives every card:
 *
 *  - intro     the three cards sit as a fanned row (desktop) or a stack (mobile)
 *  - focus     the current card flies to the centre, un-rotates, comes forward
 *              on Z and sharpens while the others recede, blur and dim
 *  - present   its title types itself, then the body and the link fade in
 *  - hand-off  it recedes and the next card takes the stage
 *
 * Everything is transform/opacity/filter driven (no layout reads per frame),
 * every animation instance is a framer-motion subscription that unmounts with
 * the component, and `prefers-reduced-motion` falls back to a plain grid.
 */
export function CinematicStage({
  items,
  className,
}: {
  items: StageItem[];
  className?: string;
}) {
  const [reduce] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Phones open straight on the first card; desktop gets a clean intro row.
  const introEnd = isMobile ? 0 : INTRO_END_DESKTOP;
  const seg = (STAGE_END - introEnd) / items.length;

  // The sequence dissolves just before the sticky stage releases the viewport.
  const stageOpacity = useTransform(scrollYProgress, (p) => 1 - smoothstep(0.97, 1, p));

  return (
    <div
      ref={ref}
      className={cn("relative", reduce ? "py-8" : "h-[360vh]", className)}
    >
      {reduce ? (
        <StaticRow items={items} />
      ) : (
        <motion.div className="stage__pin" style={{ opacity: stageOpacity }}>
          <div className="stage__grid">
            {items.map((item, index) => (
              <StageCard
                key={item.key}
                item={item}
                index={index}
                count={items.length}
                seg={seg}
                introEnd={introEnd}
                isMobile={isMobile}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StageCard({
  item,
  index,
  count,
  seg,
  introEnd,
  isMobile,
  progress,
}: {
  item: StageItem;
  index: number;
  count: number;
  seg: number;
  introEnd: number;
  isMobile: boolean;
  progress: MotionValue<number>;
}) {
  const segStart = introEnd + index * seg;
  const isLast = index === count - 1;
  // The closing card never recedes on its own — the stage fade ends its turn.
  const exitIn = isLast ? 1.4 : 0.72;
  const exitOut = isLast ? 1.7 : 1;

  // Home pose of this card while the row is on screen.
  const centre = index - (count - 1) / 2;
  const gridX = isMobile ? 0 : centre * 104; // % of the card's own width
  const gridRot = isMobile ? 0 : centre * -11; // deg

  // t: local time in this card's segment. f: 0 = at home, 1 = on stage.
  const pose = useTransform(progress, (p) => {
    const t = clamp01((p - segStart) / seg);
    const f = smoothstep(0, 0.3, t) * (1 - smoothstep(exitIn, exitOut, t));
    // Phones: the two cards that have not played yet are ghosts from the start.
    const po = isMobile && index > 0 ? 1 : smoothstep(introEnd, introEnd + 0.09, p);
    return { t, f, po, d: (1 - f) * po };
  });

  const x = useTransform(pose, (v) => `${(gridX * (1 - v.f)).toFixed(3)}%`);
  const z = useTransform(pose, (v) => (-260 - 160 * v.po) * (1 - v.f));
  const rotateY = useTransform(pose, (v) => gridRot * (1 - v.f));
  const scale = useTransform(pose, (v) => 1 + 0.1 * v.f);
  const opacity = useTransform(pose, (v) => 1 - 0.84 * v.d);
  const filter = useTransform(
    pose,
    (v) => (v.d * 7 > 0.05 ? `blur(${(v.d * 7).toFixed(2)}px)` : "none"),
  );
  // The focused card always paints above the receding ones.
  const zIndex = useTransform(pose, (v) => (v.f > 0.5 ? 20 : 1));
  const glowOpacity = useTransform(pose, (v) => v.f * 0.9);
  // Content clears during the zoom, then the typed title and body come back.
  const titleOpacity = useTransform(
    pose,
    (v) => clamp01(1 - smoothstep(0.1, 0.18, v.t) + smoothstep(0.24, 0.32, v.t)),
  );
  const bodyOpacity = useTransform(
    pose,
    (v) => clamp01(1 - smoothstep(0.06, 0.16, v.t) + smoothstep(0.34, 0.48, v.t)),
  );
  const bodyFilter = useTransform(bodyOpacity, (o) =>
    o < 0.985 ? `blur(${((1 - o) * 5).toFixed(2)}px)` : "none",
  );

  // Fire the typing once the card settles on stage — never on the way back.
  const [typed, setTyped] = useState(false);
  const typedRef = useRef(false);
  useMotionValueEvent(pose, "change", (v) => {
    if (typedRef.current || v.t < TYPE_AT) return;
    typedRef.current = true;
    setTyped(true);
  });

  return (
    <>
      {/* Accent light that breathes in behind the focused card. */}
      <motion.div
        aria-hidden="true"
        className="stage__glow"
        style={{
          zIndex: 0,
          opacity: glowOpacity,
          background: `radial-gradient(closest-side, ${item.accent}40, transparent 72%)`,
        }}
      />
      <motion.div
        className={cn(
          "stage__card",
          isMobile ? "w-[min(78vw,22rem)]" : "w-[min(36vw,24rem)]",
        )}
        style={{ x, z, rotateY, scale, opacity, filter, zIndex }}
      >
        <CardLink href={item.href}>
          <CardFace
            item={item}
            title={
              <TypeText
                text={item.title}
                active={typed}
                placeholder="full"
                speed={26}
              />
            }
            titleStyle={{ opacity: titleOpacity }}
            faceStyle={{ opacity: bodyOpacity, filter: bodyFilter }}
          />
        </CardLink>
      </motion.div>
    </>
  );
}

/** The row shown when the visitor prefers reduced motion. */
function StaticRow({ items }: { items: StageItem[] }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-4 px-5 pb-20 sm:px-10 md:grid-cols-3 lg:px-14">
      {items.map((item) => (
        <div key={item.key} className="h-full">
          <CardLink href={item.href}>
            <CardFace item={item} title={item.title.replace(/\*/g, "")} />
          </CardLink>
        </div>
      ))}
    </div>
  );
}

function CardLink({ href, children }: { href: string; children: ReactNode }) {
  const cls =
    "group flex h-full min-h-64 flex-col rounded-2xl bg-[#0a1a44]/70 p-6 ring-1 ring-white/10 backdrop-blur-sm transition-[background-color,box-shadow] duration-300 hover:bg-white/[0.07] hover:shadow-[0_28px_60px_-28px_var(--glow)] hover:ring-white/25 sm:p-7";
  // In-page anchors must be native links so the browser scrolls to them.
  return href.startsWith("#") ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <Link to={href} className={cls}>
      {children}
    </Link>
  );
}

/** The face shared by the animated stage and the reduced-motion row. */
function CardFace({
  item,
  title,
  titleStyle,
  faceStyle,
}: {
  item: StageItem;
  title: ReactNode;
  titleStyle?: MotionStyle;
  faceStyle?: MotionStyle;
}) {
  const { Icon } = item;
  return (
    <>
      <span
        className="flex size-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${item.accent}26`, color: item.accent }}
      >
        <Icon className="size-5" />
      </span>
      <span className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
        elio
      </span>
      <span className="font-display text-lg font-bold uppercase tracking-wide text-white">
        {item.name}
      </span>
      <motion.h3
        className="mt-4 font-display text-2xl font-bold leading-snug text-balance sm:text-[1.75rem]"
        style={{ color: item.accent, ...titleStyle }}
      >
        {title}
      </motion.h3>
      <motion.div className="flex flex-1 flex-col" style={faceStyle}>
        <p className="mt-3 text-sm leading-6 text-white/70">{item.text}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-white/90 transition-transform duration-300 group-hover:translate-x-1.5">
          {item.link} <ArrowRight className="size-4" />
        </span>
      </motion.div>
    </>
  );
}
