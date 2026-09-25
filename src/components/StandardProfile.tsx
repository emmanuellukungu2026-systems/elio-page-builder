import { Atmosphere } from "@/components/Atmosphere";
import { ElioMark } from "@/components/ElioMark";
import type { Doc } from "@/convex/_generated/dataModel";
import { waLink } from "@/lib/elio";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Briefcase,
  FolderGit2,
  Images,
  Instagram,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
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
 * "Standard" template — a one-screen link-in-bio page (à la Emily Johnson
 * mockup): rounded cover, floating avatar, name + role, big CTA button,
 * icon-only contact row, and a square photo grid of the catalog.
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

      {/* Floating avatar + cover, like the mockup */}
      <div className="relative mx-auto max-w-md px-4 pt-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.6, 0.35, 1] }}
          className="relative"
        >
          {/* Rounded cover photo */}
          <div className="h-44 overflow-hidden rounded-[2rem] border border-border/60 sm:h-52">
            {page.coverUrl ? (
              <img src={page.coverUrl} alt="" className="size-full object-cover" />
            ) : (
              <div
                className="size-full"
                style={{ background: `radial-gradient(400px 200px at 50% 120%, ${accent}55, transparent)` }}
              />
            )}
          </div>

          {/* Avatar overlapping the cover */}
          <div className="relative z-10 -mt-10 flex justify-center">
            {page.logoUrl ? (
              <img
                src={page.logoUrl}
                alt={page.displayName}
                className="size-24 rounded-full object-cover shadow-lg ring-4 ring-background"
              />
            ) : (
              <div
                className="flex size-24 items-center justify-center rounded-full font-display text-2xl font-bold text-white shadow-lg ring-4 ring-background"
                style={{ background: `linear-gradient(135deg, ${accent}, #0b2a6b)` }}
              >
                {page.displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight">{page.displayName}</h1>
            {(page.headline || page.trade) && (
              <p className="mt-1 text-sm text-muted-foreground">{page.headline || page.trade}</p>
            )}
            {page.location && (
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> {page.location}
              </p>
            )}
          </div>
        </motion.div>

        {/* Primary CTA */}
        {page.whatsapp && (
          <motion.a
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            href={waLink(page.whatsapp, waMessage)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white shadow-lg transition-transform active:scale-[0.98]"
            style={{ background: accent }}
          >
            <MessageCircle className="size-4" />
            {t.profile.connect}
          </motion.a>
        )}

        {/* Icon-only contact row */}
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
              </a>
            ))}
          </motion.div>
        )}

        {/* Short bio */}
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

        {/* Square photo grid — the catalog, mockup style */}
        {photoItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8"
          >
            <div className="grid grid-cols-2 gap-3">
              {photoItems.map((item: Item) => {
                const Icon = KIND_ICON[item.kind] ?? FolderGit2;
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

        {/* Service chips for kinds without photos */}
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

        {/* Footer mark */}
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
