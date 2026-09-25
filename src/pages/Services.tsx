import { Atmosphere } from "@/components/Atmosphere";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { CONCIERGE_WHATSAPP, waLink } from "@/lib/elio";
import { downloadBriefPdf, type BriefData } from "@/lib/brief-pdf";
import { useI18n } from "@/lib/i18n";
import { photoStrip } from "@/lib/photos";
import { useMutation } from "convex/react";
import { Check, Download, FileText, ListChecks, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Services() {
  const { t } = useI18n();
  const f = t.services.form;
  const p = t.services.pdf;

  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [trade, setTrade] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const traceOrder = useMutation(api.orders.createOrder);

  const briefData: BriefData = {
    businessName: businessName || "—",
    contactName,
    trade,
    whatsapp,
    bio: details,
    items: [],
  };

  const waMessage = [
    "*Elio Pages — Order*",
    "",
    `*Business:* ${businessName || "—"}`,
    contactName ? `*Contact:* ${contactName}` : "",
    whatsapp ? `*WhatsApp:* ${whatsapp}` : "",
    trade ? `*Trade:* ${trade}` : "",
    "",
    `*Details:* ${details || "—"}`,
    "",
    "_This message is my order — please build my Elio page from it._",
  ]
    .filter((l) => l !== "")
    .join("\n");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !details.trim()) {
      toast.error(`${f.name} & ${f.details} — required`);
      return;
    }
    setSending(true);
    // Trace the order locally; delivery is the WhatsApp message itself.
    try {
      await traceOrder({
        pack: "whatsapp-order",
        name: `${businessName} (${contactName || "no contact"})`,
        email: whatsapp || trade || "-",
        details: details.slice(0, 2000),
      });
    } catch {
      /* trace failure must not block the order */
    }
    window.open(waLink(CONCIERGE_WHATSAPP, waMessage), "_blank");
    setSending(false);
    setSent(true);
  };

  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      <Nav />

      <main className="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">
            {t.services.kicker}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            {t.services.title}
          </h1>
          <p className="mt-4 leading-7 text-muted-foreground">{t.services.subtitle}</p>
        </Reveal>

        {/* Prominent order panel — first thing on screen, mobile included */}
        <div
          id="order"
          className="mt-6 rounded-[1.75rem] border-2 border-primary/30 bg-card shadow-[0_2px_8px_rgba(16,24,43,0.1)] sm:mt-8 sm:rounded-[2rem]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3.5 sm:px-8 sm:py-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageCircle className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-base font-semibold leading-tight">
                  {t.services.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">{t.services.kicker}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              100% free

            </span>
          </div>

          <div className="grid gap-8 px-4 py-5 sm:px-8 sm:py-7 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
            <div>
            {sent ? (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15">
                  <Check className="size-7 text-emerald-500" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold">{t.servicesConfirm.title}</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  {t.servicesConfirm.text}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-500" asChild>
                    <a href={waLink(CONCIERGE_WHATSAPP, waMessage)} target="_blank" rel="noreferrer">
                      <MessageCircle className="size-4" /> {f.submitShort}
                    </a>
                  </Button>
                  <Button variant="outline" className="rounded-2xl" onClick={() => downloadBriefPdf(briefData)}>
                    <Download className="size-4" /> {p.download}
                  </Button>
                </div>
                <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="size-3.5" /> {p.attach}
                </p>
                <Button variant="ghost" className="mt-2 rounded-xl" onClick={() => setSent(false)}>
                  {t.servicesConfirm.again}
                </Button>
              </div>
            ) : (
              <form onSubmit={send}>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="biz">{f.name}</Label>
                      <Input id="biz" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder={f.namePh} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">{f.contact}</Label>
                      <Input id="contact" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder={f.contactPh} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="wa">{f.whatsapp}</Label>
                      <Input
                        id="wa"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder={f.whatsappPh}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trade">{f.trade}</Label>
                      <Input id="trade" value={trade} onChange={(e) => setTrade(e.target.value)} placeholder={f.tradePh} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="details">{f.details}</Label>
                    <Textarea
                      id="details"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder={f.detailsPh}
                      rows={4}
                      className="min-h-24"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="btn-glow mt-6 h-12 w-full rounded-2xl bg-emerald-600 text-base text-white hover:bg-emerald-500"
                  disabled={sending}
                >
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}
                  {f.submit}
                </Button>

                <div className="mt-6 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={() => downloadBriefPdf(briefData)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border/60 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Download className="size-4" /> {p.download}
                  </button>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="size-3.5" /> {f.privacy}
                  </p>
                </div>
              </form>
            )}
            </div>

            {/* Side column: what happens next + free note (below form on mobile) */}
            <div className="space-y-4 lg:border-l lg:border-border/60 lg:pl-8">
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2.5">
                  <ListChecks className="size-5 text-ember" />
                  <h3 className="font-display text-sm font-semibold">{p.title}</h3>
                </div>
                <ol className="mt-4 space-y-2.5">
                  {p.lines.map((line, i) => (
                    <li key={line} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                      <span className="font-display font-semibold text-ember">{i + 1}.</span>
                      {line.replace(/^\d\.\s*/, "")}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5">
                <h3 className="font-display text-sm font-semibold">{t.services.made.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.services.made.text}</p>
                <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  100% free — the WhatsApp message is the order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Photo strip — proof of finished pages, below the order panel so the form stays first on mobile */}
      <section className="relative px-4 pb-10 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[photoStrip[1], photoStrip[2], photoStrip[5], photoStrip[7]].map((src, i) => (
            <div
              key={src}
              className="group relative overflow-hidden rounded-2xl border border-border/50"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070d1f]/50 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
