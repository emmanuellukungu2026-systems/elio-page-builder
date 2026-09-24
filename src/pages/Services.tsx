import { Atmosphere } from "@/components/Atmosphere";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { PACKS } from "@/lib/elio";
import { useMutation } from "convex/react";
import { ArrowRight, Check, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

const ORDER_STEPS = [
  { title: "Tell us about you", text: "Fill the short brief below — who you are, what you do, links to your work." },
  { title: "We craft your page", text: "Our team writes your story, curates your sections and designs your space." },
  { title: "Review & launch", text: "You get your page, your link and your QR/NFC card — ready to share anywhere." },
];

export default function Services() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPack = searchParams.get("pack") ?? "signature";
  const validPack = PACKS.some((p) => p.id === initialPack) ? initialPack : "signature";

  const [pack, setPack] = useState<string>(validPack);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const createOrder = useMutation(api.orders.createOrder);

  useEffect(() => {
    if (searchParams.get("pack")) {
      setPack(searchParams.get("pack")!);
    }
  }, [searchParams]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !details.trim()) {
      toast.error("Please fill in your name, email and a short brief.");
      return;
    }
    setSubmitting(true);
    try {
      await createOrder({ pack, name, email, details });
      setDone(true);
      toast.success("Request received — we'll reply within 24h.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      <Nav />

      <main className="mx-auto max-w-6xl px-4 pt-36 pb-24 sm:px-6">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ember">Elio Studio</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
            A page crafted for you, by us.
          </h1>
          <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
            You don't need to build it alone. Order a personalized, professional Elio
            page — our team turns your work and story into a space that feels like you.
          </p>
        </Reveal>

        {/* Steps */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {ORDER_STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="glass h-full rounded-3xl p-6">
                <span className="font-display text-sm font-semibold text-ember">Step {i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Packs + form */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            {PACKS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <button
                  type="button"
                  onClick={() => setPack(p.id)}
                  className={
                    pack === p.id
                      ? "glass-strong relative w-full rounded-3xl p-6 text-left ring-1 ring-ember/50 transition-all"
                      : "glass relative w-full rounded-3xl p-6 text-left transition-all hover:bg-white/[0.05]"
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                        {p.popular && (
                          <span className="rounded-full bg-ember/15 px-2 py-0.5 text-[11px] font-medium text-ember">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl font-bold">{p.price}</p>
                      <p className="text-xs text-muted-foreground">{p.period}</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-1.5 text-sm text-foreground/85">
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-ember" /> {f}
                      </li>
                    ))}
                  </ul>
                </button>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="glass-strong rounded-3xl p-7">
              {done ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15">
                    <Check className="size-7 text-emerald-400" />
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-semibold">Request received</h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    Thank you, {name.split(" ")[0]}. Our team will reach out at{" "}
                    <span className="text-foreground">{email}</span> within 24 hours to
                    start crafting your {PACKS.find((p) => p.id === pack)?.name} page.
                  </p>
                  <Button className="mt-7 rounded-2xl" variant="outline" onClick={() => navigate("/")}>
                    Back to home
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="size-4 text-ember" />
                    Order your {PACKS.find((p) => p.id === pack)?.name} page
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    No payment now — we confirm scope and timing by email first.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Emmanuel Lukungu"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="details">Tell us about you</Label>
                      <Textarea
                        id="details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="What do you do? Links to your work, socials, CV… anything that helps us tell your story."
                        rows={5}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="btn-glow mt-6 w-full rounded-2xl" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        Request my page <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>

                  <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="size-3.5" />
                    Your brief stays private — used only to craft your page.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
