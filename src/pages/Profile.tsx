import { Atmosphere } from "@/components/Atmosphere";
import { CoverProfile } from "@/components/CoverProfile";
import { ElioMark } from "@/components/ElioMark";
import { PageLoading } from "@/components/PageLoading";
import { ProProfile } from "@/components/ProProfile";
import { StandardProfile } from "@/components/StandardProfile";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { Link, useParams } from "react-router";

/**
 * Public portfolio router. The template stored on the page decides the
 * experience:
 *  - "standard": one-screen link-in-bio (StandardProfile).
 *  - "pro": full portfolio — accent hero, projects/articles/services,
 *    horizontal snap panels on mobile, comments (ProProfile).
 *  - "cover": giant-headline panel lit by the client's accent, work below
 *    (CoverProfile).
 */
export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const page = useQuery(api.pages.getPublicPage, { username: username ?? "" });
  const { t } = useI18n();
  const p = t.profile;

  if (page === undefined) {
    return <PageLoading />;
  }

  if (page === null) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <Atmosphere />
        <ElioMark className="size-10" />
        <h1 className="font-display text-2xl font-bold">{p.notLive}</h1>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">{p.notLiveText}</p>
        <Link
          to="/auth?returnTo=%2Fdashboard"
          className="btn-glow mt-2 inline-flex h-10 items-center justify-center rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          {p.claim}
        </Link>
      </div>
    );
  }

  // Standard template: one-screen link-in-bio page.
  if ((page.template ?? "pro") === "standard") {
    return <StandardProfile page={page} />;
  }

  // Cover template: giant headline over an accent-lit panel.
  if (page.template === "cover") {
    return <CoverProfile page={page} />;
  }

  // Pro template: full portfolio (accent hero, horizontal panels on mobile).
  return <ProProfile page={page} />;
}
