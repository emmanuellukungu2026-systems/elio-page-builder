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
import { useI18n } from "@/lib/i18n";
import { useMutation } from "convex/react";
import { Check, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Services() {
  const { t } = useI18n();
  const f = t.services.form;

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [trade, setTrade] = useState("");
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);
  const traceOrder = useMutation(api.orders.createOrder);

  const brief = [
    `*Elio Pages — Concierge brief*`,
    ``,
    `*Business:* ${name || "—"}`,
    `*Contact:* ${contact || "—"}`,
    `*WhatsApp:* ${whatsapp || "—"}`,
    `*Trade:* ${trade || "—"}`,
    ``,
    `*About:* ${details || "—"}`,
  ].join("\n");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !details.trim()) {
      toast.error(`${f.name} & ${f.details} — required`);
      return;
    }
    // Lightweight trace so no brief gets lost; the real delivery is WhatsApp.
    try {
      await traceOrder({
        pack: "whatsapp",
        name: `${name} (${contact || "no contact"})`,
        email: whatsapp || trade || "-",
        details: details.slice(0, 2000),
      });
    } catch {
      /* trace failure shouldn't block the handoff */
    }
    window.open(waLink(CONCIERGE_WHATSAPP, brief), "_blank");
    setSent(true);
    toast.success(t.servicesConfirm.title);
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

        {/* Steps */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {t.services.steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="glass h-full rounded-3xl p-6">
                <span className="font-display text-sm font-semibold text-ember">
                  {i + 1}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Form */}
        <div className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <div className="glass-strong rounded-3xl p-7">
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15">
                    <Check className="size-7 text-emerald-500" />
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-semibold">
                    {t.servicesConfirm.title}
                  </h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    {t.servicesConfirm.text}
                  </p>
                  <Button className="btn-glow mt-6 rounded-2xl" asChild>
                    <a
                      href={waLink(CONCIERGE_WHATSAPP, brief)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="size-4" /> {f.submitShort}
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    className="mt-2 rounded-xl"
                    onClick={() => setSent(false)}
                  >
                    {t.servicesConfirm.again}
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="size-4 text-ember" />
                    {t.services.kicker}
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="biz">{f.name}</Label>
                        <Input
                          id="biz"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={f.namePh}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact">{f.contact}</Label>
                        <Input
                          id="contact"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          placeholder={f.contactPh}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="wa">{f.whatsapp}</Label>
                        <Input
                          id="wa"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder={f.whatsappPh}
                          type="tel"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trade">{f.trade}</Label>
                        <Input
                          id="trade"
                          value={trade}
                          onChange={(e) => setTrade(e.target.value)}
                          placeholder={f.tradePh}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="details">{f.details}</Label>
                      <Textarea
                        id="details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder={f.detailsPh}
                        rows={6}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="btn-glow mt-6 w-full rounded-2xl">
                    <MessageCircle className="size-4" /> {f.submit}
                  </Button>

                  <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="size-3.5" />
                    {f.privacy}
                  </p>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass rounded-3xl p-7">
              <h3 className="font-display text-lg font-semibold">{t.services.made.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {t.services.made.text}
              </p>
              <div className="mt-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                100% free — no fees, no subscriptions, no commissions.
              </div>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
