import { Atmosphere } from "@/components/Atmosphere";
import { ElioMark } from "@/components/ElioMark";
import { StandardProfile } from "@/components/StandardProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { profileUrl, styleById, waLink } from "@/lib/elio";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  FolderGit2,
  Images,
  Instagram,
  Lightbulb,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Tag,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

type Item = Doc<"elioPages">["items"][number];

const KIND_ICON: Record<string, typeof FolderGit2> = {
  project: FolderGit2,
  portfolio: Images,
  idea: Lightbulb,
  service: Briefcase,
  price: Tag,
};

const SECTION_TITLES: Record<string, Record<"en" | "fr" | "tr", { title: string; sub: string }>> = {
  project: {
    en: { title: "Projects & references", sub: "Work we're proud of." },
    fr: { title: "Projets & références", sub: "Des travaux dont nous sommes fiers." },
    tr: { title: "Projeler & referanslar", sub: "Gurur duyduğumuz işler." },
  },
  portfolio: {
    en: { title: "Gallery", sub: "Moments from the work." },
    fr: { title: "Galerie", sub: "Des moments du travail." },
    tr: { title: "Galeri", sub: "İşten kareler." },
  },
  idea: {
    en: { title: "What's next", sub: "Currently on the bench." },
    fr: { title: "Et ensuite", sub: "En préparation." },
    tr: { title: "Sırada ne var", sub: "Şu anda hazırlıkta." },
  },
  service: {
    en: { title: "Services", sub: "What we can do for you." },
    fr: { title: "Services", sub: "Ce que nous pouvons faire pour vous." },
    tr: { title: "Hizmetler", sub: "Sizin için yapabileceklerimiz." },
  },
  price: {
    en: { title: "Offers", sub: "Current packages." },
    fr: { title: "Offres", sub: "Formules du moment." },
    tr: { title: "Teklifler", sub: "Güncel paketler." },
  },
};

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const page = useQuery(api.pages.getPublicPage, { username: username ?? "" });
  const comments = useQuery(api.pages.listComments, { username: username ?? "" });
  const { isAuthenticated } = useAuth();
  const { t, lang } = useI18n();
  const p = t.profile;

  const groups = useMemo(() => {
    if (!page) return [];
    const order = ["project", "service", "portfolio", "price", "idea"];
    return order
      .map((kind) => ({ kind, items: (page.items ?? []).filter((it: Item) => it.kind === kind) }))
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
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <Atmosphere />
        <ElioMark className="size-10" />
        <h1 className="font-display text-2xl font-bold">{p.notLive}</h1>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">{p.notLiveText}</p>
        <Link
          to="/auth?returnTo=%2Fdashboard"
          className="btn-glow mt-2 inline-flex h-10 items-center justify-center rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          {p.claim}
        </Link>
      </div>
    );
  }

  const accent = page.accent ?? "#1e4fd8";
  const style = styleById(page.style);
  const serif = style.id === "atelier";

  // Standard template: one-screen link-in-bio page.
  if ((page.template ?? "pro") === "standard") {
    return <StandardProfile page={page} />;
  }

  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      {isAuthenticated && (
        <div className="absolute left-4 top-4 z-20">
          <Button
            variant="outline"
            size="sm"
            className="btn-outline-glass rounded-xl border-border/60 backdrop-blur"
            asChild
          >
            <Link to="/dashboard">
              <ArrowLeft className="size-4" /> {t.nav.myElio}
            </Link>
          </Button>
        </div>
      )}

      {/* Accent halo */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background: `radial-gradient(600px 300px at 50% 0%, ${accent}22, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <main className={cn("relative z-10 mx-auto max-w-2xl px-4 pt-20 pb-24 sm:px-6", serif && "font-serif-accent")}>
        {/* Header card */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
          className="glass-strong overflow-hidden rounded-[2rem]"
        >
          {/* Cover */}
          <div
            className="relative h-44"
            style={{
              background: `linear-gradient(135deg, ${accent}44, transparent 70%)`,
            }}
          >
            {page.coverUrl ? (
              <img src={page.coverUrl} alt="" className="size-full object-cover" />
            ) : (
              <div
                className="size-full"
                style={{
                  background: `radial-gradient(420px 220px at 50% 130%, ${accent}66, transparent)`,
                }}
              />
            )}
          </div>

          <div className="px-7 pb-7 text-center sm:px-9">
            {page.logoUrl ? (
              <img
                src={page.logoUrl}
                alt={page.displayName}
                className="mx-auto -mt-12 size-24 rounded-3xl object-cover ring-4 ring-background"
              />
            ) : (
              <div
                className="mx-auto -mt-12 flex size-24 items-center justify-center rounded-3xl font-display text-3xl font-bold text-[#fff]"
                style={{
                  background: `linear-gradient(135deg, ${accent}, #1c1c22)`,
                  color: "#fff",
                }}
              >
                {page.displayName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight">
              {page.displayName}
            </h1>
            {(page.trade || page.headline) && (
              <p className="mt-1.5 text-muted-foreground">{page.headline || page.trade}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {page.location && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" /> {page.location}
                </span>
              )}
              {page.since && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground">
                  {p.since} {page.since}
                </span>
              )}
              {page.trade && (
                <span className="inline-flex items-center rounded-full border border-border/60 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground">
                  {page.trade}
                </span>
              )}
            </div>

            {page.bio && <p className="mt-4 leading-7 text-foreground/85">{page.bio}</p>}

            {/* Contact row — Discover → Connect */}
            {(page.whatsapp || page.email || page.instagram || page.linkedin) && (
              <div className="mt-5 flex items-center justify-center gap-2.5">
                {page.whatsapp && (
                  <a
                    href={waLink(page.whatsapp, `Hello ${page.displayName} — found you through your Elio page.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-white/[0.03] text-muted-foreground transition-all hover:scale-105 hover:text-foreground"
                    title="WhatsApp"
                  >
                    <MessageCircle className="size-4" />
                  </a>
                )}
                {page.email && (
                  <a
                    href={`mailto:${page.email}`}
                    className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-white/[0.03] text-muted-foreground transition-all hover:scale-105 hover:text-foreground"
                    title={page.email}
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
              {p.story}
            </p>
            <p className={cn("mt-4 whitespace-pre-line text-lg leading-8 text-foreground/85", serif && "italic")}>
              {page.story}
            </p>
          </motion.section>
        )}

        {/* Catalog sections */}
        {groups.map((g, gi) => {
          const Icon = KIND_ICON[g.kind] ?? FolderGit2;
          const tt = SECTION_TITLES[g.kind]?.[lang] ?? SECTION_TITLES.project.en;
          return (
            <motion.section
              key={g.kind}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 + gi * 0.08, ease: [0.21, 0.6, 0.35, 1] }}
              className="mt-5"
            >
              <div className="glass rounded-[2rem] p-7 sm:p-9">
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-10 items-center justify-center rounded-xl"
                    style={{ background: `${accent}1f`, color: accent }}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold">{tt.title}</h2>
                    <p className="text-xs text-muted-foreground">{tt.sub}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {g.items.map((item) => (
                    <Link
                      key={item.id}
                      to={`/u/${page.username}/i/${item.id}`}
                      className="group overflow-hidden rounded-2xl border border-border/60 bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.05]"
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium">{item.title}</p>
                          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all group-hover:scale-105 group-hover:text-foreground">
                            <ArrowUpRight className="size-3.5" />
                          </span>
                        </div>
                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                          {item.date && <span>{item.date}</span>}
                          {item.status && (
                            <span className="rounded-full border border-border/60 px-2 py-0.5">
                              {item.status}
                            </span>
                          )}
                          {(item.tags ?? []).slice(0, 2).map((tg) => (
                            <span key={tg} className="rounded-full border border-border/60 px-2 py-0.5">
                              {tg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.section>
          );
        })}

        {/* Comments */}
        <CommentsSection username={page.username} accent={accent} />

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 flex items-center justify-between text-xs text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <ElioMark className="size-3.5" /> {p.madeWith}
          </span>
          <Link to="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
            {p.createYours}
          </Link>
        </motion.footer>
      </main>
    </div>
  );
}

/* ================= Comments ================= */
function CommentsSection({ username, accent }: { username: string; accent: string }) {
  const { t } = useI18n();
  const p = t.profile;
  const comments = useQuery(api.pages.listComments, { username });
  const addComment = useMutation(api.pages.addComment);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSending(true);
    try {
      await addComment({ username, authorName: name, body });
      setBody("");
      toast.success(p.thanks);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="mt-5 glass rounded-[2rem] p-7 sm:p-9"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-xl"
          style={{ background: `${accent}1f`, color: accent }}
        >
          <MessageCircle className="size-5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">{p.commentsTitle}</h2>
          <p className="text-xs text-muted-foreground">{p.connect}</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{p.comment}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nadia / Atelier Kivu"
              className="bg-white/[0.04]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-transparent select-none">.</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={p.commentPh}
              rows={2}
              className="bg-white/[0.04]"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm" className="btn-glow rounded-xl" disabled={sending}>
            {sending ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}
            {p.send}
          </Button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {comments === undefined ? null : comments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/70 p-5 text-center text-sm text-muted-foreground">
            {p.commentsEmpty}
          </p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="rounded-2xl border border-border/60 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{c.authorName}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(c.at).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="mt-1.5 text-sm leading-6 text-foreground/85">{c.body}</p>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}
