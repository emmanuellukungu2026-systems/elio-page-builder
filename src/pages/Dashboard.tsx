import { Atmosphere } from "@/components/Atmosphere";
import { CardFit, IndependentCard, ShowcaseCards, StandardCard } from "@/components/CardOrdering";
import { AethelMark } from "@/components/AethelMark";
import { ElioMark } from "@/components/ElioMark";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { CONCIERGE_WHATSAPP, waLink } from "@/lib/elio";
import { useI18n } from "@/lib/i18n";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Instagram,
  Layers,
  Linkedin,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  PenLine,
  Radio,
  Send,
  Store,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

/** The NFC card model chosen at order time (fallback: Standard). */
type CardTier = "standard" | "pro" | "independent";

/**
 * The client portal — "My page". Clients never build pages themselves; the
 * Elio team does that from the owner console. Once the page exists, this
 * dashboard shows the business info, a live preview of the page, and a direct
 * "ask for a modification" line into the team's studio.
 */
export default function Dashboard() {
  const { signOut } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const c = t.dashboard.client;
  const card = t.dashboard.card;
  const mp = t.dashboard.mypage;
  const page = useQuery(api.pages.getMyPage);
  const orders = useQuery(api.orders.myOrders);

  const [modText, setModText] = useState("");
  const [modSending, setModSending] = useState(false);
  const [modSent, setModSent] = useState(false);
  const sendModification = useMutation(api.orders.createOrder);

  const latestOrder = orders?.[0];
  // Tier from the most recent order that carried one; Standard is the default.
  const chosenTier = orders?.find((o) => o.cardTier != null)?.cardTier;
  const cardTier: CardTier =
    chosenTier === "pro" || chosenTier === "independent" ? chosenTier : "standard";

  const trackHref = waLink(
    CONCIERGE_WHATSAPP,
    "Hello Elio team — I'd like an update on my page order.",
  );

  const submitModification = async () => {
    const message = modText.trim();
    if (message.length < 5) {
      toast.error(mp.required);
      return;
    }
    setModSending(true);
    try {
      await sendModification({
        pack: "page-modification",
        name: page?.displayName ?? "-",
        email: page?.email ?? "-",
        details: [
          `Modification request — /u/${page?.username ?? "?"}`,
          "",
          message.slice(0, 2000),
        ].join("\n"),
      });
      setModSent(true);
      setModText("");
    } catch {
      toast.error("Could not reach the studio — please try again.");
    } finally {
      setModSending(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/40 backdrop-blur-xl pt-safe">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <ElioMark className="size-6 shrink-0" />
            <span className="min-w-0 truncate font-display text-lg font-semibold tracking-tight">
              Elio <span className="text-muted-foreground">Pages</span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => navigate("/directory")}>
              {t.nav.directory}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              aria-label={t.nav.signIn}
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        {/* ============ PAGE EXISTS — the "My page" workspace ============ */}
        {page !== undefined && page !== null && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="max-w-2xl">
                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  {mp.title}
                </h1>
                <p className="mt-3 leading-7 text-muted-foreground">{mp.sub}</p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  page.isPublished
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400",
                )}
              >
                {page.isPublished ? t.nav.myElio : t.admin.draft}
              </span>
            </div>

            {/* Preview + business info */}
            <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Live preview — a mini render of their actual page */}
              <Link
                to={`/u/${page.username}`}
                className="glass group relative block overflow-hidden rounded-3xl transition-all hover:-translate-y-0.5"
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `radial-gradient(120% 90% at 20% 0%, ${page.accent ?? "#1e4fd8"}40, transparent 60%)`,
                  }}
                  aria-hidden="true"
                />
                <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                  {mp.open} <ArrowUpRight className="size-3" />
                </span>
                <div className="relative flex flex-col items-center px-6 pb-6 pt-10 text-center">
                  {page.logoUrl ? (
                    <img
                      src={page.logoUrl}
                      alt={page.displayName}
                      className="size-16 rounded-full object-cover ring-2 ring-white/30"
                    />
                  ) : (
                    <span
                      className="flex size-16 items-center justify-center rounded-full font-display text-lg font-bold text-white"
                      style={{ background: page.accent ?? "#1e4fd8" }}
                    >
                      {page.displayName.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <h2 className="mt-3 font-display text-xl font-bold tracking-tight text-white">
                    {page.displayName}
                  </h2>
                  {(page.headline || page.trade) && (
                    <p className="mt-1 text-sm" style={{ color: page.accent ?? "#1e4fd8" }}>
                      {page.headline || page.trade}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    {page.whatsapp && (
                      <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-semibold text-[#111318]">
                        <MessageCircle className="size-3.5" /> WhatsApp
                      </span>
                    )}
                    {page.email && (
                      <span className="flex size-8 items-center justify-center rounded-lg bg-white/15 text-white">
                        <Mail className="size-3.5" />
                      </span>
                    )}
                    {page.instagram && (
                      <span className="flex size-8 items-center justify-center rounded-lg bg-white/15 text-white">
                        <Instagram className="size-3.5" />
                      </span>
                    )}
                    {page.linkedin && (
                      <span className="flex size-8 items-center justify-center rounded-lg bg-white/15 text-white">
                        <Linkedin className="size-3.5" />
                      </span>
                    )}
                  </div>
                  {(page.items ?? []).some((it) => it.imageUrl) && (
                    <div className="mt-5 grid w-full grid-cols-4 gap-1.5">
                      {(page.items ?? [])
                        .filter((it) => !!it.imageUrl)
                        .slice(0, 4)
                        .map((it) => (
                          <img
                            key={it.id}
                            src={it.imageUrl}
                            alt=""
                            loading="lazy"
                            className="aspect-square w-full rounded-lg object-cover ring-1 ring-white/10"
                          />
                        ))}
                    </div>
                  )}
                  <p className="mt-5 font-mono text-[11px] text-white/60">/u/{page.username}</p>
                </div>
              </Link>

              {/* Business information — read-only, maintained by the team */}
              <section className="glass-strong rounded-3xl p-6 sm:p-7">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-ember/15 text-ember">
                    <Store className="size-4" />
                  </span>
                  <h2 className="font-display text-base font-semibold">{mp.infoTitle}</h2>
                </div>
                <div className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {[
                    { icon: Store, label: t.dashboard.sections.businessName, value: page.displayName },
                    { icon: PenLine, label: t.dashboard.sections.trade, value: page.trade },
                    { icon: MapPin, label: t.dashboard.sections.location, value: page.location },
                    { icon: CalendarDays, label: t.dashboard.sections.since, value: page.since },
                    { icon: Mail, label: t.dashboard.sections.email, value: page.email },
                    { icon: MessageCircle, label: t.dashboard.sections.whatsapp, value: page.whatsapp },
                    { icon: Instagram, label: t.dashboard.sections.instagram, value: page.instagram },
                    { icon: Linkedin, label: t.dashboard.sections.linkedin, value: page.linkedin },
                  ]
                    .filter((f) => !!f.value)
                    .map((f) => (
                      <div key={f.label} className="flex items-start gap-2.5">
                        <f.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                            {f.label}
                          </p>
                          <p className="truncate text-sm font-medium">{f.value}</p>
                        </div>
                      </div>
                    ))}
                  {(page.headline || page.bio) && (
                    <div className="flex items-start gap-2.5 sm:col-span-2">
                      <PenLine className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          {page.headline ? t.dashboard.sections.headline : t.dashboard.sections.bio}
                        </p>
                        <p className="text-sm leading-6">{page.headline || page.bio}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1 text-xs text-muted-foreground">
                    <Layers className="size-3.5" /> {(page.items ?? []).length} {mp.items}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1 text-xs text-muted-foreground">
                    <Palette className="size-3.5" /> {mp.template}:{" "}
                    {(page.template ?? "pro") === "standard"
                      ? t.admin.templateStandard
                      : page.template === "cover"
                        ? t.admin.templateCover
                        : t.admin.templatePro}
                  </span>
                </div>
              </section>
            </div>

            {/* Your NFC card — the exact model chosen during the order */}
            {latestOrder && (
              <section className="glass mt-4 overflow-hidden rounded-3xl">
                <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
                  <div className="relative flex shrink-0 justify-center">
                    <div className="absolute inset-0 rounded-full bg-ember/10 blur-3xl" aria-hidden="true" />
                    <CardFit
                      tier={cardTier}
                      height={168}
                      className="relative overflow-hidden rounded-2xl bg-black/[0.05] p-3 dark:bg-white/[0.06]"
                    >
                      {cardTier === "pro" ? (
                        <ShowcaseCards
                          accent="#c0854f"
                          name={page.displayName}
                          role={t.hero.cardRole}
                          phone="+243 990 000 000"
                          email="bonjour@studiokivu.cd"
                          mark={<AethelMark className="size-8 rounded-md bg-white/95 p-0.5" />}
                        />
                      ) : cardTier === "independent" ? (
                        <IndependentCard
                          company="Nova Design"
                          person={page.displayName.toUpperCase()}
                          role={t.hero.cardRole}
                        />
                      ) : (
                        <StandardCard businessName={page.displayName} businessLogo={photos.portraits} />
                      )}
                    </CardFit>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">
                      {card.kicker}
                    </p>
                    <h2 className="mt-1.5 font-display text-xl font-bold tracking-tight sm:text-2xl">
                      {card.title}
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                      {card.tierLabel}:{" "}
                      <span className="font-medium text-foreground">{card[cardTier]}</span>
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{card.text}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Ask for a page modification — lands in the team's studio */}
            <section className="glass-strong mt-4 rounded-3xl p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ember/15 text-ember">
                  <PenLine className="size-5" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold sm:text-xl">{mp.modTitle}</h2>
                  <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {mp.modText}
                  </p>
                </div>
              </div>

              {modSent ? (
                <div className="mt-6 flex flex-col items-center py-4 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15">
                    <CheckCircle2 className="size-7 text-emerald-500" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{mp.modSentTitle}</h3>
                  <p className="mt-1.5 max-w-md text-sm leading-6 text-muted-foreground">
                    {mp.modSentText}
                  </p>
                  <Button variant="ghost" className="mt-4 rounded-xl" onClick={() => setModSent(false)}>
                    {mp.modAgain}
                  </Button>
                </div>
              ) : (
                <div className="mt-5">
                  <Textarea
                    value={modText}
                    onChange={(e) => setModText(e.target.value)}
                    placeholder={mp.modPh}
                    rows={4}
                    className="min-h-24"
                  />
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-xs text-muted-foreground">
                      /u/{page.username} · {t.admin.teamBadge}
                    </p>
                    <Button
                      onClick={submitModification}
                      disabled={modSending}
                      className="btn-glow h-11 rounded-2xl px-6"
                    >
                      {modSending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                      {modSending ? mp.modSending : mp.modSubmit}
                    </Button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* ============ NO PAGE YET — order + follow the build ============ */}
        {page === null && (
          <>
            <div className="max-w-2xl">
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {c.title}
              </h1>
              <p className="mt-3 leading-7 text-muted-foreground">{c.sub}</p>
            </div>

            {/* Your NFC card — the exact model chosen during the order */}
            {latestOrder && (
              <section className="glass mt-8 overflow-hidden rounded-3xl">
                <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
                  <div className="relative flex shrink-0 justify-center">
                    <div className="absolute inset-0 rounded-full bg-ember/10 blur-3xl" aria-hidden="true" />
                    <CardFit
                      tier={cardTier}
                      height={168}
                      className="relative overflow-hidden rounded-2xl bg-black/[0.05] p-3 dark:bg-white/[0.06]"
                    >
                      {cardTier === "pro" ? (
                        <ShowcaseCards
                          accent="#c0854f"
                          name={latestOrder.name}
                          role={t.hero.cardRole}
                          phone="+243 990 000 000"
                          email="bonjour@studiokivu.cd"
                          mark={<AethelMark className="size-8 rounded-md bg-white/95 p-0.5" />}
                        />
                      ) : cardTier === "independent" ? (
                        <IndependentCard
                          company="Nova Design"
                          person={latestOrder.name.toUpperCase()}
                          role={t.hero.cardRole}
                        />
                      ) : (
                        <StandardCard businessName={latestOrder.name} businessLogo={photos.portraits} />
                      )}
                    </CardFit>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">
                      {card.kicker}
                    </p>
                    <h2 className="mt-1.5 font-display text-xl font-bold tracking-tight sm:text-2xl">
                      {card.title}
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                      {card.tierLabel}:{" "}
                      <span className="font-medium text-foreground">{card[cardTier]}</span>
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{card.text}</p>
                  </div>
                </div>
              </section>
            )}

            {/* The two moves a client can make */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link
                to="/services"
                className="glass-strong group flex flex-col rounded-3xl p-7 transition-all hover:-translate-y-0.5"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-ember/15 text-ember">
                  <Send className="size-5" />
                </span>
                <h2 className="mt-5 font-display text-lg font-semibold">{c.cta}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{c.step1Text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ember">
                  {t.nav.services}{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>

              <a
                href={trackHref}
                target="_blank"
                rel="noreferrer"
                className="glass group flex flex-col rounded-3xl p-7 transition-all hover:-translate-y-0.5"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
                  <MessageCircle className="size-5" />
                </span>
                <h2 className="mt-5 font-display text-lg font-semibold">{c.trackTitle}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{c.trackText}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-500">
                  {c.trackCta}{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </div>

            {/* What happens next */}
            <section className="mt-12">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {c.stepsTitle}
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {[
                  { icon: Send, title: c.step1, text: c.step1Text },
                  { icon: PenLine, title: c.step2, text: c.step2Text },
                  { icon: Radio, title: c.step3, text: c.step3Text },
                ].map((s, i) => (
                  <div key={s.title} className="glass rounded-3xl p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.05]">
                        <s.icon className="size-4 text-muted-foreground" />
                      </span>
                      <span className="font-display text-sm font-semibold text-ember">0{i + 1}</span>
                    </div>
                    <h3 className="mt-4 font-display font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{s.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {page === undefined && (
          <div className="mt-10 flex justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </main>
    </div>
  );
}
