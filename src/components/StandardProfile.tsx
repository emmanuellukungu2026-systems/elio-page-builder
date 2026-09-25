import { Atmosphere } from "@/components/Atmosphere";
import { ElioMark } from "@/components/ElioMark";
import type { Doc } from "@/convex/_generated/dataModel";
import { waLink } from "@/lib/elio";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Briefcase,
  ChevronDown,
  FolderGit2,
  Images,
  Instagram,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Tag,
} from "lucide-react";
import { Link } from "react-router";

type Item = Doc<"elioPages">["items"][number];

/** Structural shape — accepts the public page object as returned by Convex. */
type StandardPage = Pick<
  Doc<"elioPages">,
  | "username"
  | "displayName"
  | "items"
  | "logoUrl"
  | "coverUrl"
  | "accent"
  | "bio"
  | "headline"
  | "trade"
  | "location"
  | "whatsapp"
  | "email"
  | "instagram"
  | "linkedin"
>;

const KIND_ICON: Record<string, typeof FolderGit2> = {
  project: FolderGit2,
  portfolio: Images,
  idea: Lightbulb,
  service: Briefcase,
  price: Tag,
};

/**
 * "Standard" template — personal portfolio mobile design (Figma reference):
 * top bar with menu icon, oversized round avatar with accent halo, "Hi, I'm X"
 * greeting, location line, WhatsApp pill CTA, animated scroll chevron, then the
 * catalog grid.
 */
