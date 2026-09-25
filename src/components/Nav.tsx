import logo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangSwitcher } from "@/components/LangSwitcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { OWNER_EMAILS } from "@/lib/elio";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

/** Glass top bar: transparent at top, denser glass once scrolling. */
export function Nav() {
  const { t } = useI18n();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, user } = useAuth();
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
          "mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-5",
          scrolled ? "glass mx-3 lg:mx-auto" : "bg-transparent",
        )}
      >
        <Link to="/" className="group flex items-center gap-2.5">
          <img
            src={logo}
            alt="Elio Pages"
            className="size-7 rounded-md transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            Elio <span className="text-muted-foreground">Pages</span>
          </span>
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
          </div>
        )}
      </div>
    </motion.header>
  );
}
