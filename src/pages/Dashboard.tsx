import { Atmosphere } from "@/components/Atmosphere";
import { ElioMark } from "@/components/ElioMark";
import { QrShowcase } from "@/components/QrShowcase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import {
  ACCENTS,
  CONCIERGE_WHATSAPP,
  PAGE_STYLES,
  SECTION_KINDS,
  buildBrief,
  profileUrl,
  splitTags,
  waLink,
} from "@/lib/elio";
import { downloadBriefPdf } from "@/lib/brief-pdf";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowUpRight,
  Briefcase,
  Check,
  Download,
  Eye,
  EyeOff,
  FolderGit2,
  Images,
  Lightbulb,
  Loader2,
  LogOut,
  MessageCircle,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

type Page = Doc<"elioPages">;

const KIND_ICON: Record<string, typeof FolderGit2> = {
  project: FolderGit2,
  portfolio: Images,
  idea: Lightbulb,
  service: Briefcase,
  price: Tag,
};

export default function Dashboard() {
  const { signOut } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const page = useQuery(api.pages.getMyPage);

  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/40 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <ElioMark className="size-6" />
            <span className="font-display text-lg font-semibold tracking-tight">
              Elio <span className="text-muted-foreground">Pages</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => navigate("/directory")}>
              {t.nav.directory}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              <LogOut className="size-4" /> {t.nav.signIn}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        {page === undefined ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : page === null ? (
          <Onboarding />
        ) : (
          <Editor page={page} />
        )}
      </main>
    </div>
  );
}

