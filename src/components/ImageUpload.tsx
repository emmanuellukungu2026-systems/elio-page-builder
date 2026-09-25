import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Owner-only image picker: uploads to Convex Storage, then hands the public
 * URL to `onUploaded`. Used for logos, covers and catalog photos in /admin.
 */
export function ImageUpload({
  value,
  onUploaded,
  onClear,
  label,
  aspect = "aspect-video",
}: {
  value?: string;
  onUploaded: (url: string) => void;
  onClear?: () => void;
  label: string;
  aspect?: "aspect-video" | "aspect-square";
}) {
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const attachMedia = useMutation(api.media.attachMedia);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Images only (PNG, JPG, WebP…)");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Max 8 MB");
      return;
    }
    setBusy(true);
    try {
      const postUrl = await generateUploadUrl();
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = (await res.json()) as { storageId: string };
      const { url } = await attachMedia({ storageId: storageId as Id<"_storage"> });
      onUploaded(url);
      toast.success(label + " — OK");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <span className="block text-xs font-medium text-muted-foreground">{label}</span>

      {value ? (
        <div className="group relative overflow-hidden rounded-2xl border border-border/60">
          <img src={value} alt="" className={cn("w-full object-cover", aspect)} />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-lg"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
            >
              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
              Replace
            </Button>
            {onClear && (
              <Button
                size="icon-sm"
                variant="secondary"
                className="rounded-lg"
                onClick={onClear}
                disabled={busy}
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void upload(file);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed p-5 text-xs text-muted-foreground transition-colors",
            dragOver ? "border-ember bg-ember/5" : "border-border/70 hover:bg-white/[0.04]",
          )}
          disabled={busy}
        >
          {busy ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <ImagePlus className="size-5" />
          )}
          {busy ? "Uploading…" : `${label} — click or drop`}
        </button>
      )}

      {/* Manual URL entry stays available for stock photos */}
      <Input
        value={value ?? ""}
        onChange={(e) => onUploaded(e.target.value)}
        placeholder="https://… (URL)"
        className="h-8 text-xs"
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void upload(file);
        }}
      />
    </div>
  );
}
