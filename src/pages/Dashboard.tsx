import { Atmosphere } from "@/components/Atmosphere";
import { ElioMark } from "@/components/ElioMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { ACCENTS, PACKS, SECTION_KINDS, splitTags, profileUrl } from "@/lib/elio";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  FolderGit2,
  Globe,
  Images,
  Lightbulb,
  Loader2,
  Lock,
  LogOut,
  Plus,
  Sparkles,
  Tag,
  Briefcase,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { QrShowcase } from "@/components/QrShowcase";

type Page = Doc<"elioPages">;
type Item = Page["items"][number];

const KIND_ICON: Record<string, typeof FolderGit2> = {
  project: FolderGit2,
  portfolio: Images,
  idea: Lightbulb,
  service: Briefcase,
  price: Tag,
};

export default function Dashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const page = useQuery(api.pages.getMyPage);

  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/40 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <ElioMark className="size-6" />
            <span className="font-display text-lg font-semibold tracking-tight">Elio</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => navigate("/services")}>
              Services
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
              <LogOut className="size-4" /> Sign out
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

/* ================= Onboarding: claim your username ================= */
function Onboarding() {
  const { user } = useAuth();
  const suggested = (user?.name ?? user?.email?.split("@")[0] ?? "you")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24) || "you";
  const [username, setUsername] = useState(suggested);
  const [displayName, setDisplayName] = useState(user?.name ?? "");
  const [creating, setCreating] = useState(false);
  const checkUsername = useQuery(api.pages.checkUsername, {
    username: username.trim().length >= 3 ? username.trim() : "***",
  });
  const createPage = useMutation(api.pages.createPage);
  const available =
    username.trim().length >= 3 && checkUsername ? checkUsername.available : null;

  const create = async () => {
    setCreating(true);
    try {
      await createPage({ username, displayName: displayName || username });
      toast.success("Your Elio is ready ✨");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create your page");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg py-10">
      <div className="glass-strong rounded-3xl p-8">
        <div className="flex items-center gap-3">
          <ElioMark className="size-9" />
          <h1 className="font-display text-2xl font-bold tracking-tight">Claim your space</h1>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          One person. One page. One identity. Choose your username — it becomes your
          personal link and your QR code.
        </p>

        <div className="mt-7 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex items-center gap-0 rounded-xl border border-input bg-white/[0.03] focus-within:ring-2 focus-within:ring-ring/40">
              <span className="border-r border-input px-3 py-2.5 font-mono text-sm text-muted-foreground">
                elio.aethel.io/
              </span>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="emmanuel"
          />
            </div>
            {available === true && (
              <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Check className="size-3.5" /> {username} is available
              </p>
            )}
            {available === false && (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <X className="size-3.5" /> {username} is taken or invalid
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Your name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Emmanuel Lukungu"
            />
          </div>

          <Button className="btn-glow w-full rounded-2xl" onClick={create} disabled={creating || available === false}>
            {creating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Create my Elio
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ================= Main editor ================= */
function Editor({ page }: { page: Page }) {
  const updatePage = useMutation(api.pages.updatePage);
  const addItem = useMutation(api.pages.addItem);
  const removeItem = useMutation(api.pages.removeItem);
  const [saving, setSaving] = useState(false);

  const save = async (patch: Partial<Page>) => {
    setSaving(true);
    try {
      await updatePage({ pageId: page._id, ...patch });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Left: editors */}
      <div className="space-y-6">
        {/* Profile section */}
        <GlassSection
          title="Profile"
          desc="Your introduction — who you are and what you do."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input defaultValue={page.displayName} onBlur={(e) => save({ displayName: e.target.value })} />
            </Field>
            <Field label="Location">
              <Input defaultValue={page.location ?? ""} onBlur={(e) => save({ location: e.target.value })} />
            </Field>
          </div>
          <Field label="Headline">
            <Input
              defaultValue={page.headline ?? ""}
              placeholder="Developer • Designer • Creator"
              onBlur={(e) => save({ headline: e.target.value })}
            />
          </Field>
          <Field label="Short bio">
            <Textarea
              defaultValue={page.bio ?? ""}
              placeholder="One or two sentences about you."
              rows={2}
              onBlur={(e) => save({ bio: e.target.value })}
            />
          </Field>
          <Field label="Story">
            <Textarea
              defaultValue={page.story ?? ""}
              placeholder="Who you are, where you come from, what you're building…"
              rows={4}
              onBlur={(e) => save({ story: e.target.value })}
            />
          </Field>

          {/* Contact */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <Input
                defaultValue={page.email ?? ""}
                placeholder="you@example.com"
                onBlur={(e) => save({ email: e.target.value })}
              />
            </Field>
            <Field label="WhatsApp">
              <Input
                defaultValue={page.whatsapp ?? ""}
                placeholder="+243 000 000 000"
                onBlur={(e) => save({ whatsapp: e.target.value })}
              />
            </Field>
            <Field label="Instagram">
              <Input
                defaultValue={page.instagram ?? ""}
                placeholder="@yourhandle"
                onBlur={(e) => save({ instagram: e.target.value })}
              />
            </Field>
            <Field label="LinkedIn">
              <Input
                defaultValue={page.linkedin ?? ""}
                placeholder="your-name"
                onBlur={(e) => save({ linkedin: e.target.value })}
              />
            </Field>
          </div>

          {/* Accent */}
          <Field label="Accent color">
            <div className="flex gap-2">
              {/* accent swatches */}
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
                  aria-label={`Accent ${c}`}
                />
              ))}
            </div>
          </Field>
        </GlassSection>

        {/* Items */}
        <GlassSection
          title="Your content"
          desc="Projects, portfolio, ideas, services and prices."
        >
          <div className="flex flex-wrap gap-2">
            {SECTION_KINDS.map((k) => (
              <Button
                key={k.kind}
                size="sm"
                variant="outline"
                className="rounded-xl border-border/70 bg-white/[0.03]"
                onClick={() => addItem({ pageId: page._id, kind: k.kind, title: `New ${k.label.toLowerCase()}` })}
              >
                <Plus className="size-4" /> {k.label}
              </Button>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {page.items.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
                Nothing here yet. Add your first project, idea or service above.
              </p>
            )}
            {page.items.map((it) => (
              <ItemCard key={it.id} item={it} pageId={page._id} />
            ))}
          </div>
        </GlassSection>
      </div>

      {/* Right: preview + actions */}
      <div className="space-y-5">
        <div className="glass-strong sticky top-24 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Your link
            </h3>
            {saving && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          </div>
          <a
            href={profileUrl(page.username)}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-white/[0.03] px-3 py-2.5 font-mono text-sm transition-colors hover:bg-white/[0.06]"
          >
            <span className="truncate">elio.aethel.io/{page.username}</span>
            <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
          </a>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-border/60 bg-white/[0.03] px-3 py-2.5">
            <span className="text-sm text-muted-foreground">
              {page.isPublished ? "Published" : "Draft — only you can see it"}
            </span>
            <Button
              size="sm"
              variant={page.isPublished ? "secondary" : "default"}
              className="rounded-lg"
              onClick={() => save({ isPublished: !page.isPublished })}
            >
              {page.isPublished ? (
                <>
                  <EyeOff className="size-3.5" /> Unpublish
                </>
              ) : (
                <>
                  <Eye className="size-3.5" /> Publish
                </>
              )}
            </Button>
          </div>

          <div className="mt-5">
            <QrShowcase username={page.username} />
          </div>

          <div className="mt-5 rounded-2xl border border-ember/25 bg-ember/[0.06] p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-ember" />
              Want a pro page?
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Our team can design your Elio for you — copy, layout and NFC card.
            </p>
            <Button size="sm" variant="outline" className="mt-3 w-full rounded-xl" asChild>
              <Link to="/services">
                Order a custom page <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Item editor card ================= */
function ItemCard({ item, pageId }: { item: Item; pageId: Page["_id"] }) {
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
          <p className="truncate text-sm font-medium">{item.title || "Untitled"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {item.description || item.kind}
          </p>
        </button>
        <Badge variant="secondary" className="shrink-0 rounded-lg bg-white/[0.05] text-[10px] uppercase tracking-wide">
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
          <Field label="Title">
            <Input
              defaultValue={item.title}
              key={item.id + "-title"}
              onBlur={(e) => updateItem({ pageId, itemId: item.id, title: e.target.value })}
            />
          </Field>
          <Field label="Description">
            <Textarea
              defaultValue={item.description ?? ""}
              key={item.id + "-desc"}
              rows={2}
              onBlur={(e) => updateItem({ pageId, itemId: item.id, description: e.target.value })}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Image URL">
              <Input
                defaultValue={item.imageUrl ?? ""}
                key={item.id + "-img"}
                placeholder="https://…"
                onBlur={(e) => updateItem({ pageId, itemId: item.id, imageUrl: e.target.value })}
              />
            </Field>
            <Field label="Link URL">
              <Input
                defaultValue={item.linkUrl ?? ""}
                key={item.id + "-link"}
                placeholder="https://…"
                onBlur={(e) => updateItem({ pageId, itemId: item.id, linkUrl: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Tags (comma separated)">
            <Input
              defaultValue={(item.tags ?? []).join(", ")}
              key={item.id + "-tags"}
              placeholder="Design, SaaS, 2026"
              onBlur={(e) => updateItem({ pageId, itemId: item.id, tags: splitTags(e.target.value) })}
            />
          </Field>
        </div>
      )}
    </div>
  );
}

/* ================= Small helpers ================= */
function GlassSection({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
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
