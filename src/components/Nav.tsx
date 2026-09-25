import logo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangSwitcher } from "@/components/LangSwitcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { OWNER_EMAILS } from "@/lib/elio";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Hash, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Solid top bar — always opaque, slightly denser once scrolling. */
export function Nav() {
  const { t } = useI18n();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, user, signOut } = useAuth();
  const navigate = useNavigate();
  const isOwner =
    isAuthenticated && !!user?.email && OWNER_EMAILS.includes(user.email.trim().toLowerCase());

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  const links = [
    { label: t.nav.features, href: "/#features" },
    { label: t.nav.directory, href: "/directory" },
    { label: t.nav.services, href: "/services" },
    { label: t.nav.faq, href: "/#faq" },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 0.6, 0.35, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div
        className={cn(
          "glass mx-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-5 lg:mx-auto",
          scrolled && "glass-strong",
        )}
      >
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Elio Pages">
          <img
            src={logo}
            alt="Elio Pages"
            className="size-8 rounded-md transition-transform duration-300 group-hover:scale-110"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitcher />
          <ThemeToggle />

          {isLoading ? null : isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    title={user?.email}
                    className="hidden max-w-[13rem] items-center gap-2 rounded-xl border border-border/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline-flex"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-[10px] font-bold text-primary">
                      {(user?.email ?? "?").slice(0, 1).toUpperCase()}
                    </span>
                    <span className="truncate">{user?.email ?? user?.loginId}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-44 rounded-xl border-border/60">
                  <div className="px-2 py-1.5">
                    <p className="truncate text-xs text-muted-foreground">{user?.email ?? "—"}</p>
                    {user?.loginId && (
                      <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
                        <Hash className="size-3 text-primary" /> {user.loginId}
                      </p>
                    )}
                  </div>
                  <div className="mx-2 border-t border-border/60" />
                  <DropdownMenuItem
                    className="cursor-pointer gap-2"
                    onClick={async () => {
                      await signOut();
                      navigate("/");
                    }}
                  >
                    <LogOut className="size-4" /> {t.nav.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" className="btn-glow rounded-xl" onClick={() => navigate("/dashboard")}>
                {t.nav.myElio}
              </Button>
              {isOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  className="hidden rounded-xl border-border/70 sm:inline-flex"
                  onClick={() => navigate("/admin")}
                >
                  Studio
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="hidden rounded-xl sm:inline-flex"
                onClick={() => navigate("/auth?returnTo=%2Fdashboard")}
              >
                {t.nav.signIn}
              </Button>
              <Button
                size="sm"
                className="btn-glow hidden rounded-xl sm:inline-flex"
                onClick={() => navigate("/auth?returnTo=%2Fdashboard")}
              >
                {t.nav.create}
              </Button>
            </>
          )}

          <button
            className="ml-1 inline-flex rounded-lg p-2 text-muted-foreground hover:bg-accent md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="glass absolute inset-x-3 top-full mt-2 rounded-2xl p-3 md:hidden">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            {isOwner && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin");
                }}
                className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Studio
              </button>
            )}
            {!isAuthenticated && (
              <button
                onClick={() => navigate("/auth?returnTo=%2Fdashboard")}
                className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {t.nav.signIn}
              </button>
            )}
            {isAuthenticated && (
              <div className="rounded-xl border border-border/60 bg-white/[0.03] px-3 py-2">
                {user?.email && <p className="truncate text-xs font-medium text-foreground">{user.email}</p>}
                {user?.loginId && (
                  <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
                    <Hash className="size-3 text-primary" /> {user.loginId}
                  </p>
                )}
                <button
                  onClick={async () => {
                    setMenuOpen(false);
                    await signOut();
                    navigate("/");
                  }}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LogOut className="size-3" /> {t.nav.signOut}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.header>
  );
}
