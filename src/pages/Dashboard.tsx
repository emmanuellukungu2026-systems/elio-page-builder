import { Atmosphere } from "@/components/Atmosphere";
import { ElioMark } from "@/components/ElioMark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { CONCIERGE_WHATSAPP, waLink } from "@/lib/elio";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "convex/react";
import {
  ArrowRight,
  MessageCircle,
  Loader2,
  LogOut,
  PenLine,
  Radio,
  Send,
  Store,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";

/**
 * The client portal. Clients never build pages themselves — the Elio team does
 * that from the owner console. This page therefore has exactly two jobs:
 * start the order (concierge flow) and follow it (WhatsApp).
 */
export default function Dashboard() {
  const { signOut } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const c = t.dashboard.client;
  const page = useQuery(api.pages.getMyPage);

  const trackHref = waLink(
    CONCIERGE_WHATSAPP,
    "Hello Elio team — I'd like an update on my page order.",
  );

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

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{c.title}</h1>
          <p className="mt-3 leading-7 text-muted-foreground">{c.sub}</p>
        </div>

        {/* If their page already exists (team built it), surface the link immediately. */}
        {page !== undefined && page !== null && (
          <Link
            to={`/u/${page.username}`}
            className="glass group mt-8 flex items-center justify-between gap-4 rounded-3xl p-6 transition-all hover:bg-white/[0.06]"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ember/15 text-ember">
                <Store className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-display font-semibold">{page.displayName}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">/u/{page.username}</p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-ember">
              {page.isPublished ? t.nav.myElio : t.admin.draft}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        )}

        {/* The two moves a client can make */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
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
              {t.nav.services} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
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
              {c.trackCta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
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

        {page === undefined && (
          <div className="mt-10 flex justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </main>
    </div>
  );
}
