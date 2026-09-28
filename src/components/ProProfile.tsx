import { Atmosphere } from "@/components/Atmosphere";
import { ElioMark } from "@/components/ElioMark";
import { ProfileComments } from "@/components/ProfileComments";
import type { Doc } from "@/convex/_generated/dataModel";
import { useIsMobile } from "@/hooks/use-mobile";
import { waLink } from "@/lib/elio";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  Newspaper,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

type Item = Doc<"elioPages">["items"][number];

/** Dict shape of the portfolio strings (mirrors t.portfolio). */
type PortfolioDict = {
  home: string;
  projects: string;
  articles: string;
  services: string;
  about: string;
  gallery: string;
  view: string;
  read: string;
  buyCta: string;
  contact: string;
  storyTitle: string;
  noStory: string;
  whatsNext: string;
  workTogether: string;
  workTogetherText: string;
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

/**
 * "Pro" template — full portfolio, magazine style (reference: Arctic Edage):
 * a bold accent hero with the featured work on a raised card and oversized
 * display title, then content delivered as full-height panels.
 *  - Mobile: the panels stack horizontally — swipe/scroll left-right.
 *  - Desktop: normal vertical page scroll, one panel after another.
 * The CatMascot (mini chat) doubles as the guide through the panels.
 */
export function ProProfile({ page }: { page: ProPage }) {
  const { t } = useI18n();
  const w = t.portfolio;
  const isMobile = useIsMobile();
  const accent = page.accent ?? "#1e4fd8";
  const initials = page.displayName.slice(0, 2).toUpperCase();
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [coverBroken, setCoverBroken] = useState(false);

  const projects = (page.items ?? []).filter((it) => it.kind === "project");
  const articles = (page.items ?? []).filter((it) => it.kind === "article");
  const services = (page.items ?? []).filter((it) => it.kind === "service" || it.kind === "price");
  const gallery = (page.items ?? []).filter((it) => it.kind === "portfolio");
  const ideas = (page.items ?? []).filter((it) => it.kind === "idea");

  // Hero featured work: first project with an image, else first project.
  const featured = projects.find((it) => !!it.imageUrl) ?? projects[0];

  /* ---------------- Horizontal panels (mobile) ---------------- */
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState(0);
  const panelCount = [
    projects.length > 0,
    articles.length > 0,
    services.length > 0 || gallery.length > 0,
    true, // about + contact panel always exists
  ].filter(Boolean).length;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !isMobile) return;
    const onScroll = () => {
      setPanel(Math.round(el.scrollLeft / el.clientWidth));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  const goToPanel = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  /* ---------------- Vertical progress (desktop) ---------------- */
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (isMobile) return;
    const sections = document.querySelectorAll<HTMLElement>("[data-pro-panel]");
    const onScroll = () => {
      let current = 0;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top < window.innerHeight * 0.45) current = i;
      });
      setVisible(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  const waMessage = `Hello ${page.displayName} — found you through your Elio page.`;

  /* ================= Mobile: horizontal snap panels ================= */
  if (isMobile) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <Atmosphere />
        {/* Top bar */}
        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-5">
          <div className="flex min-w-0 items-center gap-2">
            {page.logoUrl && !avatarBroken ? (
              <img
                src={page.logoUrl}
                alt={page.displayName}
                onError={() => setAvatarBroken(true)}
                className="size-8 rounded-full object-cover ring-2 ring-white/30"
              />
            ) : (
              <span
                className="flex size-8 items-center justify-center rounded-full font-display text-[10px] font-bold text-white"
                style={{ background: accent }}
              >
                {initials}
              </span>
            )}
            <span className="truncate font-display text-sm font-semibold text-white/95">
              {page.displayName}
            </span>
          </div>
          {page.whatsapp && (
            <a
              href={waLink(page.whatsapp, waMessage)}
              target="_blank"
              rel="noreferrer"
              className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
              aria-label="WhatsApp"
            >
              <MessageCircle className="size-4" />
            </a>
          )}
        </header>

        {/* Horizontal snap scroller — scroll/swipe left-right */}
        <div
          ref={scrollerRef}
          className="no-scrollbar h-[100dvh] w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
        >
          {/* Panel 1 — hero / featured work */}
          <PanelShell accent={accent} label={w.home}>
            <HeroContent page={page} accent={accent} featured={featured} avatarBroken={avatarBroken} setAvatarBroken={setAvatarBroken} compact />
          </PanelShell>

          {/* Panel 2 — projects */}
          {projects.length > 0 && (
            <PanelShell accent={accent} label={w.projects}>
              <ProjectsContent page={page} projects={projects} accent={accent} w={w} />
            </PanelShell>
          )}

          {/* Panel 3 — articles */}
          {articles.length > 0 && (
            <PanelShell accent={accent} label={w.articles}>
              <ArticlesContent page={page} articles={articles} accent={accent} w={w} />
            </PanelShell>
          )}

          {/* Panel 4 — services / gallery */}
          {(services.length > 0 || gallery.length > 0) && (
            <PanelShell accent={accent} label={w.services}>
              <ServicesContent page={page} services={services} gallery={gallery} accent={accent} w={w} />
            </PanelShell>
          )}

          {/* Panel 5 — about + contact + comments */}
          <PanelShell accent={accent} label={w.about}>
            <AboutContent page={page} accent={accent} w={w} ideas={ideas} coverBroken={coverBroken} setCoverBroken={setCoverBroken} />
          </PanelShell>
        </div>

        {/* Panel dots + arrows — the scroll guide */}
        <div className="absolute inset-x-0 bottom-5 z-30 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goToPanel(Math.max(0, panel - 1))}
            className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition disabled:opacity-30"
            disabled={panel === 0}
            aria-label={w.prev}
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: panelCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPanel(i)}
                className={cn(
                  "rounded-full transition-all",
                  i === panel ? "h-1.5 w-6 bg-white" : "size-1.5 bg-white/40",
                )}
                aria-label={`${w.panel} ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goToPanel(Math.min(panelCount - 1, panel + 1))}
            className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition disabled:opacity-30"
            disabled={panel >= panelCount - 1}
            aria-label={w.next}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  /* ================= Desktop: vertical panels ================= */
  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      {/* Fixed section rail */}
      <nav className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
        {[
          { label: w.home, show: true },
          { label: w.projects, show: projects.length > 0 },
          { label: w.articles, show: articles.length > 0 },
          { label: w.services, show: services.length > 0 || gallery.length > 0 },
          { label: w.about, show: true },
        ]
          .filter((s) => s.show)
          .map((s, i) => (
            <a
              key={s.label}
              href={`#pro-${i}`}
              className="group flex items-center justify-end gap-2"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(`pro-${i}`)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {s.label}
              </span>
              <span
                className={cn("rounded-full transition-all", i === visible ? "h-6 w-1.5" : "h-1.5 w-1.5")}
                style={{ background: i === visible ? accent : "var(--border)" }}
              />
            </a>
          ))}
      </nav>

      {/* Panel 0 — hero */}
      <section id="pro-0" data-pro-panel className="relative min-h-screen">
        <HeroContent page={page} accent={accent} featured={featured} avatarBroken={avatarBroken} setAvatarBroken={setAvatarBroken} />
      </section>

      {/* Panel — projects */}
      {projects.length > 0 && (
        <section id="pro-1" data-pro-panel className="relative mx-auto max-w-5xl px-6 py-20">
          <SectionHead kicker={w.projectsKicker} title={w.projects} accent={accent} />
          <ProjectsContent page={page} projects={projects} accent={accent} w={w} />
        </section>
      )}

      {/* Panel — articles */}
      {articles.length > 0 && (
        <section id="pro-2" data-pro-panel className="relative py-20">
          <div className="mx-auto max-w-5xl px-6">
            <SectionHead kicker={w.articlesKicker} title={w.articles} accent={accent} />
            <ArticlesContent page={page} articles={articles} accent={accent} w={w} />
          </div>
        </section>
      )}

      {/* Panel — services + gallery */}
      {(services.length > 0 || gallery.length > 0) && (
        <section id="pro-3" data-pro-panel className="relative py-20">
          <div className="mx-auto max-w-5xl px-6">
            <SectionHead kicker={w.servicesKicker} title={w.services} accent={accent} />
            <ServicesContent page={page} services={services} gallery={gallery} accent={accent} w={w} />
          </div>
        </section>
      )}

      {/* Panel — about + contact + comments */}
      <section id="pro-4" data-pro-panel className="relative py-20">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHead kicker={w.aboutKicker} title={w.about} accent={accent} />
          <AboutContent page={page} accent={accent} w={w} ideas={ideas} coverBroken={coverBroken} setCoverBroken={setCoverBroken} />
        </div>
      </section>

      <footer className="flex items-center justify-center gap-1.5 pb-10 text-xs text-muted-foreground">
        <ElioMark className="size-3.5" />
        <span className="font-mono">{page.username}</span>
      </footer>
    </div>
  );
}

