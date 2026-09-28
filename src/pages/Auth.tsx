import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus,
  UserX,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(returnTo: string | null, fallback = "/dashboard") {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

type Mode = "signIn" | "signUp";

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { t } = useI18n();
  const a = t.auth;
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const completeRegistration = useMutation(api.users.completeRegistration);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(searchParams.get("returnTo"), redirectAfterAuth);

  // Credentials flow state
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Sign-up fundamentals
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Email verification step (sign-up): the code has been sent to this address.
  const [verifyStep, setVerifyStep] = useState<{ email: string; password: string } | null>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleCredentialsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    const addr = email.trim().toLowerCase();
    try {
      if (mode === "signUp") {
        // The Password provider sends a 6-digit code to this address
        // (unless the account is pre-verified, e.g. an Aethel owner).
        const result = await signIn("password", {
          flow: "signUp",
          email: addr,
          password,
          name: fullName,
          phone,
        });
        // No verification required → session issued immediately.
        if (result.signingIn) {
          await completeRegistration({ name: fullName, phone, email: addr });
          navigate(redirect);
        } else {
          // Verification started → ask for the emailed code.
          setVerifyStep({ email: addr, password });
        }
        setIsLoading(false);
        return;
      }
      // Sign in with email + password.
      const result = await signIn("password", {
        flow: "signIn",
        email: addr,
        password,
      });
      if (result.signingIn) {
        navigate(redirect);
      } else {
        // Account exists but email not verified yet (e.g. sign-up abandoned
        // mid-verification): run the verification flow.
        setVerifyStep({ email: addr, password });
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Credentials flow error:", err);
      const raw = err instanceof Error ? err.message : "";
      setError(
        mode === "signUp"
          ? a.errors.signUpFailed
          : raw.toLowerCase().includes("invalid")
            ? a.errors.invalidCredentials
            : a.errors.signInFailed,
      );
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!verifyStep) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn("password", {
        flow: "email-verification",
        email: verifyStep.email,
        code,
      });
      if (result.signingIn) {
        // First-time sign-up: persist the captured identity fields.
        await completeRegistration({
          name: fullName,
          phone,
          email: verifyStep.email,
        }).catch(() => undefined);
        navigate(redirect);
      } else {
        setError(a.errors.invalidCode);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(a.errors.invalidCode);
      setIsLoading(false);
      setCode("");
    }
  };

  const handleResend = async () => {
    if (!verifyStep) return;
    setIsLoading(true);
    setError(null);
    try {
      await signIn("password", {
        flow: "signUp",
        email: verifyStep.email,
        password: verifyStep.password,
        name: fullName,
        phone,
      });
    } catch {
      // Account already exists → just tell the user a new code was sent
      // only if it worked; on error, let them retry.
      setError(a.errors.emailFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      setError(`Failed to sign in as guest: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Step 2 — email verification code                                     */
  /* ------------------------------------------------------------------ */
  if (verifyStep) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="orbs" aria-hidden="true">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="orb orb-c" />
        </div>
        <Card className="glass-strong w-full max-w-sm rounded-3xl border-border/60 shadow-none">
          <CardHeader className="mt-2 text-center">
            <div className="flex justify-center">
              <img src={logo} alt="Elio Pages" width={56} height={56} className="mb-4 mt-2 rounded-xl" />
            </div>
            <CardTitle className="font-display text-2xl">{a.checkTitle}</CardTitle>
            <CardDescription>
              {a.checkText} {verifyStep.email}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerifySubmit}>
            <CardContent className="pb-4">
              <div className="flex justify-center">
                <InputOTP
                  value={code}
                  onChange={setCode}
                  maxLength={6}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && code.length === 6 && !isLoading) {
                      const form = (e.target as HTMLElement).closest("form");
                      form?.requestSubmit();
                    }
                  }}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="btn-glow w-full rounded-xl" disabled={isLoading || code.length !== 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {a.verifying}
                  </>
                ) : (
                  <>
                    {a.verify} <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {a.resend}{" "}
                <Button variant="link" className="h-auto p-0" onClick={handleResend} disabled={isLoading}>
                  {a.tryAgain}
                </Button>
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setVerifyStep(null);
                  setCode("");
                  setError(null);
                }}
                disabled={isLoading}
                className="w-full"
              >
                {a.different}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Step 1 — credentials                                                 */
  /* ------------------------------------------------------------------ */
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="orbs" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>

      <Card className="glass-strong w-full max-w-sm rounded-3xl border-border/60 shadow-none">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Elio Pages"
              width={56}
              height={56}
              className="mb-4 mt-2 cursor-pointer rounded-xl transition-transform duration-300 hover:scale-105"
              onClick={() => navigate("/")}
            />
          </div>
          <CardTitle className="font-display text-2xl">
            {mode === "signIn" ? a.title : a.signUpTitle}
          </CardTitle>
          <CardDescription>{mode === "signIn" ? a.sub : a.signUpSub}</CardDescription>
        </CardHeader>

        {/* Tabs: sign in / create account */}
        <div className="mx-6 mt-1 grid grid-cols-2 gap-1 rounded-2xl border border-border/60 bg-white/[0.03] p-1">
          {(["signIn", "signUp"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all " +
                (mode === m
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {m === "signIn" ? a.tabSignIn : a.tabSignUp}
            </button>
          ))}
        </div>

        <form onSubmit={handleCredentialsSubmit}>
          <CardContent className="space-y-4">
            {mode === "signUp" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{a.nameLabel}</Label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={a.namePh}
                      autoComplete="name"
                      className="rounded-xl bg-white/[0.04] pl-9"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{a.phoneLabel}</Label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+243 …"
                      className="rounded-xl bg-white/[0.04] pl-9"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{a.emailLabel}</Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={a.emailPh}
                  className="rounded-xl bg-white/[0.04] pl-9"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{a.passwordLabel}</Label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "signUp" ? "new-password" : "current-password"}
                  className="rounded-xl bg-white/[0.04] pl-9"
                  disabled={isLoading}
                  required
                  minLength={8}
                />
              </div>
              {mode === "signUp" && (
                <p className="text-[11px] text-muted-foreground">{a.passwordHelp}</p>
              )}
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" className="btn-glow w-full rounded-xl" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {a.sending}
                </>
              ) : mode === "signUp" ? (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> {a.signUpCta}
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" /> {a.signInCta}
                </>
              )}
            </Button>

            <div className="relative mt-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-muted-foreground">{a.or}</span>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-xl"
              onClick={handleGuestLogin}
              disabled={isLoading}
            >
              <UserX className="mr-2 h-4 w-4" />
              {a.guest}
            </Button>
          </CardContent>
        </form>

        <div className="rounded-b-3xl border-t border-border/50 px-6 py-4 text-center text-xs text-muted-foreground">
          {a.footer}
        </div>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground">
        <button
          className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
          onClick={() => navigate("/")}
        >
          ← {a.back}
        </button>
      </p>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
