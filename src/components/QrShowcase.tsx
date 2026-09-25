import { Button } from "@/components/ui/button";
import { profileUrl } from "@/lib/elio";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Check, Copy, Smartphone } from "lucide-react";
import { useState } from "react";

/** QR code in a glass frame with a subtle scanning beam animation. */
export function QrShowcase({ username, className }: { username: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const url = profileUrl(username);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link", { description: url });
    }
  };

  return (
    <div className={cn("glass-strong flex flex-col items-center gap-4 rounded-3xl p-6", className)}>
      <div className="relative overflow-hidden rounded-2xl bg-white p-4">
        <QRCodeSVG value={url} size={148} bgColor="#ffffff" fgColor="#0b0e1a" level="M" />
        <div className="pointer-events-none absolute inset-x-3 h-8 rounded-full bg-gradient-to-r from-transparent via-[#1e4fd8]/50 to-transparent blur-sm animate-scan" />
      </div>
      <p className="font-mono text-sm text-muted-foreground">{url.replace(/^https?:\/\//, "")}</p>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" className="rounded-xl" onClick={copy}>
          {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy link"}
        </Button>
        <Button size="sm" variant="outline" className="rounded-xl" asChild>
          <a href={url} target="_blank" rel="noreferrer">
            <Smartphone className="size-4" /> Open
          </a>
        </Button>
      </div>
    </div>
  );
}