export function StandardProfile({ page }: { page: StandardPage }) {
  const { t } = useI18n();
  const accent = page.accent ?? "#1e4fd8";
  const photoItems = (page.items ?? []).filter((it) => !!it.imageUrl);
  const waMessage = `Hello ${page.displayName} — found you through your Elio page.`;

  const contactIcons = [
    page.whatsapp && {
      key: "wa",
      href: waLink(page.whatsapp, waMessage),
      icon: MessageCircle,
      title: "WhatsApp",
    },
    page.email && { key: "mail", href: `mailto:${page.email}`, icon: Mail, title: page.email },
    page.instagram && {
      key: "ig",
      href: page.instagram.startsWith("http")
        ? page.instagram
        : `https://instagram.com/${page.instagram.replace(/^@/, "")}`,
      icon: Instagram,
      title: "Instagram",
    },
    page.linkedin && {
      key: "li",
      href: page.linkedin.startsWith("http")
        ? page.linkedin
        : `https://linkedin.com/in/${page.linkedin.replace(/^\//, "")}`,
      icon: Linkedin,
      title: "LinkedIn",
    },
  ].filter(Boolean) as { key: string; href: string; icon: typeof Mail; title: string }[];

  return (
    <div className="relative min-h-screen pb-16">
      <Atmosphere />

      <div className="relative mx-auto max-w-md px-4 sm:px-6">
        {/* ===== Top bar: mini logo + name + menu icon, mockup style ===== */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between pt-8"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            {page.logoUrl ? (
              <img
                src={page.logoUrl}
                alt={page.displayName}
                className="size-9 rounded-full object-cover ring-2 ring-border/60"
              />
            ) : (
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${accent}, #0b2a6b)` }}
              >
                {page.displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="truncate font-display text-sm font-semibold tracking-tight">
              {page.displayName}
            </span>
          </div>
          <span
            title={t.profile.menu}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-white/[0.04] text-muted-foreground backdrop-blur"
          >
            <Menu className="size-4" />
            <span className="sr-only">{t.profile.menu}</span>
          </span>
        </motion.div>

        {/* ===== Hero: oversized avatar + greeting ===== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
          className="relative mt-10 text-center"
        >
          {/* Accent halo behind the avatar, mockup style */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 size-44 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
            style={{ background: accent }}
          />

          {page.logoUrl ? (
            <img
              src={page.logoUrl}
              alt={page.displayName}
              className="relative mx-auto size-32 rounded-full object-cover shadow-xl ring-4 ring-background"
            />
          ) : (
            <div
              className="relative mx-auto flex size-32 items-center justify-center rounded-full font-display text-4xl font-bold text-white shadow-xl ring-4 ring-background"
              style={{ background: `linear-gradient(135deg, ${accent}, #0b2a6b)` }}
            >
              {page.displayName.slice(0, 2).toUpperCase()}
            </div>
          )}

          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t.profile.hi} {page.displayName}
            <span style={{ color: accent }}>.</span>
          </h1>
          {(page.headline || page.trade) && (
            <p className="mt-2 text-sm text-muted-foreground">{page.headline || page.trade}</p>
          )}
          {page.location && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5" /> {page.location}
            </p>
          )}
        </motion.div>

        {/* ===== Primary CTA ===== */}
        {page.whatsapp && (
          <motion.a
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            href={waLink(page.whatsapp, waMessage)}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white shadow-lg transition-transform active:scale-[0.98]"
            style={{ background: accent }}
          >
            <MessageCircle className="size-4" />
            {t.profile.connect}
          </motion.a>
        )}

        {/* ===== Icon-only contact row ===== */}
        {contactIcons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 flex items-center justify-center gap-3"
          >
            {contactIcons.map((c) => (
              <a
                key={c.key}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                title={c.title}
                className="flex size-11 items-center justify-center rounded-2xl border border-border/60 bg-white/[0.04] text-muted-foreground backdrop-blur transition-all hover:scale-105 hover:text-foreground"
              >
                <c.icon className="size-4" />
                <span className="sr-only">{c.title}</span>
              </a>
            ))}
          </motion.div>
        )}

        {/* ===== Short bio ===== */}
        {page.bio && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 text-center text-sm leading-6 text-foreground/85"
          >
            {page.bio}
          </motion.p>
        )}

        {/* ===== Animated scroll chevron, mockup style ===== */}
        {photoItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.5 },
              y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
            }}
            className="mt-8 flex justify-center"
          >
            <button
              type="button"
              onClick={() =>
                document.getElementById("std-catalog")?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex size-10 items-center justify-center rounded-full border border-border/60 bg-white/[0.04] text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
            >
              <ChevronDown className="size-4" />
              <span className="sr-only">{t.profile.menu}</span>
            </button>
          </motion.div>
        )}

        {/* ===== Catalog grid ===== */}
        {photoItems.length > 0 && (
          <motion.section
            id="std-catalog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8"
          >
            <div className="grid grid-cols-2 gap-3">
              {photoItems.map((item: Item) => {
                const inner = (
                  <>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                      <p className="truncate text-xs font-semibold text-white">{item.title}</p>
                      {item.description && (
                        <p className="truncate text-[10px] text-white/75">{item.description}</p>
                      )}
                    </figcaption>
                  </>
                );
                const cls =
                  "group relative overflow-hidden rounded-2xl border border-border/60 block w-full text-left";
                return item.linkUrl ? (
                  <a key={item.id} href={item.linkUrl} target="_blank" rel="noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link key={item.id} to={`/u/${page.username}/i/${item.id}`} className={cls}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* ===== Service chips for kinds without photos ===== */}
        {(() => {
          const noPhoto = (page.items ?? []).filter((it) => !it.imageUrl);
          if (noPhoto.length === 0) return null;
          return (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6"
            >
              <div className="flex flex-wrap justify-center gap-2">
                {noPhoto.map((item: Item) => {
                  const Icon = KIND_ICON[item.kind] ?? FolderGit2;
                  return (
                    <Link
                      key={item.id}
                      to={`/u/${page.username}/i/${item.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/[0.04] px-3.5 py-2 text-xs font-medium backdrop-blur transition-colors hover:bg-white/[0.08]"
                    >
                      <Icon className="size-3.5" style={{ color: accent }} />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </motion.section>
          );
        })()}

        {/* ===== Footer mark ===== */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"
        >
          <ElioMark className="size-3.5" />
          <span className="font-mono">{page.username}</span>
        </motion.footer>
      </div>
    </div>
  );
}
