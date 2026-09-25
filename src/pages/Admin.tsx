import { Atmosphere } from "@/components/Atmosphere";
import { ElioMark } from "@/components/ElioMark";
import { QrShowcase } from "@/components/QrShowcase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  ACCENTS,
  PAGE_STYLES,
  SECTION_KINDS,
  OWNER_EMAILS,
  profileUrl,
  splitTags,
  waLink,
} from "@/lib/elio";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Check,
  Copy,
  Eye,
  EyeOff,
  FolderGit2,
  Images,
  Inbox,
  Lightbulb,
  Loader2,
  MessageCircle,
  Plus,
  ShieldAlert,
  Store,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

type AdminPage = {
  _id: Id<"elioPages">;
  username: string;
  displayName: string;
  trade?: string;
  headline?: string;
  bio?: string;
  story?: string;
  location?: string;
  since?: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  logoUrl?: string;
  coverUrl?: string;
  accent?: string;
  style?: string;
  isPublished: boolean;
  itemCount: number;
  items: {
    id: string;
    kind: string;
    title: string;
    description?: string;
    imageUrl?: string;
    linkUrl?: string;
    tags?: string[];
    date?: string;
    status?: string;
  }[];
};

type AdminOrder = {
  _id: Id<"serviceOrders">;
  pack: string;
  name: string;
  email: string;
  details: string;
  status?: string;
  _creationTime: number;
};

const KIND_ICON: Record<string, typeof FolderGit2> = {
  project: FolderGit2,
  portfolio: Images,
  idea: Lightbulb,
  service: Briefcase,
  price: Tag,
};

/** /admin — the owner-only studio. Every mutation double-checks the allowlist server-side. */
export default function Admin() {
  const { isLoading, isAuthenticated } = useAuth();
  const me = useQuery(api.admin.me);
  const { t } = useI18n();
  const a = t.admin;
  const { signOut } = useAuth();
  const [selected, setSelected] = useState<Id<"elioPages"> | null>(null);

  if (isLoading || me === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!isAuthenticated || me === null || !me.isOwner) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="glass-strong max-w-md rounded-3xl p-8 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="size-5 text-destructive" />
          </span>
          <h1 className="mt-4 font-display text-xl font-bold">Elio Studio</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This console belongs to the Aethel Technologies team ({OWNER_EMAILS.length} accounts).
            If that's you, sign in with an owner email.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button className="btn-glow rounded-xl" onClick={() => (window.location.href = "/auth?returnTo=%2Fadmin")}>
              Sign in
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl"
              onClick={async () => {
                await signOut();
                window.location.href = "/";
              }}
            >
              Sign out & go home
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/40 backdrop-blur-xl pt-safe">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <ElioMark className="size-6" />
            <span className="font-display text-lg font-semibold tracking-tight">
              Elio <span className="text-muted-foreground">Studio</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-lg bg-ember/10 text-ember">
              {a.badge}
            </Badge>
            <span className="hidden text-xs text-muted-foreground sm:block">{me.email}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        {selected ? (
          <Editor pageId={selected} onBack={() => setSelected(null)} />
        ) : (
          <Console onOpen={setSelected} />
        )}
      </main>
    </div>
  );
}

