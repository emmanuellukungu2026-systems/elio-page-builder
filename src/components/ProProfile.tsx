import { ElioMark } from "@/components/ElioMark";
import { ProfileChat } from "@/components/ProfileChat";
import { ProfileComments } from "@/components/ProfileComments";
import { Reveal } from "@/components/Reveal";
import type { Doc } from "@/convex/_generated/dataModel";
import { waLink } from "@/lib/elio";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarRange,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";

/* ------------------------------------------------------------------ *
 * Art direction — a warm, bright editorial portfolio (reference:
 * "William Harry"). One confident coral for primary actions, a purple
 * counterpoint for the geometric decor, deep-navy ink on off-white.
 * ------------------------------------------------------------------ */
const BG = "#f4f2ee";
const INK = "#151a2b";
const MUTED = "#5b6479";
const CORAL = "#ef4b34";
const PURPLE = "#6b39d6";
const LINE = "rgba(21, 26, 43, 0.09)";
const CARD = "#ffffff";

/* White surface shared by cards, bands and the nav once it is scrolled. */
const surface =
  "rounded-3xl border bg-white shadow-[0_1px_2px_rgba(21,26,43,0.05)]";
const surfaceLine = { borderColor: LINE };
const EASE: [number, number, number, number] = [0.21, 0.6, 0.35, 1];

/** Dict shape of the portfolio strings (mirrors t.portfolio). */
type PortfolioDict = {
  home: string;
  projects: string;
  projectsKicker: string;
  articles: string;
  articlesKicker: string;
  services: string;
  servicesKicker: string;
  about: string;
  aboutKicker: string;
  gallery: string;
  tagline: string;
  view: string;
  storyTitle: string;
  noStory: string;
  whatsNext: string;
  workTogether: string;
  workTogetherText: string;
  greeting: string;
  hireMe: string;
  knowMore: string;
  contactMe: string;
  contact: string;
  skills: string;
  skillsKicker: string;
  experience: string;
  experienceKicker: string;
  featured: string;
  statsKicker: string;
};

/** Structural shape — accepts the public page object as returned by Convex. */
export type ProPage = Pick<
  Doc<"elioPages">,
  | "username"
  | "displayName"
  | "items"
  | "logoUrl"
  | "coverUrl"
  | "accent"
  | "bio"
  | "headline"
  | "trade"
  | "location"
  | "since"
  | "whatsapp"
  | "email"
>;

type Item = Doc<"elioPages">["items"][number];

/**
 * "Pro" template — a full personal portfolio. Warm off-white canvas, oversized
 * navy headline, coral calls-to-action and purple/coral geometric decor behind
 * a portrait with floating cards. Sections flow as one responsive vertical
 * page; the sticky nav tracks the active section and collapses to an animated
 * sheet on mobile.
 */
