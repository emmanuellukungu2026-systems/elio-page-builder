import { Atmosphere } from "@/components/Atmosphere";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye, Images, Search, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

type FeedPage = NonNullable<
  ReturnType<typeof useQuery<typeof api.pages.listPublishedPages>>
>[number];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Feed() {
  const { t, lang } = useI18n();
  const f = t.feed;
  const raw = useQuery(api.pages.listPublishedPages);
  const myPage = useQuery(api.pages.getMyPage);
  const pages: FeedPage[] = useMemo(() => raw ?? [], [raw]);
  const [query, setQuery] = useState("");
  const [trade, setTrade] = useState("");

  const locale = lang === "fr" ? "fr-FR" : lang === "tr" ? "tr-TR" : "en-US";
  const formatDate = (ts: number | null) =>
    ts
      ? new Date(ts).toLocaleDateString(locale, { day: "numeric", month: "short" })
      : null;

  const trades = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of pages) if (p.trade) counts.set(p.trade, (counts.get(p.trade) ?? 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 6)
      .map(([name]) => name);
  }, [pages]);

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...pages]
      .sort((a, b) => (b.updatedAt ?? b.publishedAt ?? 0) - (a.updatedAt ?? a.publishedAt ?? 0))
      .filter((p) => {
        if (trade && p.trade !== trade) return false;
        if (!q) return true;
        return [p.displayName, p.trade, p.location, p.headline, p.bio, p.latestItem?.title]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(q));
      });
  }, [pages, query, trade]);

  return (
    <div className="center-mobile relative min-h-screen">
      <Atmosphere />
      <Nav />

      <main id="main" className="mx-auto max-w-6xl px-4 pt-32 pb-24 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">{f.kicker}</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {f.title}
          </h1>
          <p className="mt-4 leading-7 text-muted-foreground">{f.sub}</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_296px]">
          <section>
            {/* Search + trade filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={f.searchPh}
                  aria-label={f.searchPh}
                  type="search"
                  className="rounded-xl pl-9 text-left"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setTrade("")}
                  aria-pressed={trade === ""}
                  className={
                    trade === ""
                      ? "rounded-full bg-ember px-3 py-1.5 text-xs font-medium text-primary-foreground"
                      : "rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  }
                >
                  {f.all}
                </button>
                {trades.map((name) => (
                  <button
                    key={name}
                    onClick={() => setTrade(trade === name ? "" : name)}
                    aria-pressed={trade === name}
                    className={
                      trade === name
                        ? "rounded-full bg-ember px-3 py-1.5 text-xs font-medium text-primary-foreground"
                        : "rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    }
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {pages.length === 0 ? (
              <div className="glass mt-8 flex flex-col items-center rounded-2xl p-14 text-center">
                <Store className="size-10 text-muted-foreground" />
                <p className="mt-4 max-w-sm text-sm text-muted-foreground">{f.emptyText}</p>
                <Button className="btn-glow mt-6 rounded-xl" asChild>
                  <Link to="/dashboard">{f.emptyCta}</Link>
                </Button>
              </div>
            ) : posts.length === 0 ? (
              <div className="glass mt-8 flex flex-col items-center rounded-2xl p-14 text-center">
                <Search className="size-10 text-muted-foreground" />
                <p className="mt-4 max-w-sm text-sm text-muted-foreground">{f.noResults}</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setTrade("");
                  }}
                  className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {f.clear}
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {posts.map((p, i) => {
                  const latest = p.latestItem;
                  const stamp = formatDate(p.updatedAt ?? p.publishedAt);
                  return (
                    <motion.article
                      key={p.username}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                      className="glass overflow-hidden rounded-2xl"
                    >
                      {/* Business header */}
                      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                        <Link
                          to={`/u/${p.username}`}
                          className="size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-background"
                          style={{ background: `${p.accent ?? "#1e4fd8"}22` }}
                        >
                          {p.logoUrl ? (
                            <img src={p.logoUrl} alt="" className="size-full object-cover" />
                          ) : (
                            <span
                              className="flex size-full items-center justify-center text-sm font-semibold"
                              style={{ color: p.accent ?? "#1e4fd8" }}
                            >
                              {initials(p.displayName)}
                            </span>
                          )}
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/u/${p.username}`}
                            className="flex items-center gap-2 font-display text-base font-semibold hover:underline"
                          >
                            <span className="truncate">{p.displayName}</span>
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ember/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ember">
                              <span className="size-1.5 rounded-full bg-ember" />
                              {f.live}
                            </span>
                          </Link>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {[p.trade, p.location].filter(Boolean).join(" · ") || `@${p.username}`}
                          </p>
                        </div>
                        {stamp && (
                          <span className="shrink-0 text-xs text-muted-foreground">{stamp}</span>
                        )}
                      </div>

                      {/* Latest work */}
                      {latest?.imageUrl && (
                        <Link to={`/u/${p.username}/i/${latest.id}`} className="block">
                          <img
                            src={latest.imageUrl}
                            alt=""
                            loading="lazy"
                            className="aspect-[16/10] w-full object-cover"
                          />
                        </Link>
                      )}

                      <div className="px-4 py-4 sm:px-5">
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          {latest ? f.latest : f.joined}
                          {latest?.date ? ` · ${latest.date}` : ""}
                        </p>
                        {latest ? (
                          <>
                            <Link
                              to={`/u/${p.username}/i/${latest.id}`}
                              className="mt-2 block font-display text-lg font-semibold leading-snug hover:underline"
                            >
                              {latest.title}
                            </Link>
                            {latest.description && (
                              <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-muted-foreground">
                                {latest.description}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="mt-2 font-display text-lg font-semibold leading-snug">
                              {p.displayName}
                            </p>
                            <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-muted-foreground">
                              {p.headline || p.bio || f.noItems}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Counters + link */}
                      <div className="flex items-center justify-between gap-3 border-t border-border/50 px-4 py-2.5 sm:px-5">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Images className="size-3.5" />
                            {p.itemCount} {p.itemCount === 1 ? f.item : f.items}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Eye className="size-3.5" />
                            {p.viewCount} {f.views}
                          </span>
                        </div>
                        <Link
                          to={`/u/${p.username}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          {f.seePage}
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Side rail */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {myPage ? (
              <div className="glass overflow-hidden rounded-2xl">
                <div
                  className="h-16"
                  style={{
                    background: `linear-gradient(135deg, ${myPage.accent ?? "#1e4fd8"}55, transparent 75%)`,
                  }}
                />
                <div className="px-4 pb-4">
                  <div className="-mt-6 flex items-end gap-3">
                    <div className="size-12 overflow-hidden rounded-full bg-background ring-2 ring-background">
                      {myPage.logoUrl ? (
                        <img src={myPage.logoUrl} alt="" className="size-full object-cover" />
                      ) : (
                        <span
                          className="flex size-full items-center justify-center text-sm font-semibold"
                          style={{ color: myPage.accent ?? "#1e4fd8" }}
                        >
                          {initials(myPage.displayName)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {f.yourPage}
                  </p>
                  <p className="mt-1 truncate font-display text-base font-semibold">
                    {myPage.displayName}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{f.yourPageText}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <Button size="sm" className="rounded-lg" asChild>
                      <Link to="/dashboard">{f.manage}</Link>
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-lg" asChild>
                      <Link to={`/u/${myPage.username}`}>{f.seePage}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-4">
                <p className="font-display text-base font-semibold">{f.emptyCta}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{f.yourPageText}</p>
                <Button size="sm" className="mt-3 w-full rounded-lg" asChild>
                  <Link to="/dashboard">{f.emptyCta}</Link>
                </Button>
              </div>
            )}

            <div className="glass rounded-2xl p-4">
              <p className="font-display text-base font-semibold">{f.directory}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{f.directoryText}</p>
              <Link
                to="/directory"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {t.nav.directory}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