/* ================= Console: orders + pages list ================= */
function Console({ onOpen }: { onOpen: (id: Id<"elioPages">) => void }) {
  const { t } = useI18n();
  const a = t.admin;
  const pages = useQuery(api.admin.listAllPages);
  const orders = useQuery(api.admin.listOrders);

  // New-page form (also fed by "create from this order")
  const [showNew, setShowNew] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const adminCreatePage = useMutation(api.admin.adminCreatePage);
  const usernameCheck = useQuery(
    api.pages.checkUsername,
    username.trim().length >= 3 ? { username: username.trim() } : "skip",
  );
  const taken = usernameCheck ? usernameCheck.available === false : false;

  const create = async () => {
    if (!username.trim() || !displayName.trim()) return;
    setCreating(true);
    try {
      const id = await adminCreatePage({
        username: username.trim(),
        displayName: displayName.trim(),
        ...(clientEmail.trim() ? { clientEmail: clientEmail.trim() } : {}),
      });
      toast.success(a.save);
      setShowNew(false);
      setUsername("");
      setDisplayName("");
      setClientEmail("");
      onOpen(id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : a.saveError);
    } finally {
      setCreating(false);
    }
  };

  const prefillFromOrder = (o: AdminOrder) => {
    const slug =
      o.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 24) || "client";
    setUsername(slug);
    setDisplayName(o.name);
    setClientEmail(o.email);
    setShowNew(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-10">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{a.title}</h1>
        <p className="mt-3 leading-7 text-muted-foreground">{a.subtitle}</p>
      </div>

      {/* ============ Orders ============ */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Inbox className="size-4 text-ember" /> {a.ordersTitle}
          </h2>
          {orders && orders.length > 0 && (
            <Badge variant="secondary" className="rounded-lg bg-white/[0.06]">
              {orders.length}
            </Badge>
          )}
        </div>

        {orders === undefined || orders === null ? (
          <Loading />
        ) : orders.length === 0 ? (
          <Empty text={a.ordersEmpty} />
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {orders.map((o) => (
              <OrderCard key={o._id} order={o} onCreate={prefillFromOrder} />
            ))}
          </div>
        )}
      </section>

      {/* ============ New page form ============ */}
      {showNew && (
        <section className="glass-strong rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{a.newPage}</h2>
            <Button size="icon-sm" variant="ghost" onClick={() => setShowNew(false)}>
              <X className="size-4" />
            </Button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">{a.username}</Label>
              <div className="flex items-center rounded-xl border border-input bg-white/[0.03] focus-within:ring-2 focus-within:ring-ring/40">
                <span className="border-r border-input px-3 py-2.5 font-mono text-sm text-muted-foreground">/u/</span>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={a.usernamePh}
                  className="rounded-none border-0 bg-transparent focus-visible:ring-0"
                />
              </div>
              {taken && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                  <X className="size-3.5" /> {a.taken}
                </p>
              )}
              {usernameCheck?.available && (
                <p className="flex items-center gap-1.5 text-xs text-emerald-500">
                  <Check className="size-3.5" /> /u/{username}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">{a.businessName}</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={a.businessNamePh} />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              {t.services.form.contact} · email
            </Label>
            <Input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@example.com"
            />
            <p className="text-xs leading-4 text-muted-foreground">
              If this email matches a signed-up client, the page links to their account — it then
              appears in their portal at /dashboard.
            </p>
          </div>
          <Button
            className="btn-glow mt-5 rounded-2xl"
            onClick={create}
            disabled={creating || !username.trim() || !displayName.trim() || taken}
          >
            {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} {a.create}
          </Button>
        </section>
      )}

      {/* ============ Client pages ============ */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Store className="size-4 text-ember" /> {a.pagesTitle}
          </h2>
          <Button size="sm" variant={showNew ? "secondary" : "default"} className="btn-glow rounded-xl" onClick={() => setShowNew(!showNew)}>
            <Plus className="size-4" /> {a.newPage}
          </Button>
        </div>

        {pages === undefined || pages === null ? (
          <Loading />
        ) : pages.length === 0 ? (
          <Empty text={a.pagesEmpty} />
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((p) => (
              <PageCard key={p._id} page={p} onOpen={() => onOpen(p._id)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ================= Order card ================= */
function OrderCard({
  order,
  onCreate,
}: {
  order: AdminOrder;
  onCreate: (o: AdminOrder) => void;
}) {
  const { t } = useI18n();
  const a = t.admin;
  const setOrderStatus = useMutation(api.admin.setOrderStatus);
  const adminDeleteOrder = useMutation(api.admin.adminDeleteOrder);
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);

  const status = order.status ?? "new";
  const statusStyles: Record<string, string> = {
    new: "bg-ember/10 text-ember",
    in_progress: "bg-[#1e4fd8]/10 text-[#1e4fd8]",
    done: "bg-emerald-500/10 text-emerald-500",
  };

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : a.saveError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display font-semibold">{order.name}</p>
          <p className="truncate text-xs text-muted-foreground">{order.email}</p>
        </div>
        <Badge variant="secondary" className={cn("shrink-0 rounded-lg capitalize", statusStyles[status] ?? "")}>
          {status.replace("_", " ")}
        </Badge>
      </div>

      <p className={cn("mt-3 text-sm leading-6 text-foreground/85", !expanded && "line-clamp-3")}>
        {order.details}
      </p>
      <button
        className="mt-1 text-xs text-muted-foreground underline-offset-2 hover:underline"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "—" : "+"}
      </button>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {status === "new" && (
          <Button size="sm" variant="secondary" className="rounded-lg" disabled={busy}
            onClick={() => run(() => setOrderStatus({ orderId: order._id, status: "in_progress" }))}>
            {a.markInProgress}
          </Button>
        )}
        {status === "in_progress" ? (
          <Button size="sm" variant="secondary" className="rounded-lg" disabled={busy}
            onClick={() => run(() => setOrderStatus({ orderId: order._id, status: "done" }))}>
            <Check className="size-3.5" /> {a.markDone}
          </Button>
        ) : status === "done" ? (
          <Button size="sm" variant="ghost" className="rounded-lg" disabled={busy}
            onClick={() => run(() => setOrderStatus({ orderId: order._id, status: "in_progress" }))}>
            {a.reopen}
          </Button>
        ) : null}
        <Button size="sm" variant="outline" className="rounded-lg border-border/70" onClick={() => onCreate(order)}>
          <Plus className="size-3.5" /> {a.createFromOrder}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-lg text-muted-foreground hover:text-destructive"
          disabled={busy}
          onClick={() => {
            if (window.confirm(a.deleteConfirm)) {
              run(() => adminDeleteOrder({ orderId: order._id }));
            }
          }}
        >
          <Trash2 className="size-3.5" /> {a.delete}
        </Button>
      </div>
    </div>
  );
}

/* ================= Page card ================= */
function PageCard({ page, onOpen }: { page: AdminPage; onOpen: () => void }) {
  const { t } = useI18n();
  const a = t.admin;
  const adminUpdatePage = useMutation(api.admin.adminUpdatePage);
  const adminDeletePage = useMutation(api.admin.adminDeletePage);
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : a.saveError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass group rounded-3xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display font-semibold">{page.displayName}</p>
          <p className="truncate font-mono text-xs text-muted-foreground">/u/{page.username}</p>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            "shrink-0 rounded-lg",
            page.isPublished ? "bg-emerald-500/10 text-emerald-500" : "bg-white/[0.06] text-muted-foreground",
          )}
        >
          {page.isPublished ? a.published : a.draft}
        </Badge>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {[page.trade, page.location].filter(Boolean).join(" · ") || "—"} · {page.itemCount} items
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <Button size="sm" className="btn-glow rounded-lg" onClick={onOpen}>
          {a.edit}
        </Button>
        <a href={profileUrl(page.username)} target="_blank" rel="noreferrer">
          <Button size="sm" variant="ghost" className="rounded-lg">
            <ArrowUpRight className="size-3.5" /> {a.view}
          </Button>
        </a>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-lg"
          disabled={busy}
          onClick={() => run(() => adminUpdatePage({ pageId: page._id, isPublished: !page.isPublished }))}
        >
          {page.isPublished ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          {page.isPublished ? a.unpublish : a.publish}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto rounded-lg text-muted-foreground hover:text-destructive"
          disabled={busy}
          onClick={() => {
            if (window.confirm(a.deleteConfirm)) run(() => adminDeletePage({ pageId: page._id }));
          }}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* ================= Editor ================= */
function Editor({ pageId, onBack }: { pageId: Id<"elioPages">; onBack: () => void }) {
  const { t } = useI18n();
  const a = t.admin;
  const s = t.dashboard.sections;
  const i18 = t.dashboard.item;
  const pages = useQuery(api.admin.listAllPages);
  const page = (pages ?? []).find((p) => p._id === pageId) as AdminPage | undefined;
  const adminUpdatePage = useMutation(api.admin.adminUpdatePage);
  const adminAddItem = useMutation(api.admin.adminAddItem);
  const [savedFlash, setSavedFlash] = useState(false);

  const save = async (patch: Record<string, unknown>) => {
    try {
      await adminUpdatePage({ ...(patch as Parameters<typeof adminUpdatePage>[0]), pageId });
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : a.saveError);
    }
  };

  if (pages === undefined || pages === null) return <Loading />;
  if (!page) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" className="rounded-xl" onClick={onBack}>
          <ArrowLeft className="size-4" /> {a.backToList}
        </Button>
        <Empty text={a.pagesEmpty} />
      </div>
    );
  }

  const kindLabel: Record<string, string> = {
    project: s.addProject,
    portfolio: s.addPortfolio,
    idea: s.addIdea,
    service: s.addService,
    price: s.addPrice,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" className="rounded-xl" onClick={onBack}>
          <ArrowLeft className="size-4" /> {a.backToList}
        </Button>
        <span className="text-sm text-muted-foreground">{a.editing}</span>
        <span className="font-display font-semibold">{page.displayName}</span>
        {savedFlash && (
          <span className="flex items-center gap-1 text-xs text-emerald-500">
            <Check className="size-3.5" /> {a.save}
          </span>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        {/* Left: the three studios */}
        <div className="space-y-6">
          <Studio title={a.identity} desc={a.identityDesc}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={s.businessName}>
                <Input defaultValue={page.displayName} key={page._id + "dn"} onBlur={(e) => save({ displayName: e.target.value })} />
              </Field>
              <Field label={s.trade}>
                <Input defaultValue={page.trade ?? ""} key={page._id + "tr"} placeholder={s.tradePh} onBlur={(e) => save({ trade: e.target.value })} />
              </Field>
              <Field label={s.location}>
                <Input defaultValue={page.location ?? ""} key={page._id + "lo"} onBlur={(e) => save({ location: e.target.value })} />
              </Field>
              <Field label={s.since}>
                <Input defaultValue={page.since ?? ""} key={page._id + "si"} placeholder={s.sincePh} onBlur={(e) => save({ since: e.target.value })} />
              </Field>
              <Field label={s.email}>
                <Input type="email" defaultValue={page.email ?? ""} key={page._id + "em"} onBlur={(e) => save({ email: e.target.value })} />
              </Field>
              <Field label={s.whatsapp}>
                <Input type="tel" defaultValue={page.whatsapp ?? ""} key={page._id + "wa"} onBlur={(e) => save({ whatsapp: e.target.value })} />
              </Field>
              <Field label={s.instagram}>
                <Input defaultValue={page.instagram ?? ""} key={page._id + "ig"} onBlur={(e) => save({ instagram: e.target.value })} />
              </Field>
              <Field label={s.linkedin}>
                <Input defaultValue={page.linkedin ?? ""} key={page._id + "li"} onBlur={(e) => save({ linkedin: e.target.value })} />
              </Field>
            </div>
            <Field label={s.headline}>
              <Input defaultValue={page.headline ?? ""} key={page._id + "he"} placeholder={s.headlinePh} onBlur={(e) => save({ headline: e.target.value })} />
            </Field>
            <Field label={s.bio}>
              <Textarea defaultValue={page.bio ?? ""} key={page._id + "bi"} rows={2} placeholder={s.bioPh} onBlur={(e) => save({ bio: e.target.value })} />
            </Field>
            <Field label={s.story}>
              <Textarea defaultValue={page.story ?? ""} key={page._id + "st"} rows={4} placeholder={s.storyPh} onBlur={(e) => save({ story: e.target.value })} />
            </Field>
          </Studio>

          <Studio title={a.look} desc={a.lookDesc}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={s.logo}>
                <Input defaultValue={page.logoUrl ?? ""} key={page._id + "lg"} placeholder={s.logoPh} onBlur={(e) => save({ logoUrl: e.target.value })} />
              </Field>
              <Field label={s.cover}>
                <Input defaultValue={page.coverUrl ?? ""} key={page._id + "cv"} placeholder={s.coverPh} onBlur={(e) => save({ coverUrl: e.target.value })} />
              </Field>
            </div>
            {(page.logoUrl || page.coverUrl) && (
              <div className="grid gap-3 sm:grid-cols-2">
                {page.logoUrl && (
                  <div className="overflow-hidden rounded-2xl border border-border/60">
                    <img src={page.logoUrl} alt="" className="h-24 w-full object-contain" />
                  </div>
                )}
                {page.coverUrl && (
                  <div className="overflow-hidden rounded-2xl border border-border/60">
                    <img src={page.coverUrl} alt="" className="h-24 w-full object-cover" />
                  </div>
                )}
              </div>
            )}
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
                  </button>
                ))}
              </div>
            </Field>
          </Studio>

          <Studio title={a.content} desc={a.contentDesc}>
            <div className="flex flex-wrap gap-2">
              {SECTION_KINDS.map((k) => (
                <Button
                  key={k.kind}
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-border/70 bg-white/[0.03]"
                  onClick={() =>
                    adminAddItem({
                      kind: k.kind,
                      title: `${kindLabel[k.kind] ?? k.label} — ${page.displayName}`,
                      pageId,
                    }).catch((err) => toast.error(err instanceof Error ? err.message : a.saveError))
                  }
                >
                  <Plus className="size-4" /> {kindLabel[k.kind] ?? k.label}
                </Button>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {page.items.length === 0 && <Empty text={s.empty} flat />}
              {page.items.map((it) => (
                <AdminItemCard key={it.id} item={it} pageId={pageId} />
              ))}
            </div>
          </Studio>
        </div>

        {/* Right: publish desk */}
        <div className="space-y-5">
          <div className="glass-strong rounded-3xl p-5 sm:p-6 lg:sticky lg:top-24">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {page.isPublished ? a.published : a.draft}
            </h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{a.sidebarHint}</p>

            <div className="mt-4 flex items-center gap-1.5">
              <a
                href={profileUrl(page.username)}
                target="_blank"
                rel="noreferrer"
                className="mt-0 flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl border border-border/60 bg-white/[0.03] px-3 py-2.5 font-mono text-sm transition-colors hover:bg-white/[0.06]"
              >
                <span className="truncate">/u/{page.username}</span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
              </a>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-xl"
                onClick={() => {
                  navigator.clipboard.writeText(profileUrl(page.username)).then(() => toast.success(a.copied));
                }}
              >
                <Copy className="size-4" />
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-border/60 bg-white/[0.03] px-3 py-2.5">
              <span className="text-sm text-muted-foreground">{page.isPublished ? a.published : a.draft}</span>
              <Button
                size="sm"
                variant={page.isPublished ? "secondary" : "default"}
                className="btn-glow rounded-lg"
                onClick={() => save({ isPublished: !page.isPublished })}
              >
                {page.isPublished ? (
                  <>
                    <EyeOff className="size-3.5" /> {a.unpublish}
                  </>
                ) : (
                  <>
                    <Eye className="size-3.5" /> {a.publish}
                  </>
                )}
              </Button>
            </div>

            {page.whatsapp && (
              <a
                href={waLink(page.whatsapp, `Hello ${page.displayName} — your Elio page is ready for review: ${profileUrl(page.username)}`)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
              >
                <MessageCircle className="size-4" /> {a.openWhatsapp}
              </a>
            )}

            <div className="mt-5">
              <QrShowcase username={page.username} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Item editor ================= */
function AdminItemCard({ item, pageId }: { item: AdminPage["items"][number]; pageId: Id<"elioPages"> }) {
  const { t } = useI18n();
  const i18 = t.dashboard.item;
  const adminUpdateItem = useMutation(api.admin.adminUpdateItem);
  const adminRemoveItem = useMutation(api.admin.adminRemoveItem);
  const [open, setOpen] = useState(false);
  const Icon = KIND_ICON[item.kind] ?? FolderGit2;

  const update = (patch: Record<string, unknown>) =>
    adminUpdateItem({ ...(patch as Parameters<typeof adminUpdateItem>[0]), pageId, itemId: item.id }).catch((err) =>
      toast.error(err instanceof Error ? err.message : t.admin.saveError),
    );

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
        {item.imageUrl && (
          <img src={item.imageUrl} alt="" className="hidden size-9 shrink-0 rounded-lg object-cover sm:block" />
        )}
        <Badge variant="secondary" className="shrink-0 rounded-lg bg-white/[0.05] text-[10px] uppercase tracking-wide">
          {item.kind}
        </Badge>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() =>
            adminRemoveItem({ pageId, itemId: item.id }).catch((err) =>
              toast.error(err instanceof Error ? err.message : t.admin.saveError),
            )
          }
        >
          <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
        </Button>
        <Button size="icon-sm" variant="ghost" onClick={() => setOpen(!open)}>
          {open ? <X className="size-4" /> : <Plus className="size-4 rotate-45" />}
        </Button>
      </div>

      {open && (
        <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
          <Field label={i18.title}>
            <Input defaultValue={item.title} key={item.id + "-t"} placeholder={i18.titlePh} onBlur={(e) => update({ title: e.target.value })} />
          </Field>
          <Field label={i18.description}>
            <Textarea defaultValue={item.description ?? ""} key={item.id + "-d"} rows={3} placeholder={i18.descriptionPh} onBlur={(e) => update({ description: e.target.value })} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={i18.image}>
              <Input defaultValue={item.imageUrl ?? ""} key={item.id + "-i"} placeholder="https://…" onBlur={(e) => update({ imageUrl: e.target.value })} />
            </Field>
            <Field label={i18.link}>
              <Input defaultValue={item.linkUrl ?? ""} key={item.id + "-l"} placeholder="https://…" onBlur={(e) => update({ linkUrl: e.target.value })} />
            </Field>
            <Field label={i18.date}>
              <Input defaultValue={item.date ?? ""} key={item.id + "-dt"} placeholder={i18.datePh} onBlur={(e) => update({ date: e.target.value })} />
            </Field>
            <Field label={i18.status}>
              <Input defaultValue={item.status ?? ""} key={item.id + "-s"} placeholder={i18.statusPh} onBlur={(e) => update({ status: e.target.value })} />
            </Field>
          </div>
          <Field label={i18.tags}>
            <Input defaultValue={(item.tags ?? []).join(", ")} key={item.id + "-tg"} placeholder={i18.tagsPh} onBlur={(e) => update({ tags: splitTags(e.target.value) })} />
          </Field>
        </div>
      )}
    </div>
  );
}

/* ================= Small helpers ================= */
function Studio({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
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

function Loading() {
  return (
    <div className="flex h-32 items-center justify-center">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  );
}

function Empty({ text, flat = false }: { text: string; flat?: boolean }) {
  return (
    <p
      className={cn(
        "mt-5 rounded-2xl border border-dashed border-border/70 text-center text-sm text-muted-foreground",
        flat ? "p-6" : "p-10",
      )}
    >
      {text}
    </p>
  );
}