/* ================= Onboarding ================= */
function Onboarding() {
  const { t } = useI18n();
  const { user } = useAuth();
  const o = t.dashboard.onboarding;

  const suggested = (user?.name ?? user?.email?.split("@")[0] ?? "you")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24) || "you";
  const [username, setUsername] = useState(suggested);
  const [displayName, setDisplayName] = useState("");
  const [creating, setCreating] = useState(false);
  const checkUsername = useQuery(api.pages.checkUsername, {
    username: username.trim().length >= 3 ? username.trim() : "***",
  });
  const createPage = useMutation(api.pages.createPage);
  const available = username.trim().length >= 3 && checkUsername ? checkUsername.available : null;

  const create = async () => {
    if (!displayName.trim()) {
      toast.error(o.business);
      return;
    }
    setCreating(true);
    try {
      await createPage({ username, displayName });
      toast.success("✨");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg py-10">
      <div className="glass-strong rounded-3xl p-8">
        <div className="flex items-center gap-3">
          <ElioMark className="size-9" />
          <h1 className="font-display text-2xl font-bold tracking-tight">{o.title}</h1>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{o.sub}</p>

        <div className="mt-7 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{o.username}</Label>
            <div className="flex items-center rounded-xl border border-input bg-white/[0.03] focus-within:ring-2 focus-within:ring-ring/40">
              <span className="border-r border-input px-3 py-2.5 font-mono text-sm text-muted-foreground">
                /u/
              </span>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="atelier-kivu"
              />
            </div>
            {available === true && (
              <p className="flex items-center gap-1.5 text-xs text-emerald-500">
                <Check className="size-3.5" /> {username} — OK
              </p>
            )}
            {available === false && (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <X className="size-3.5" /> {username}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">{o.business}</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={o.businessPh}
            />
          </div>

          <Button
            className="btn-glow w-full rounded-2xl"
            onClick={create}
            disabled={creating || available === false}
          >
            {creating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {o.submit}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ================= Editor ================= */
function Editor({ page }: { page: Page }) {
  const { t } = useI18n();
  const s = t.dashboard.sections;
  const sb = t.dashboard.sidebar;
  const updatePage = useMutation(api.pages.updatePage);
  const addItem = useMutation(api.pages.addItem);
  const [saving, setSaving] = useState(false);

  const save = async (patch: Record<string, unknown>) => {
    setSaving(true);
    try {
      await updatePage({ pageId: page._id, ...patch } as Parameters<typeof updatePage>[0]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const brief = buildBrief({
    displayName: page.displayName,
    trade: page.trade,
    location: page.location,
    since: page.since,
    email: page.email,
    whatsapp: page.whatsapp,
    instagram: page.instagram,
    linkedin: page.linkedin,
    headline: page.headline,
    bio: page.bio,
    story: page.story,
    accent: page.accent,
    style: page.style,
    logoUrl: page.logoUrl,
    coverUrl: page.coverUrl,
    items: page.items,
    profileLink: profileUrl(page.username),
  });

  const kindLabel: Record<string, string> = {
    project: s.addProject,
    portfolio: s.addPortfolio,
    idea: s.addIdea,
    service: s.addService,
    price: s.addPrice,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Left: editors */}
      <div className="space-y-6">
        <GlassSection title={s.identity} desc={s.identityDesc}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={s.businessName}>
              <Input
                defaultValue={page.displayName}
                onBlur={(e) => save({ displayName: e.target.value })}
              />
            </Field>
            <Field label={s.trade}>
              <Input
                defaultValue={page.trade ?? ""}
                placeholder={s.tradePh}
                onBlur={(e) => save({ trade: e.target.value })}
              />
            </Field>
            <Field label={s.location}>
              <Input
                defaultValue={page.location ?? ""}
                onBlur={(e) => save({ location: e.target.value })}
              />
            </Field>
            <Field label={s.since}>
              <Input
                defaultValue={page.since ?? ""}
                placeholder={s.sincePh}
                onBlur={(e) => save({ since: e.target.value })}
              />
            </Field>
            <Field label={s.email}>
              <Input
                type="email"
                defaultValue={page.email ?? ""}
                onBlur={(e) => save({ email: e.target.value })}
              />
            </Field>
            <Field label={s.whatsapp}>
              <Input
                type="tel"
                defaultValue={page.whatsapp ?? ""}
                onBlur={(e) => save({ whatsapp: e.target.value })}
              />
            </Field>
            <Field label={s.instagram}>
              <Input
                defaultValue={page.instagram ?? ""}
                onBlur={(e) => save({ instagram: e.target.value })}
              />
            </Field>
            <Field label={s.linkedin}>
              <Input
                defaultValue={page.linkedin ?? ""}
                onBlur={(e) => save({ linkedin: e.target.value })}
              />
            </Field>
          </div>
          <Field label={s.headline}>
            <Input
              defaultValue={page.headline ?? ""}
              placeholder={s.headlinePh}
              onBlur={(e) => save({ headline: e.target.value })}
            />
          </Field>
          <Field label={s.bio}>
            <Textarea
              defaultValue={page.bio ?? ""}
              placeholder={s.bioPh}
              rows={2}
              onBlur={(e) => save({ bio: e.target.value })}
            />
          </Field>
          <Field label={s.story}>
            <Textarea
              defaultValue={page.story ?? ""}
              placeholder={s.storyPh}
              rows={4}
              onBlur={(e) => save({ story: e.target.value })}
            />
          </Field>
        </GlassSection>

        <GlassSection title={s.look} desc={s.lookDesc}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={s.logo}>
              <Input
                defaultValue={page.logoUrl ?? ""}
                placeholder={s.logoPh}
                onBlur={(e) => save({ logoUrl: e.target.value })}
              />
            </Field>
            <Field label={s.cover}>
              <Input
                defaultValue={page.coverUrl ?? ""}
                placeholder={s.coverPh}
                onBlur={(e) => save({ coverUrl: e.target.value })}
              />
            </Field>
          </div>
          <Field label={s.accent}>
            <div className="flex gap-2">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => save({ accent: c })}
                  className={cn(
                    "size-8 rounded-full border-2 transition-transform hover:scale-110",
                    (page.accent ?? ACCENTS[0]) === c ? "border-foreground" : "border-transparent",
                  )}
                  style={{ background: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </Field>
          <Field label={s.style}>
            <div className="grid gap-2 sm:grid-cols-4">
              {PAGE_STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => save({ style: st.id })}
                  className={cn(
                    "rounded-2xl border p-3 text-left transition-all",
                    (page.style ?? "noir") === st.id
                      ? "border-ember ring-1 ring-ember/50"
                      : "border-border/60 hover:bg-white/[0.04]",
                  )}
                >
                  <span className="block h-10 w-full rounded-lg" style={{ background: st.swatch }} />
                  <span className="mt-2 block text-xs font-medium">{st.label}</span>
                  <span className="block text-[10px] leading-4 text-muted-foreground">{st.desc}</span>
                </button>
              ))}
            </div>
          </Field>
        </GlassSection>

        <GlassSection title={s.content} desc={s.contentDesc}>
          <div className="flex flex-wrap gap-2">
            {SECTION_KINDS.map((k) => (
              <Button
                key={k.kind}
                size="sm"
                variant="outline"
                className="rounded-xl border-border/70 bg-white/[0.03]"
                onClick={() =>
                  addItem({
                    pageId: page._id,
                    kind: k.kind,
                    title: `${kindLabel[k.kind] ?? k.label} — ${page.displayName}`,
                  })
                }
              >
                <Plus className="size-4" /> {kindLabel[k.kind] ?? k.label}
              </Button>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {page.items.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
                {s.empty}
              </p>
            )}
            {page.items.map((it) => (
              <ItemCard key={it.id} item={it} pageId={page._id} />
            ))}
          </div>
        </GlassSection>
      </div>

      {/* Right: link, publish, QR, WhatsApp handoff */}
      <div className="space-y-5">
        <div className="glass-strong sticky top-24 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {sb.yourLink}
            </h3>
            {saving && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          </div>
          <a
            href={profileUrl(page.username)}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-white/[0.03] px-3 py-2.5 font-mono text-sm transition-colors hover:bg-white/[0.06]"
          >
            <span className="truncate">/u/{page.username}</span>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
          </a>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-border/60 bg-white/[0.03] px-3 py-2.5">
            <span className="text-sm text-muted-foreground">
              {page.isPublished ? sb.published : sb.draft}
            </span>
            <Button
              size="sm"
              variant={page.isPublished ? "secondary" : "default"}
              className="btn-glow rounded-lg"
              onClick={() => save({ isPublished: !page.isPublished })}
            >
              {page.isPublished ? (
                <>
                  <EyeOff className="size-3.5" /> {sb.unpublish}
                </>
              ) : (
                <>
                  <Eye className="size-3.5" /> {sb.publish}
                </>
              )}
            </Button>
          </div>

          <div className="mt-5">
            <QrShowcase username={page.username} />
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MessageCircle className="size-4 text-emerald-500" />
              {sb.conciergeTitle}
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{sb.conciergeText}</p>
            <Button
              size="sm"
              className="mt-3 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
              onClick={() => window.open(waLink(CONCIERGE_WHATSAPP, brief), "_blank")}
            >
              <MessageCircle className="size-3.5" /> {sb.conciergeCta}
            </Button>
            <button
              type="button"
              onClick={() =>
                downloadBriefPdf({
                  businessName: page.displayName,
                  trade: page.trade,
                  location: page.location,
                  since: page.since,
                  email: page.email,
                  whatsapp: page.whatsapp,
                  instagram: page.instagram,
                  linkedin: page.linkedin,
                  headline: page.headline,
                  bio: page.bio,
                  story: page.story,
                  accent: page.accent,
                  style: page.style,
                  logoUrl: page.logoUrl,
                  coverUrl: page.coverUrl,
                  username: page.username,
                  profileLink: profileUrl(page.username),
                  items: page.items,
                })
              }
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border/60 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Download className="size-3.5" /> {t.services.pdf.download}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Item editor card ================= */
function ItemCard({ item, pageId }: { item: Page["items"][number]; pageId: Page["_id"] }) {
  const { t } = useI18n();
  const i18 = t.dashboard.item;
  const updateItem = useMutation(api.pages.updateItem);
  const removeItem = useMutation(api.pages.removeItem);
  const [open, setOpen] = useState(false);
  const Icon = KIND_ICON[item.kind] ?? FolderGit2;

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <button className="min-w-0 flex-1 text-left" onClick={() => setOpen(!open)}>
          <p className="truncate text-sm font-medium">{item.title || "—"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {item.description || [item.date, item.status].filter(Boolean).join(" · ") || item.kind}
          </p>
        </button>
        <Badge
          variant="secondary"
          className="shrink-0 rounded-lg bg-white/[0.05] text-[10px] uppercase tracking-wide"
        >
          {item.kind}
        </Badge>
        <Button size="icon-sm" variant="ghost" onClick={() => removeItem({ pageId, itemId: item.id })}>
          <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
        </Button>
        <Button size="icon-sm" variant="ghost" onClick={() => setOpen(!open)}>
          {open ? <X className="size-4" /> : <Plus className="size-4 rotate-45" />}
        </Button>
      </div>

      {open && (
        <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
          <Field label={i18.title}>
            <Input
              defaultValue={item.title}
              key={item.id + "-title"}
              placeholder={i18.titlePh}
              onBlur={(e) => updateItem({ pageId, itemId: item.id, title: e.target.value })}
            />
          </Field>
          <Field label={i18.description}>
            <Textarea
              defaultValue={item.description ?? ""}
              key={item.id + "-desc"}
              rows={3}
              placeholder={i18.descriptionPh}
              onBlur={(e) => updateItem({ pageId, itemId: item.id, description: e.target.value })}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={i18.image}>
              <Input
                defaultValue={item.imageUrl ?? ""}
                key={item.id + "-img"}
                placeholder="https://…"
                onBlur={(e) => updateItem({ pageId, itemId: item.id, imageUrl: e.target.value })}
              />
            </Field>
            <Field label={i18.link}>
              <Input
                defaultValue={item.linkUrl ?? ""}
                key={item.id + "-link"}
                placeholder="https://…"
                onBlur={(e) => updateItem({ pageId, itemId: item.id, linkUrl: e.target.value })}
              />
            </Field>
            <Field label={i18.date}>
              <Input
                defaultValue={item.date ?? ""}
                key={item.id + "-date"}
                placeholder={i18.datePh}
                onBlur={(e) => updateItem({ pageId, itemId: item.id, date: e.target.value })}
              />
            </Field>
            <Field label={i18.status}>
              <Input
                defaultValue={item.status ?? ""}
                key={item.id + "-status"}
                placeholder={i18.statusPh}
                onBlur={(e) => updateItem({ pageId, itemId: item.id, status: e.target.value })}
              />
            </Field>
          </div>
          <Field label={i18.tags}>
            <Input
              defaultValue={(item.tags ?? []).join(", ")}
              key={item.id + "-tags"}
              placeholder={i18.tagsPh}
              onBlur={(e) => updateItem({ pageId, itemId: item.id, tags: splitTags(e.target.value) })}
            />
          </Field>
        </div>
      )}
    </div>
  );
}

/* ================= Small helpers ================= */
function GlassSection({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-3xl p-6 sm:p-7">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
