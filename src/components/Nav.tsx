import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Services", href: "/services" },
  { label: "FAQ", href: "/#faq" },
];

/** Glass top bar: transparent at top, denser glass once scrolling. */
export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

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
          <img src={logo} alt="Elio" className="size-7 transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            Elio
          </span>
          <span className="hidden rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:inline-block">
            Aethel
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
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
          {!isLoading && isAuthenticated ? (
            <>
              <Button size="sm" className="rounded-xl btn-glow" onClick={() => navigate("/dashboard")}>
                My Elio
              </Button>
              <Button size="sm" variant="ghost" className="hidden rounded-xl sm:inline-flex" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="hidden rounded-xl sm:inline-flex"
                onClick={() => navigate("/auth?returnTo=%2Fdashboard")}
              >
                Sign in
              </Button>
              <Button size="sm" className="btn-glow rounded-xl" onClick={() => navigate("/auth?returnTo=%2Fdashboard")}>
                Create your Elio
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
          <div className="glass mx-3 mt-2 rounded-2xl p-3 md:hidden">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.header>
  );
}
