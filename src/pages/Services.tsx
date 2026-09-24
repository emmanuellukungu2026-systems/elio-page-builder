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

      <main className="mx-auto max-w-6xl px-4 pt-36 pb-24 sm:px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">
            {t.services.kicker}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {t.services.title}
          </h1>
          <p className="mt-5 max-w-xl leading-7 text-muted-foreground">{t.services.subtitle}</p>
        </Reveal>

        {/* How ordering works */}
        <Reveal delay={0.05} className="mt-10">
          <div className="glass rounded-3xl p-7">
            <div className="flex items-center gap-2.5">
              <ListChecks className="size-5 text-ember" />
              <h2 className="font-display text-lg font-semibold">{p.title}</h2>
            </div>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {p.lines.map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* The order form */}
          <Reveal>
            <div className="glass-strong rounded-3xl p-7">
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
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
                    <Button variant="outline" className="btn-outline-glow rounded-2xl" onClick={() => downloadBriefPdf(briefData)}>
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
                        <Input id="wa" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder={f.whatsappPh} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trade">{f.trade}</Label>
                        <Input id="trade" value={trade} onChange={(e) => setTrade(e.target.value)} placeholder={f.tradePh} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="details">{f.details}</Label>
                      <Textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder={f.detailsPh} rows={6} required />
                    </div>
                  </div>

                  <Button type="submit" className="btn-glow mt-6 w-full rounded-2xl bg-emerald-600 text-white hover:bg-emerald-500" disabled={sending}>
                    {sending ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle className="size-4" />}
                    {f.submit}
                  </Button>

                  <button
                    type="button"
                    onClick={() => downloadBriefPdf(briefData)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-border/60 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Download className="size-4" /> {p.download}
                  </button>

                  <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="size-3.5" /> {f.privacy}
                  </p>
                </form>
              )}
            </div>
          </Reveal>

          {/* The fine print */}
          <Reveal delay={0.1}>
            <div className="glass rounded-3xl p-7">
              <h3 className="font-display text-lg font-semibold">{t.services.made.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.services.made.text}</p>
              <div className="mt-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                100% free — the WhatsApp message is the order.
              </div>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
