import { ProfileComments } from "@/components/ProfileComments";
import type { Doc } from "@/convex/_generated/dataModel";
import { waLink } from "@/lib/elio";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  FolderGit2,
  Images,
  Instagram,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Tag,
} from "lucide-react";
import { useState, type CSSProperties } from "react";
import { Link } from "react-router";

/** Structural shape — accepts the public page object as returned by Convex. */
type CoverPage = Pick<
  Doc<"elioPages">,
  | "username"
  | "displayName"
  | "items"
  | "logoUrl"
  | "accent"
  | "bio"
  | "headline"
  | "trade"
  | "location"
  | "since"
  | "whatsapp"
  | "email"
  | "instagram"
  | "linkedin"
>;

const KIND_ICON: Record<string, typeof FolderGit2> = {
  project: FolderGit2,
  portfolio: Images,
  idea: Lightbulb,
  service: Briefcase,
  price: Tag,
};

/**
 * "Cover" template — the Zumeirah-style hero: a full-height rounded panel lit
 * by the client's accent color, a two-line display lockup (small line, then
 * the business name set huge), a minimal top bar and a meta row at the bottom
 * of the panel. The work grid, contact band and guestbook sit below it.
 */
export function CoverProfile({ page }: { page: CoverPage }) {
  const { t } = useI18n();
  const w = t.portfolio;
  const p = t.profile;
  const s = t.dashboard.sections;
  const accent = page.accent ?? "#1e4fd8";
  const initials = page.displayName.slice(0, 2).toUpperCase();
  const [logoBroken, setLogoBroken] = useState(false);

  const items = page.items ?? [];
  const waMessage = `Hello ${page.displayName} — found you through your Elio page.`;

  const kicker = page.headline || page.trade || w.tagline;
  const meta = [page.since ? `${p.since} ${page.since}` : null, page.location].filter(Boolean);

  const kindLabel: Record<string, string> = {
    project: s.addProject,
    portfolio: s.addPortfolio,
    idea: s.addIdea,
    service: s.addService,
    price: s.addPrice,
    article: w.articles,
  };

  /* Daylight washes live inline (white + accent tints); this is the night
     version only: accent blooming over deep navy behind the display type. */
  const panelStyle: CSSProperties = {
    background: [
      // Readability scrim — keeps the white type crisp over any accent
      "linear-gradient(180deg, rgba(6,10,26,0.45) 0%, rgba(6,10,26,0.18) 45%, rgba(6,10,26,0.5) 100%)",
      `radial-gradient(900px 520px at 88% 10%, ${accent}b3, transparent 62%)`,
      `radial-gradient(720px 540px at 6% 95%, ${accent}59, transparent 60%)`,
      "linear-gradient(150deg, #0a1130 0%, #111b40 46%, #070c1d 100%)",
    ].join(", "),
  };

  return (
    <div className="relative min-h-screen pb-14">
      {/* Soft accent halo sitting behind the cover card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"
        style={{ background: `radial-gradient(640px 400px at 50% 0%, ${accent}33, transparent 70%)` }}
      />

      <div className="relative mx-auto max-w-6xl px-3 pt-3 sm:px-6 sm:pt-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.6, 0.35, 1] }}
          className="relative flex min-h-[84vh] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-border/60 bg-card px-5 py-6 sm:rounded-[2.5rem] sm:px-10 sm:py-8"
          style={{ "--cover-name": accent } as CSSProperties}
        >
          {/* Daylight: white washed with the client's accent */}
          <div
            aria-hidden="true"
            className="absolute inset-0 dark:hidden"
            style={{
              background: [
                `radial-gradient(820px 500px at 88% 8%, ${accent}1f, transparent 62%)`,
                `radial-gradient(700px 520px at 4% 96%, ${accent}14, transparent 58%)`,
                "linear-gradient(155deg, #ffffff 0%, #f7f9fd 55%, #eef3fb 100%)",
              ].join(", "),
            }}
          />
          {/* Night: the accent glow over deep navy */}
          <div aria-hidden="true" className="absolute inset-0 hidden dark:block" style={panelStyle} />
          {/* ===== Top bar ===== */}
          <div className="relative flex items-center justify-between gap-4">
            <Link to={`/u/${page.username}`} className="flex min-w-0 items-center gap-2.5">
              {page.logoUrl && !logoBroken ? (
                <img
                  src={page.logoUrl}
                  alt={page.displayName}
                  onError={() => setLogoBroken(true)}
                  className="size-9 shrink-0 rounded-full object-cover ring-2 ring-border"
                />
              ) : (
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold text-white ring-2 ring-border"
                  style={{ background: accent }}
                >
                  {initials}
                </span>
              )}
              <span className="truncate font-display text-sm font-semibold text-foreground sm:text-base">
                {page.displayName}
              </span>
            </Link>

            <nav className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
              <a href="#cover-top" className="transition-colors hover:text-foreground">
                {w.home}
              </a>
              {items.length > 0 && (
                <a href="#cover-work" className="transition-colors hover:text-foreground">
                  {w.projects}
                </a>
              )}
              <a href="#cover-contact" className="transition-colors hover:text-foreground">
                {w.contact}
              </a>
            </nav>

            {page.whatsapp && (
              <a
                href={waLink(page.whatsapp, waMessage)}
                target="_blank"
                rel="noreferrer"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/15 sm:hidden"
                aria-label={w.contact}
              >
                <MessageCircle className="size-4" />
              </a>
            )}
          </div>

          {/* ===== The lockup ===== */}
          <div id="cover-top" className="relative py-12 sm:py-16">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.6, 0.35, 1] }}
              className="font-display"
            >
              <span className="block text-[clamp(1.375rem,4vw,2.75rem)] font-semibold leading-tight text-foreground/80">
                {kicker}
              </span>
              <span className="mt-1 block break-words text-[clamp(2.75rem,9vw,7rem)] font-extrabold leading-[0.92] tracking-tight text-[var(--cover-name)] [overflow-wrap:anywhere] dark:text-foreground">
                {page.displayName}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground sm:text-base"
            >
              {page.trade && (
                <span className="font-semibold uppercase tracking-[0.18em] text-foreground/70">{page.trade}</span>
              )}
              {page.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" /> {page.location}
                </span>
              )}
            </motion.div>

            {page.bio && (
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base"
              >
                {page.bio}
              </motion.p>
            )}

            {page.whatsapp && (
              <motion.a
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                href={waLink(page.whatsapp, waMessage)}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
                style={{ background: accent }}
              >
                <MessageCircle className="size-4" /> {w.contact}
              </motion.a>
            )}
          </div>

          {/* ===== Meta row — the bottom of the panel ===== */}
          <div className="relative flex flex-col gap-2 border-t border-border/70 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-sm">
            <span className="font-mono">/u/{page.username}</span>
            <span className="hidden sm:block">—</span>
            <span className="truncate">{meta.join(" · ") || "\u00a0"}</span>
          </div>
        </motion.section>
      </div>

      {/* ===== Work ===== */}
      {items.length > 0 && (
        <motion.section
          id="cover-work"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-14 max-w-6xl px-4 sm:px-6"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">
            {w.projectsKicker}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {w.projects}
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const Icon = KIND_ICON[item.kind] ?? FolderGit2;
              const inner = (
                <>
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
                      <span
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: accent }}
                      >
                        <Icon className="size-3.5" />
                        {kindLabel[item.kind] ?? w.tagline}
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <h3 className="mt-2 font-display font-semibold">{item.title}</h3>
                    {item.description && (
                      <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                    {(item.date || item.status) && (
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        {[item.date, item.status].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {(item.tags ?? []).length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {(item.tags ?? []).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              );
              const cls =
                "group block overflow-hidden rounded-3xl border border-border/60 bg-card text-left transition-colors hover:bg-accent/50";
              return item.linkUrl ? (
                <a
                  key={item.id}
                  href={item.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cls}
                >
                  {inner}
                </a>
              ) : (
                <Link key={item.id} to={`/u/${page.username}/i/${item.id}`} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* ===== Contact band ===== */}
      <section id="cover-contact" className="mx-auto mt-12 max-w-6xl px-4 sm:px-6">
        <div className="glass flex flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold sm:text-xl">{w.workTogether}</h2>
            <p className="mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">
              {w.workTogetherText}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {page.whatsapp && (
              <a
                href={waLink(page.whatsapp, waMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-lg transition-transform active:scale-[0.98]"
                style={{ background: accent }}
              >
                <MessageCircle className="size-4" /> {w.contact}
              </a>
            )}
            {page.email && (
              <a
                href={`mailto:${page.email}`}
                className="flex size-11 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={page.email}
              >
                <Mail className="size-4" />
              </a>
            )}
            {page.instagram && (
              <a
                href={
                  page.instagram.startsWith("http")
                    ? page.instagram
                    : `https://instagram.com/${page.instagram.replace(/^@/, "")}`
                }
                target="_blank"
                rel="noreferrer"
                className="flex size-11 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
            )}
            {page.linkedin && (
              <a
                href={
                  page.linkedin.startsWith("http")
                    ? page.linkedin
                    : `https://linkedin.com/in/${page.linkedin.replace(/^\//, "")}`
                }
                target="_blank"
                rel="noreferrer"
                className="flex size-11 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-4" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ===== Guestbook ===== */}
      <section className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <ProfileComments username={page.username} accent={accent} />
      </section>

      <footer className="mx-auto mt-10 flex max-w-6xl flex-col items-center gap-1.5 px-4 text-center text-xs text-muted-foreground sm:px-6">
        <span className="font-mono">/u/{page.username}</span>
        <Link to="/" className="transition-colors hover:text-foreground">
          {p.madeWith}
        </Link>
      </footer>
    </div>
  );
}
