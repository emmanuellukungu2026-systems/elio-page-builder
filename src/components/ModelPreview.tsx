import { MODELS, type ModelId, type ModelTheme } from "@/lib/portfolio-models";
import { cn } from "@/lib/utils";

/**
 * A small live preview of a page model, used in the order-time model picker.
 *
 * These are hand-built miniatures of each model's hero (not screenshots of
 * external sites), so they always match the real templates and cost nothing to
 * load. Each preview mirrors the model's signature composition:
 *  - editorial: coral headline + geometric block behind a portrait card
 *  - authory:   full-width cover band + centred avatar + content lines
 *  - corporate: navy hero panel with a serif headline + portrait
 *  - elegant:   near-black canvas, serif headline, portrait on the right
 */
export function ModelPreview({
  model,
  className,
}: {
  model: ModelId;
  className?: string;
}) {
  const t = MODELS[model].theme;
  const serif = t.display === "serif";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden rounded-xl",
        className,
      )}
      style={{ background: t.bg, border: `1px solid ${t.line}` }}
    >
      {model === "editorial" && <EditorialPreview t={t} serif={serif} />}
      {model === "authory" && <AuthoryPreview t={t} serif={serif} />}
      {model === "corporate" && <CorporatePreview t={t} serif={serif} />}
      {model === "elegant" && <ElegantPreview t={t} serif={serif} />}
    </div>
  );
}

/* Miniature building blocks ---------------------------------------------- */

/** Tiny portrait chip — stands in for the owner's photo. */
function Face({ className }: { className?: string }) {
  return (
    <span
      className={cn("block overflow-hidden", className)}
      style={{ background: "linear-gradient(150deg, #cbd5e1, #94a3b8)" }}
    >
      <span className="sr-only">Portrait</span>
    </span>
  );
}

/** Skeleton copy line. */
function Line({
  w,
  className,
  style,
}: {
  w: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={cn("block rounded-full", className)} style={{ width: w, ...style }} />
  );
}

function EditorialPreview({ t, serif }: { t: ModelTheme; serif: boolean }) {
  return (
    <div className="flex h-full items-center gap-2 p-3">
      <div className="flex-1 space-y-1.5">
        <Line w="34%" className="h-1.5" style={{ background: t.accent }} />
        <Line w="82%" className="h-3" style={{ background: t.ink }} />
        <Line w="64%" className="h-3" style={{ background: t.ink }} />
        <Line w="72%" className="h-1" style={{ background: t.muted, opacity: 0.5 }} />
        <div className="flex gap-1.5 pt-1">
          <span className="h-4 w-10 rounded-md" style={{ background: t.accent }} />
          <span
            className="h-4 w-10 rounded-md"
            style={{ border: `1px solid ${t.line}`, background: t.surface }}
          />
        </div>
      </div>
      <div className="relative h-full w-[42%]">
        <span
          className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-xl"
          style={{ background: t.accent }}
        />
        <span
          className="absolute left-0 top-1 h-5 w-5 -rotate-12 rounded-md"
          style={{ background: t.decor }}
        />
        <Face className="absolute left-1/2 top-1/2 h-[64%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-lg ring-2 ring-white" />
        <span
          className="absolute -left-1 bottom-1 h-6 w-8 rounded-md shadow-md"
          style={{ background: t.surface, border: `1px solid ${t.line}` }}
        />
      </div>
      {serif && <span className="sr-only">serif</span>}
    </div>
  );
}

function AuthoryPreview({ t, serif }: { t: ModelTheme; serif: boolean }) {
  return (
    <div className="h-full">
      {/* Cover band */}
      <div
        className="relative h-[46%] w-full"
        style={{ background: `linear-gradient(120deg, ${t.decor}, ${t.accent})` }}
      >
        <Face className="absolute left-1/2 bottom-0 h-9 w-9 -translate-x-1/2 translate-y-1/2 rounded-full ring-2 ring-white" />
      </div>
      <div className="space-y-1 px-3 pt-6 text-center">
        <Line w="46%" className="mx-auto h-2.5" style={{ background: t.ink }} />
        <Line w="70%" className="mx-auto h-1" style={{ background: t.muted, opacity: 0.5 }} />
        <div className="flex justify-center gap-1.5 pt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1 w-4 rounded-full"
              style={{ background: i === 0 ? t.accent : t.line }}
            />
          ))}
        </div>
      </div>
      {serif && <span className="sr-only">serif</span>}
    </div>
  );
}

function CorporatePreview({ t, serif }: { t: ModelTheme; serif: boolean }) {
  return (
    <div className="flex h-full items-stretch">
      <div className="flex-1 space-y-2 p-3" style={{ background: t.accent }}>
        <Line w="86%" className="h-3" style={{ background: t.bg, opacity: 0.95 }} />
        <Line w="68%" className="h-3" style={{ background: t.bg, opacity: 0.95 }} />
        <Line w="54%" className="h-1" style={{ background: t.bg, opacity: 0.6 }} />
        <span
          className="mt-1 block h-4 w-12 rounded-sm"
          style={{ border: `1px solid ${t.bg}` }}
        />
      </div>
      <div className="relative w-[40%]">
        <Face className="absolute inset-2 rounded-md" />
        <span
          className="absolute right-1 top-1 h-4 w-3 rounded-sm"
          style={{ background: t.decor }}
        />
      </div>
      {serif && <span className="sr-only">serif</span>}
    </div>
  );
}

function ElegantPreview({ t, serif }: { t: ModelTheme; serif: boolean }) {
  return (
    <div className="flex h-full items-center gap-2 p-3">
      <div className="flex-1 space-y-1.5">
        <Line w="70%" className="h-3" style={{ background: t.ink }} />
        <Line w="88%" className="h-3" style={{ background: t.ink }} />
        <Line w="52%" className="h-3" style={{ background: t.ink }} />
        <div className="flex gap-1 pt-1">
          <span className="h-4 w-12 rounded-sm" style={{ border: `1px solid ${t.line}` }} />
          <span className="h-4 w-12 rounded-sm" style={{ border: `1px solid ${t.line}` }} />
        </div>
      </div>
      <div className="relative h-full w-[40%] overflow-hidden rounded-md">
        <Face className="absolute inset-0 h-full w-full" />
        <span
          className="absolute inset-0"
          style={{ background: t.bg, opacity: 0.28 }}
        />
      </div>
      {serif && <span className="sr-only">serif</span>}
    </div>
  );
}