/* ================= Shared pieces ================= */

function SectionHead({ kicker, title, accent }: { kicker: string; title: string; accent: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>
        {kicker}
      </p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

/** Full-height accent panel used by the mobile horizontal scroller. */
function PanelShell({
  accent,
  label,
  children,
}: {
  accent: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative h-[100dvh] w-full shrink-0 snap-start overflow-y-auto no-scrollbar">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(120% 90% at 20% 0%, ${accent}2e, transparent 60%)` }}
        aria-hidden="true"
      />
      <div className="relative flex min-h-[100dvh] flex-col px-5 pb-28 pt-24">
        <span className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>
          {label}
        </span>
        <div className="flex-1">{children}</div>
      </div>
    </section>
  );
}

/** Hero — reference layout: raised work card left, oversized title right. */
function HeroContent({
  page,
  accent,
  featured,
  avatarBroken,
  setAvatarBroken,
  compact = false,
}: {
  page: ProPage;
  accent: string;
  featured?: Item;
  avatarBroken: boolean;
  setAvatarBroken: (v: boolean) => void;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const w = t.portfolio;
  const initials = page.displayName.slice(0, 2).toUpperCase();
  const waMessage = `Hello ${page.displayName} — found you through your Elio page.`;

  return (
    <div className={cn("grid items-center gap-8", compact ? "" : "mx-auto max-w-6xl px-6 lg:grid-cols-2 lg:py-24")}>
      {/* Raised featured-work card */}
      {featured?.imageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
          className={cn(
            "relative rounded-[2rem] bg-white/[0.06] p-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-sm",
            compact ? "mx-auto w-full max-w-xs" : "mx-auto w-full max-w-md",
          )}
        >
          <img
            src={featured.imageUrl}
            alt={featured.title}
            className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
          />
          <div className="flex items-center justify-between px-3 py-3">
            <p className="truncate font-display text-sm font-semibold text-white">{featured.title}</p>
            <Link
              to={`/u/${page.username}/i/${featured.id}`}
              className="flex shrink-0 items-center gap-1 text-xs font-medium text-white/85 transition-colors hover:text-white"
            >
              {w.view} <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Identity + oversized title */}
      <div className={cn(compact ? "" : "text-center lg:text-left")}>
        {!featured?.imageUrl && (
          <div className={cn("mb-6", compact ? "" : "flex justify-center lg:justify-start")}>
            {page.logoUrl && !avatarBroken ? (
              <img
                src={page.logoUrl}
                alt={page.displayName}
                onError={() => setAvatarBroken(true)}
                className="size-16 rounded-full object-cover ring-2 ring-white/30"
              />
            ) : (
              <span
                className="flex size-16 items-center justify-center rounded-full font-display text-lg font-bold text-white"
                style={{ background: accent }}
              >
                {initials}
              </span>
            )}
          </div>
        )}
        <h1
          className={cn(
            "font-display font-bold tracking-tight text-white",
            compact ? "text-4xl" : "text-5xl sm:text-6xl lg:text-7xl",
          )}
        >
          {page.displayName}
        </h1>
        <p className="mt-2 font-display text-lg" style={{ color: accent }}>
          {page.headline || page.trade || w.tagline}
        </p>
        {(page.location || page.since) && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/70">
            <MapPin className="size-3.5" />
            {[page.location, page.since && `${t.profile.since} ${page.since}`].filter(Boolean).join(" · ")}
          </p>
        )}
        {page.bio && <p className="mt-4 max-w-md text-sm leading-6 text-white/75">{page.bio}</p>}

        <div className={cn("mt-6 flex flex-wrap items-center gap-3", compact ? "" : "justify-center lg:justify-start")}>
          {page.whatsapp && (
            <a
              href={waLink(page.whatsapp, waMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#111318] shadow-lg transition-transform active:scale-[0.98]"
            >
              {w.buyCta} <ArrowRight className="size-4" />
            </a>
          )}
          {page.email && (
            <a
              href={`mailto:${page.email}`}
              className="flex size-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
              aria-label={page.email}
            >
              <Mail className="size-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectsContent({
  page,
  projects,
  accent,
}: {
  page: ProPage;
  projects: Item[];
  accent: string;
  w: PortfolioDict;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((item) => (
        <Link
          key={item.id}
          to={`/u/${page.username}/i/${item.id}`}
          className="group overflow-hidden rounded-3xl bg-white/[0.05] ring-1 ring-white/10 transition-all hover:bg-white/[0.09]"
        >
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          )}
          <div className="p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-display font-semibold text-white">{item.title}</h3>
              <ArrowRight className="size-4 shrink-0 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
            </div>
            {item.description && (
              <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-white/65">{item.description}</p>
            )}
            {(item.client || item.role) && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-white/55">
                <User className="size-3" />
                {[item.role, item.client].filter(Boolean).join(" · ")}
              </p>
            )}
            {(item.startDate || item.endDate) && (
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/55">
                <CalendarRange className="size-3" />
                {[item.startDate, item.endDate].filter(Boolean).join(" → ")}
              </p>
            )}
            {(item.tags ?? []).length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {(item.tags ?? []).slice(0, 3).map((tg) => (
                  <span key={tg} className="rounded-full px-2 py-0.5 text-[10px]" style={{ background: `${accent}30`, color: "#fff" }}>
                    {tg}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

function ArticlesContent({
  page,
  articles,
  accent,
  w,
}: {
  page: ProPage;
  articles: Item[];
  accent: string;
  w: PortfolioDict;
}) {
  return (
    <div className="space-y-4">
      {articles.map((item) => (
        <Link
          key={item.id}
          to={`/u/${page.username}/i/${item.id}`}
          className="group flex gap-4 rounded-3xl bg-white/[0.05] p-4 ring-1 ring-white/10 transition-all hover:bg-white/[0.09] sm:p-5"
        >
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" loading="lazy" className="size-20 shrink-0 rounded-2xl object-cover sm:size-24" />
          ) : (
            <span
              className="flex size-20 shrink-0 items-center justify-center rounded-2xl sm:size-24"
              style={{ background: `${accent}30` }}
            >
              <Newspaper className="size-7 text-white/80" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            {item.date && <p className="text-[11px] uppercase tracking-wider" style={{ color: accent }}>{item.date}</p>}
            <h3 className="mt-0.5 truncate font-display font-semibold text-white">{item.title}</h3>
            {item.description && <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/65">{item.description}</p>}
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white/85">
              {w.read} <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ServicesContent({
  page,
  services,
  gallery,
  accent,
  w,
}: {
  page: ProPage;
  services: Item[];
  gallery: Item[];
  accent: string;
  w: PortfolioDict;
}) {
  return (
    <div className="space-y-6">
      {services.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((item) => (
            <Link
              key={item.id}
              to={`/u/${page.username}/i/${item.id}`}
              className="group rounded-2xl bg-white/[0.05] p-5 ring-1 ring-white/10 transition-all hover:bg-white/[0.09]"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate font-display font-semibold text-white">{item.title}</h3>
                {item.status && (
                  <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold" style={{ background: `${accent}35`, color: "#fff" }}>
                    {item.status}
                  </span>
                )}
              </div>
              {item.description && <p className="mt-1.5 text-sm leading-5 text-white/65">{item.description}</p>}
            </Link>
          ))}
        </div>
      )}
      {gallery.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{w.gallery}</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {gallery.slice(0, 8).map((item) => (
              <Link
                key={item.id}
                to={`/u/${page.username}/i/${item.id}`}
                className="group relative overflow-hidden rounded-xl ring-1 ring-white/10"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AboutContent({
  page,
  accent,
  w,
  ideas,
  coverBroken,
  setCoverBroken,
}: {
  page: ProPage;
  accent: string;
  w: PortfolioDict;
  ideas: Item[];
  coverBroken: boolean;
  setCoverBroken: (v: boolean) => void;
}) {
  const waMessage = `Hello ${page.displayName} — found you through your Elio page.`;
  return (
    <div className="space-y-8">
      {/* Story + cover */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-white/[0.05] p-6 ring-1 ring-white/10">
          <h3 className="font-display text-lg font-semibold text-white">{w.storyTitle}</h3>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/75">
            {page.bio || w.noStory}
          </p>
          {ideas.length > 0 && (
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{w.whatsNext}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {ideas.map((idea) => (
                  <Link
                    key={idea.id}
                    to={`/u/${page.username}/i/${idea.id}`}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85 transition-colors hover:bg-white/20"
                  >
                    {idea.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        {page.coverUrl && !coverBroken ? (
          <img
            src={page.coverUrl}
            alt=""
            onError={() => setCoverBroken(true)}
            className="h-48 w-full rounded-3xl object-cover ring-1 ring-white/10 lg:h-full"
          />
        ) : (
          <div
            className="hidden h-full min-h-40 rounded-3xl ring-1 ring-white/10 lg:block"
            style={{ background: `radial-gradient(300px 200px at 50% 100%, ${accent}55, transparent)` }}
          />
        )}
      </div>

      {/* Contact band */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6 ring-1 ring-white/15" style={{ background: `${accent}30` }}>
        <div>
          <h3 className="font-display text-lg font-semibold text-white">{w.workTogether}</h3>
          <p className="mt-1 text-sm text-white/70">{w.workTogetherText}</p>
        </div>
        <div className="flex items-center gap-2.5">
          {page.whatsapp && (
            <a
              href={waLink(page.whatsapp, waMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#111318] shadow-lg transition-transform active:scale-[0.98]"
            >
              <MessageCircle className="size-4" /> {w.contact}
            </a>
          )}
          {page.email && (
            <a
              href={`mailto:${page.email}`}
              className="flex size-11 items-center justify-center rounded-xl bg-white/20 text-white transition-colors hover:bg-white/30"
              aria-label={page.email}
            >
              <Mail className="size-4" />
            </a>
          )}
        </div>
      </div>

      {/* Visitor comments */}
      <ProfileComments username={page.username} accent={accent} onAccent />
    </div>
  );
}