export function ProProfile({
  page,
  embedded = false,
}: {
  page: ProPage;
  /** Inside the studio preview frame there is no floating chat launcher. */
  embedded?: boolean;
}) {
  const { t } = useI18n();
  const w = t.portfolio as PortfolioDict;
  const accent = page.accent ?? "#1e4fd8";
  const waMessage = `Hello ${page.displayName} — found you through your Elio page.`;

  const projects = (page.items ?? []).filter((it) => it.kind === "project");
  const articles = (page.items ?? []).filter((it) => it.kind === "article");
  const services = (page.items ?? []).filter(
    (it) => it.kind === "service" || it.kind === "price",
  );
  const gallery = (page.items ?? []).filter((it) => it.kind === "portfolio");
  const ideas = (page.items ?? []).filter((it) => it.kind === "idea");

  const featured = projects.find((it) => !!it.imageUrl) ?? projects[0];

  // Skills: every distinct tag the owner has ever applied to their work.
  const skills = Array.from(
    new Set((page.items ?? []).flatMap((it) => it.tags ?? [])),
  );

  // Experience: anything carrying a role, a client or a date range.
  const experience = (page.items ?? [])
    .filter((it) => it.role || it.client || it.startDate || it.endDate)
    .sort((a, b) => (b.startDate ?? "").localeCompare(a.startDate ?? ""))
    .slice(0, 8);

  return (
    <div className="relative min-h-screen" style={{ background: BG, color: INK }}>
      <PortfolioNav page={page} accent={accent} w={w} />

      <main id="main">
        {/* ================= HERO ================= */}
        <PortfolioHero
          page={page}
          w={w}
          featured={featured}
          projectCount={projects.length}
          waMessage={waMessage}
        />

        {/* ================= STATS ================= */}
        <StatBand
          projects={projects.length}
          services={services.length}
          articles={articles.length}
          gallery={gallery.length}
          since={page.since}
          w={w}
        />

        {/* ================= ABOUT ================= */}
        <Section id="about" kicker={w.aboutKicker} title={w.about}>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <div className={cn(surface, "p-7 sm:p-9")} style={surfaceLine}>
                <h3
                  className="font-display text-xl font-bold tracking-tight"
                  style={{ color: INK }}
                >
                  {w.storyTitle}
                </h3>
                <p className="mt-4 whitespace-pre-line text-[15px] leading-7" style={{ color: MUTED }}>
                  {page.bio || w.noStory}
                </p>
                {(page.headline || page.trade) && (
                  <p className="mt-6 border-t pt-5 text-sm" style={{ borderColor: LINE, color: INK }}>
                    <span className="font-semibold">{page.headline || page.trade}</span>
                  </p>
                )}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              {page.coverUrl ? (
                <img
                  src={page.coverUrl}
                  alt=""
                  loading="lazy"
                  className="h-56 w-full rounded-3xl object-cover shadow-[0_1px_2px_rgba(21,26,43,0.06)] ring-1 lg:h-full"
                  style={surfaceLine}
                />
              ) : (
                <div
                  className="hidden h-full min-h-56 rounded-3xl lg:block"
                  style={{
                    border: `1px solid ${LINE}`,
                    background: `linear-gradient(150deg, ${CORAL}1f, ${PURPLE}1f)`,
                  }}
                />
              )}
            </Reveal>
          </div>
        </Section>

        {/* ================= SKILLS ================= */}
        {skills.length > 0 && (
          <Section id="skills" kicker={w.skillsKicker} title={w.skills}>
            <Reveal>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full px-4 py-2 text-sm font-medium"
                    style={{ background: `${PURPLE}12`, color: PURPLE }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          </Section>
        )}

        {/* ================= SERVICES ================= */}
        {services.length > 0 && (
          <Section id="services" kicker={w.servicesKicker} title={w.services}>
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.06}>
                  <ServiceCard page={page} item={item} accent={accent} />
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        {/* ================= PROJECTS ================= */}
        {projects.length > 0 && (
          <Section id="works" kicker={w.projectsKicker} title={w.projects}>
            <div className="grid gap-5 sm:grid-cols-2">
              {projects.map((item, i) => (
                <Reveal key={item.id} delay={(i % 2) * 0.08}>
                  <ProjectCard
                    page={page}
                    item={item}
                    accent={accent}
                    w={w}
                    featuredBadge={item.id === featured?.id}
                  />
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        {/* ================= ARTICLES ================= */}
        {articles.length > 0 && (
          <Section id="writing" kicker={w.articlesKicker} title={w.articles}>
            <div className="grid gap-4 sm:grid-cols-2">
              {articles.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.06}>
                  <ArticleCard page={page} item={item} accent={accent} w={w} />
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        {/* ================= EXPERIENCE ================= */}
        {experience.length > 0 && (
          <Section id="experience" kicker={w.experienceKicker} title={w.experience}>
            <div className="mx-auto max-w-2xl">
              {experience.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.05}>
                  <div
                    className="relative border-l pb-8 pl-7 last:pb-0"
                    style={{ borderColor: LINE }}
                  >
                    <span
                      className="absolute -left-[5px] top-1.5 size-2.5 rounded-full"
                      style={{ background: CORAL, boxShadow: `0 0 0 4px ${CORAL}22` }}
                    />
                    {(item.startDate || item.endDate) && (
                      <p className="text-xs font-semibold" style={{ color: accent }}>
                        {[item.startDate, item.endDate].filter(Boolean).join(" → ")}
                      </p>
                    )}
                    <h3 className="mt-1 font-display text-lg font-bold" style={{ color: INK }}>
                      {item.title}
                    </h3>
                    {(item.role || item.client) && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm" style={{ color: INK }}>
                        <User className="size-3.5" style={{ color: MUTED }} />
                        {[item.role, item.client].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {item.description && (
                      <p className="mt-1.5 line-clamp-2 text-sm leading-6" style={{ color: MUTED }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        {/* ================= GALLERY ================= */}
        {gallery.length > 0 && (
          <Section id="gallery" kicker={w.gallery} title={w.gallery}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {gallery.slice(0, 8).map((item, i) => (
                <Reveal key={item.id} delay={(i % 4) * 0.05}>
                  <Link
                    to={`/u/${page.username}/i/${item.id}`}
                    className="group block aspect-square overflow-hidden rounded-2xl ring-1"
                    style={surfaceLine}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        {/* ================= IDEAS ================= */}
        {ideas.length > 0 && (
          <Section id="ideas" kicker={w.whatsNext} title={w.whatsNext}>
            <div className="flex flex-wrap gap-2.5">
              {ideas.map((idea, i) => (
                <Reveal key={idea.id} delay={i * 0.05}>
                  <Link
                    to={`/u/${page.username}/i/${idea.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ring-1 transition hover:-translate-y-0.5"
                    style={{ borderColor: LINE, color: INK }}
                  >
                    <Sparkles className="size-3.5" style={{ color: CORAL }} />
                    {idea.title}
                  </Link>
                </Reveal>
              ))}
            </div>
          </Section>
        )}

        {/* ================= CONTACT ================= */}
        <Section id="contact" kicker={w.contact} title={w.workTogether}>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <div
                className="relative overflow-hidden rounded-3xl p-8 sm:p-10"
                style={{ background: CORAL }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full"
                  style={{ background: PURPLE, opacity: 0.55 }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-20 -left-10 size-40 rotate-12 rounded-3xl"
                  style={{ background: "#ffffff", opacity: 0.12 }}
                />
                <div className="relative">
                  <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                    {w.workTogether}
                  </h3>
                  <p className="mt-3 max-w-sm text-white/85">{w.workTogetherText}</p>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {page.whatsapp && (
                      <a
                        href={waLink(page.whatsapp, waMessage)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-6 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                        style={{ color: CORAL }}
                      >
                        <MessageCircle className="size-4" /> {w.contactMe}
                      </a>
                    )}
                    {page.email && (
                      <a
                        href={`mailto:${page.email}`}
                        className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/40 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                      >
                        <Mail className="size-4" /> {page.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <ProfileComments username={page.username} accent={accent} />
            </Reveal>
          </div>
        </Section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t" style={{ borderColor: LINE }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2.5">
            <span
              className="flex size-9 items-center justify-center rounded-xl font-display text-xs font-bold text-white"
              style={{ background: INK }}
            >
              {page.displayName.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <p className="font-display text-sm font-bold" style={{ color: INK }}>
                {page.displayName}
              </p>
              <p className="font-mono text-xs" style={{ color: MUTED }}>
                /u/{page.username}
              </p>
            </div>
          </div>
          <p className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
            <ElioMark className="size-4" /> Elio Pages — by Aethel Technologies · ©{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Private messaging — write straight to the owner from the profile. */}
      <ProfileChat
        username={page.username}
        displayName={page.displayName}
        accent={accent}
        embedded={embedded}
      />
    </div>
  );
}

/* ================================================================== *
 * Navigation
 * ================================================================== */

const SECTIONS = [
  { id: "main", key: "home" },
  { id: "works", key: "projects" },
  { id: "about", key: "about" },
  { id: "gallery", key: "gallery" },
  { id: "services", key: "services" },
  { id: "contact", key: "contact" },
] as const;

function PortfolioNav({
  page,
  accent,
  w,
}: {
  page: ProPage;
  accent: string;
  w: PortfolioDict;
}) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("main");
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 16));

  // Same signal when the page is rendered inside a scroll frame instead of the
  // window — e.g. the studio's preview dialog (marked `data-page-scroll`).
  useEffect(() => {
    const onScroll = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (el && typeof el.hasAttribute === "function" && el.hasAttribute("data-page-scroll")) {
        setScrolled(el.scrollTop > 16);
      }
    };
    document.addEventListener("scroll", onScroll, true);
    return () => document.removeEventListener("scroll", onScroll, true);
  }, []);

  // Track which section is in view for the active indicator.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Close the mobile sheet on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const label = (key: string) => {
    switch (key) {
      case "home":
        return w.home;
      case "projects":
        return w.projects;
      case "about":
        return w.about;
      case "gallery":
        return w.gallery;
      case "services":
        return w.services;
      default:
        return w.contact;
    }
  };

  return (
    <header className="sticky inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6",
          scrolled ? "py-2.5" : "py-4",
        )}
      >
        <a
          href="#main"
          className={cn(
            "flex items-center gap-2.5 rounded-2xl px-2 py-1.5 transition-all duration-300",
            scrolled && "bg-white shadow-[0_1px_2px_rgba(21,26,43,0.05)] ring-1",
          )}
          style={scrolled ? surfaceLine : undefined}
        >
          {page.logoUrl ? (
            <img
              src={page.logoUrl}
              alt={page.displayName}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <span
              className="flex size-8 items-center justify-center rounded-full font-display text-[10px] font-bold text-white"
              style={{ background: accent }}
            >
              {page.displayName.slice(0, 2).toUpperCase()}
            </span>
          )}
          <span className="font-display text-sm font-bold" style={{ color: INK }}>
            {page.displayName}
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={cn(
                "relative rounded-lg px-3 py-1.5 text-sm transition-colors",
                active === s.id ? "font-semibold" : "",
              )}
              style={{ color: active === s.id ? INK : MUTED }}
            >
              {label(s.key)}
              {active === s.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full"
                  style={{ background: CORAL }}
                  transition={
                    reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }
                  }
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden h-10 items-center rounded-xl px-5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 sm:inline-flex"
            style={{ background: CORAL }}
          >
            {w.contactMe}
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="portfolio-menu"
            className="inline-flex size-10 items-center justify-center rounded-xl ring-1 lg:hidden"
            style={{ borderColor: LINE, color: INK }}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="portfolio-menu"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.21, 0.6, 0.35, 1] }}
            className="mx-3 mb-2 rounded-2xl border bg-white p-3 shadow-lg lg:hidden"
            style={surfaceLine}
          >
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-black/[0.03]"
                style={{ color: active === s.id ? INK : MUTED }}
              >
                {label(s.key)}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ================================================================== *
 * Hero
 * ================================================================== */

function PortfolioHero({
  page,
  w,
  featured,
  projectCount,
  waMessage,
}: {
  page: ProPage;
  w: PortfolioDict;
  featured?: Item;
  projectCount: number;
  waMessage: string;
}) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const tagline = page.headline || page.trade || w.tagline;

  /* Subtle mouse parallax on the decor (desktop pointers only). */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const coralX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const coralY = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const purpleX = useTransform(sx, [-0.5, 0.5], [-26, 26]);
  const purpleY = useTransform(sy, [-0.5, 0.5], [-18, 18]);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const enter = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.6, delay: reduce ? 0 : delay, ease: EASE },
  });

  return (
    <section
      id="main"
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative overflow-hidden"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:pb-24 lg:pt-16">
        {/* ---------- Left: greeting, name, pitch, CTAs ---------- */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <motion.p
            {...enter(0)}
            className="font-display text-lg font-bold sm:text-xl"
            style={{ color: CORAL }}
          >
            {w.greeting}
          </motion.p>
          <motion.h1
            {...enter(0.08)}
            className="mt-1 font-display font-bold leading-[1.02] tracking-tight"
            style={{ color: INK, fontSize: "clamp(2.5rem, 6.2vw, 4.4rem)" }}
          >
            {page.displayName}
          </motion.h1>

          <motion.p
            {...enter(0.16)}
            className="mx-auto mt-5 max-w-lg text-base leading-7 sm:text-lg"
            style={{ color: MUTED }}
          >
            {tagline}
          </motion.p>

          {page.bio && (
            <motion.p
              {...enter(0.22)}
              className="mx-auto mt-3 max-w-lg text-sm leading-6 lg:mx-0"
              style={{ color: MUTED, opacity: 0.85 }}
            >
              {page.bio}
            </motion.p>
          )}

          <motion.div
            {...enter(0.3)}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            {page.whatsapp ? (
              <a
                href={waLink(page.whatsapp, waMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-2xl px-7 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ background: CORAL }}
              >
                {w.hireMe} <ArrowRight className="size-4" />
              </a>
            ) : (
              <a
                href="#contact"
                className="inline-flex h-12 items-center gap-2 rounded-2xl px-7 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
                style={{ background: CORAL }}
              >
                {w.hireMe} <ArrowRight className="size-4" />
              </a>
            )}
            <a
              href="#about"
              className="inline-flex h-12 items-center rounded-2xl px-7 text-sm font-semibold ring-1 transition-colors hover:bg-black/[0.03]"
              style={{ color: INK, borderColor: LINE, background: CARD }}
            >
              {w.knowMore}
            </a>
          </motion.div>

          {/* Professional information */}
          <motion.div
            {...enter(0.36)}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs lg:justify-start"
            style={{ color: MUTED }}
          >
            {page.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" style={{ color: CORAL }} /> {page.location}
              </span>
            )}
            {page.since && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarRange className="size-3.5" style={{ color: CORAL }} />
                {t.profile.since} {page.since}
              </span>
            )}
            {page.email && (
              <a
                href={`mailto:${page.email}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:opacity-70"
              >
                <Mail className="size-3.5" style={{ color: CORAL }} /> {page.email}
              </a>
            )}
          </motion.div>
        </div>

        {/* ---------- Right: portrait over geometric decor ---------- */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.6, 0.35, 1] }}
          className="relative order-1 mx-auto w-full max-w-sm lg:order-2 lg:max-w-none"
        >
          {/* Coral angular block behind the portrait */}
          <motion.div
            aria-hidden="true"
            style={{ x: coralX, y: coralY, background: CORAL }}
            className="absolute left-1/2 top-1/2 -z-0 h-[80%] w-[74%] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[2.5rem]"
          />
          {/* Purple counter-shape */}
          <motion.div
            aria-hidden="true"
            style={{ x: purpleX, y: purpleY, background: PURPLE }}
            className="absolute -left-3 top-4 -z-0 h-24 w-24 -rotate-12 rounded-3xl sm:h-32 sm:w-32"
          />
          {/* Dot cluster */}
          <motion.div
            aria-hidden="true"
            style={{ x: purpleX, y: coralY }}
            className="absolute -right-2 bottom-16 -z-0 grid grid-cols-3 gap-1.5"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="size-1.5 rounded-full"
                style={{ background: PURPLE, opacity: 0.6 }}
              />
            ))}
          </motion.div>

          {/* Portrait */}
          <div className="relative z-10 mx-auto w-[80%] max-w-xs sm:w-[72%]">
            {page.logoUrl ? (
              <img
                src={page.logoUrl}
                alt={page.displayName}
                className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_24px_48px_-24px_rgba(21,26,43,0.45)] ring-4 ring-white"
              />
            ) : (
              <div
                className="flex aspect-[4/5] w-full items-center justify-center rounded-[2rem] shadow-[0_24px_48px_-24px_rgba(21,26,43,0.4)] ring-4 ring-white"
                style={{ background: `linear-gradient(150deg, ${INK}, ${PURPLE})` }}
              >
                <span className="font-display text-6xl font-bold text-white">
                  {page.displayName.slice(0, 1)}
                </span>
              </div>
            )}
          </div>

          {/* Floating stat card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute -left-1 bottom-10 z-20 sm:left-0"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="rounded-2xl border bg-white px-4 py-3 shadow-xl"
              style={surfaceLine}
            >
              <p className="font-display text-2xl font-bold" style={{ color: INK }}>
                {projectCount}
              </p>
              <p className="text-[11px] font-medium" style={{ color: MUTED }}>
                {w.projects}
              </p>
            </motion.div>
          </motion.div>

          {/* Floating featured-work card */}
          {featured && (
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -right-1 top-6 z-20 sm:right-0"
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="flex max-w-[190px] items-center gap-2.5 rounded-2xl border bg-white p-2.5 pr-3.5 shadow-xl"
                style={surfaceLine}
              >
              {featured.imageUrl ? (
                <img
                  src={featured.imageUrl}
                  alt=""
                  className="size-11 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${CORAL}1a`, color: CORAL }}
                >
                  <Sparkles className="size-5" />
                </span>
              )}
              <div className="min-w-0">
                <p
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: CORAL }}
                >
                  {w.featured}
                </p>
                <p className="truncate text-xs font-semibold" style={{ color: INK }}>
                  {featured.title}
                </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================== *
 * Stats band
 * ================================================================== */

function StatBand({
  projects,
  services,
  articles,
  gallery,
  since,
  w,
}: {
  projects: number;
  services: number;
  articles: number;
  gallery: number;
  since?: string;
  w: PortfolioDict;
}) {
  const { t } = useI18n();
  const stats: { value: number; label: string }[] = [
    { value: projects, label: w.projects },
    { value: services, label: w.services },
    { value: articles, label: w.articles },
    { value: gallery, label: w.gallery },
  ].filter((s) => s.value > 0);

  return (
    <section className="px-4 sm:px-6">
      <Reveal className="mx-auto max-w-6xl">
        <div
          className={cn(surface, "grid grid-cols-2 divide-y p-2 sm:grid-cols-4 sm:divide-x sm:divide-y-0")}
          style={{ ...surfaceLine, borderColor: LINE }}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center px-4 py-6 text-center">
              <span className="font-display text-3xl font-bold sm:text-4xl" style={{ color: INK }}>
                <Counter to={s.value} />
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wider" style={{ color: MUTED }}>
                {s.label}
              </span>
            </div>
          ))}
          {since && (
            <div className="flex flex-col items-center px-4 py-6 text-center">
              <span className="font-display text-3xl font-bold sm:text-4xl" style={{ color: INK }}>
                {since}
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wider" style={{ color: MUTED }}>
                {t.profile.since}
              </span>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (n) => setV(Math.round(n)),
    });
    return () => controls.stop();
  }, [inView, to, reduce]);
  return <span ref={ref}>{reduce ? to : v}</span>;
}

/* ================================================================== *
 * Shared section wrapper
 * ================================================================== */

function Section({
  id,
  kicker,
  title,
  children,
}: {
  id?: string;
  kicker?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
      {(kicker || title) && (
        <Reveal className="mb-9">
          {kicker && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: CORAL }}>
              {kicker}
            </p>
          )}
          {title && (
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: INK }}
            >
              {title}
            </h2>
          )}
        </Reveal>
      )}
      {children}
    </section>
  );
}

/* ================================================================== *
 * Cards
 * ================================================================== */

function ProjectCard({
  page,
  item,
  accent,
  w,
  featuredBadge,
}: {
  page: ProPage;
  item: Item;
  accent: string;
  w: PortfolioDict;
  featuredBadge?: boolean;
}) {
  return (
    <Link
      to={`/u/${page.username}/i/${item.id}`}
      className={cn(surface, "group block h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl")}
      style={surfaceLine}
    >
      {item.imageUrl && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {featuredBadge && (
            <span
              className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ background: CORAL }}
            >
              {w.featured}
            </span>
          )}
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold" style={{ color: INK }}>
            {item.title}
          </h3>
          <ArrowUpRight
            className="mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ color: CORAL }}
          />
        </div>
        {item.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6" style={{ color: MUTED }}>
            {item.description}
          </p>
        )}
        {(item.role || item.client) && (
          <p className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
            <User className="size-3" /> {[item.role, item.client].filter(Boolean).join(" · ")}
          </p>
        )}
        {(item.startDate || item.endDate) && (
          <p className="mt-1 flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
            <CalendarRange className="size-3" />
            {[item.startDate, item.endDate].filter(Boolean).join(" → ")}
          </p>
        )}
        {(item.tags ?? []).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(item.tags ?? []).slice(0, 3).map((tg) => (
              <span
                key={tg}
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: `${accent}14`, color: accent }}
              >
                {tg}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function ServiceCard({
  page,
  item,
  accent,
}: {
  page: ProPage;
  item: Item;
  accent: string;
}) {
  return (
    <Link
      to={`/u/${page.username}/i/${item.id}`}
      className={cn(surface, "group block h-full p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl")}
      style={surfaceLine}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-bold" style={{ color: INK }}>
          {item.title}
        </h3>
        {item.status && (
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
            style={{ background: `${accent}18`, color: accent }}
          >
            {item.status}
          </span>
        )}
      </div>
      {item.description && (
        <p className="mt-2.5 text-sm leading-6" style={{ color: MUTED }}>
          {item.description}
        </p>
      )}
      <span
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-transform group-hover:translate-x-0.5"
        style={{ color: CORAL }}
      >
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}

function ArticleCard({
  page,
  item,
  accent,
  w,
}: {
  page: ProPage;
  item: Item;
  accent: string;
  w: PortfolioDict;
}) {
  return (
    <Link
      to={`/u/${page.username}/i/${item.id}`}
      className={cn(surface, "group flex gap-4 p-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl")}
      style={surfaceLine}
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt=""
          loading="lazy"
          className="size-20 shrink-0 rounded-2xl object-cover"
        />
      ) : (
        <span
          className="flex size-20 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: `${accent}16`, color: accent }}
        >
          <Sparkles className="size-6" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        {item.date && (
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: CORAL }}>
            {item.date}
          </p>
        )}
        <h3 className="mt-0.5 truncate font-display text-base font-bold" style={{ color: INK }}>
          {item.title}
        </h3>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-5" style={{ color: MUTED }}>
            {item.description}
          </p>
        )}
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: INK }}>
          {w.view} <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}


