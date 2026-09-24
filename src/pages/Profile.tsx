import { Atmosphere } from "@/components/Atmosphere";
import { Button } from "@/components/ui/button";
import { ElioMark } from "@/components/ElioMark";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { profileUrl } from "@/lib/elio";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  ExternalLink,
  FolderGit2,
  Images,
  Lightbulb,
  Loader2,
  Mail,
  MessageCircle,
  Instagram,
  Linkedin,
  MapPin,
  QrCode,
  Tag,
} from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { Link, useParams } from "react-router";

type Page = Doc<"elioPages">;
type Item = Page["items"][number];

const KIND_ICON: Record<string, typeof FolderGit2> = {
  project: FolderGit2,
  portfolio: Images,
  idea: Lightbulb,
  service: Briefcase,
  price: Tag,
};

const SECTION_TITLES: Record<string, { title: string; sub: string }> = {
  project: { title: "Projects", sub: "Things I've built." },
  portfolio: { title: "Portfolio", sub: "Visual work." },
  idea: { title: "Ideas", sub: "What I'm exploring." },
  service: { title: "Services", sub: "What I offer." },
  price: { title: "Pricing", sub: "Simple, honest rates." },
};

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const page = useQuery(api.pages.getPublicPage, { username: username ?? "" });
  const { isAuthenticated } = useAuth();

  const groups = useMemo(() => {
    if (!page) return [];
    const order = ["project", "portfolio", "service", "price", "idea"];
    return order
      .map((kind) => ({
        kind,
        items: (page.items ?? []).filter((it: Item) => it.kind === kind),
      }))
      .filter((g) => g.items.length > 0);
  }, [page]);

  if (page === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (page === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <ElioMark className="size-10" />
        <h1 className="font-display text-2xl font-bold">This space isn't live yet</h1>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          @{username} hasn't published their Elio yet — or the username doesn't exist.
          Maybe it's you?
        </p>
        <Link to="/auth?returnTo=%2Fdashboard" className="btn-glow mt-2 inline-flex h-10 items-center justify-center rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
          Claim this username
        </Link>
      </div>
    );
  }

  const accent = page.accent ?? "#f0b03f";
  const initials = page.displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      {isAuthenticated && (
        <div className="absolute left-4 top-4 z-20">
          <Button variant="outline" size="sm" className="rounded-xl border-border/60 bg-white/[0.03] backdrop-blur" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="size-4" /> Editor
            </Link>
          </Button>
        </div>
        ) }
      {/* Glow halo behind the card, tinted with the owner's accent */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background: `radial-gradient(600px 300px at 50% 0%, ${accent}22, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <main className="relative z-10 mx-auto max-w-2xl px-4 pt-20 pb-24 sm:px-6">
        {/* Header card */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
          className="glass-strong rounded-[2rem] p-7 text-center sm:p-9"
        >
          {page.avatarUrl ? (
            <img
              src={page.avatarUrl}
              alt={page.displayName}
              className="mx-auto size-24 rounded-3xl object-cover ring-2 ring-border"
            />
          ) : (
            <div
              className="mx-auto flex size-24 items-center justify-center rounded-3xl font-display text-3xl font-bold text-[#221503]"
              style={{ background: `linear-gradient(135deg, ${accent}, #67d4f2)` }}
            >
              {initials || "@"}
            </div>
          )}

          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight">{page.displayName}</h1>
          {page.headline && <p className="mt-1.5 text-muted-foreground">{page.headline}</p>}

          {page.location && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" /> {page.location}
            </p>
          )}

          {page.bio && <p className="mt-4 leading-7 text-foreground/85">{page.bio}</p>}

          {/* Contact row — Discover → Connect */}
          {(page.email || page.whatsapp || page.instagram || page.linkedin) && (
            <div className="mt-5 flex items-center justify-center gap-2.5">
              {page.email && (
                <a
                  href={`mailto:${page.email}`}
                  className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-white/[0.03] text-muted-foreground transition-all hover:scale-105 hover:text-foreground"
                  title={page.email}
                >
                  <Mail className="size-4" />
                </a>
              )}
              {page.whatsapp && (
                <a
                  href={`https://wa.me/${page.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-white/[0.03] text-muted-foreground transition-all hover:scale-105 hover:text-foreground"
                  title="WhatsApp"
                >
                  <MessageCircle className="size-4" />
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
                  className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-white/[0.03] text-muted-foreground transition-all hover:scale-105 hover:text-foreground"
                  title="Instagram"
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
                  className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-white/[0.03] text-muted-foreground transition-all hover:scale-105 hover:text-foreground"
                  title="LinkedIn"
                >
                  <Linkedin className="size-4" />
                </a>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ElioMark className="size-3.5" />
            <span className="font-mono">{profileUrl(page.username).replace(/^https?:\/\//, "")}</span>
          </div>
        </motion.section>

        {/* Story */}
        {page.story && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.6, 0.35, 1] }}
            className="mt-5 rounded-[2rem] border border-border/60 p-7 sm:p-9"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: accent }}>
              Story
            </p>
            <p className="font-serif-accent mt-4 whitespace-pre-line text-lg leading-8 text-foreground/85">
              {page.story}
            </p>
          </motion.section>
        )}

        {/* Item sections */}
        {groups.map((g, gi) => (
          <motion.section
            key={g.kind}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 + gi * 0.08, ease: [0.21, 0.6, 0.35, 1] }}
            className="mt-5"
          >
            <div className="glass rounded-[2rem] p-7 sm:p-9">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = KIND_ICON[g.kind] ?? FolderGit2;
                  return (
                    <div
                      className="flex size-10 items-center justify-center rounded-xl"
                      style={{ background: `${accent}1f`, color: accent }}
                    >
                      <Icon className="size-5" />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="font-display text-lg font-semibold">
                    {SECTION_TITLES[g.kind]?.title ?? g.kind}
                  </h2>
                  <p className="text-xs text-muted-foreground">{SECTION_TITLES[g.kind]?.sub}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {g.items.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-2xl border border-border/60 bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium">{item.title}</p>
                        {item.description && (
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {item.tags.map((t) => (
                              <span
                                key={t}
                                className="rounded-full border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {item.linkUrl && (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <ArrowUpRight className="size-4" />
                        </a>
                      )}
                    </div>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="mt-3 h-44 w-full rounded-xl object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        ))}

        {/* Footer strip */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 flex items-center justify-between text-xs text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <ElioMark className="size-3.5" /> Made with Elio
          </span>
          <Link to="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
            <QrCode className="size-3.5" /> Create yours
          </Link>
        </motion.footer>
      </main>
    </div>
  );
}
