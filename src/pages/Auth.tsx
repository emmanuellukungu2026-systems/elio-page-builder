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
  Hash,
  KeyRound,
  Loader2,
  Lock,
  Mail,
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
  const ensureLoginId = useMutation(api.users.ensureLoginId);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(searchParams.get("returnTo"), redirectAfterAuth);

  // Credentials flow state
  const [mode, setMode] = useState<Mode>("signIn");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newUserId, setNewUserId] = useState<string | null>(null);

  // Legacy email-OTP flow state
  const [otpStep, setOtpStep] = useState<{ email: string } | null>(null);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      // Make sure every account has its 5-digit ID, then land.
      ensureLoginId().catch(() => undefined);
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect, ensureLoginId]);

  const handleCredentialsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signIn("password", {
        flow: mode === "signUp" ? "signUp" : "signIn",
        // Convex Auth's Password provider stores the account identifier in
        // `email` — we pass the 5-digit ID there so the same table works.
        email: `${loginId}@elio.local`,
        password,
      });
      const id = await ensureLoginId();
      if (mode === "signUp") setNewUserId(id);
      navigate(redirect);
    } catch (err) {
      console.error("Credentials sign-in error:", err);
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

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setOtpStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(error instanceof Error ? error.message : "Failed to send verification code.");
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      await ensureLoginId().catch(() => undefined);
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
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

  // Success screen after creating an account — show the new 5-digit ID.
  if (newUserId) {
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
              <img src={logo} alt="Elio Pages" width={56} height={56} className="mb-4 mt-2 rounded-xl" />
            </div>
            <CardTitle className="font-display text-2xl">{a.idTitle}</CardTitle>
            <CardDescription>{a.idText}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-4">
            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-white/[0.04] px-6 py-4">
              <Hash className="size-5 text-primary" />
              <span className="font-display text-3xl font-bold tracking-[0.2em]">{newUserId}</span>
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">{a.idHint}</p>
          </CardContent>
          <CardFooter>
            <Button className="btn-glow w-full rounded-xl" onClick={() => navigate(redirect)}>
              {a.idContinue} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="orbs" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>

      <Card className="glass-strong w-full max-w-sm rounded-3xl border-border/60 shadow-none">
        {otpStep ? (
          <>
            <CardHeader className="mt-2 text-center">
              <CardTitle className="font-display text-2xl">{a.checkTitle}</CardTitle>
              <CardDescription>
                {a.checkText} {otpStep.email}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleOtpSubmit}>
              <CardContent className="pb-4">
                <input type="hidden" name="email" value={otpStep.email} />
                <input type="hidden" name="code" value={otp} />

                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                        const form = (e.target as HTMLElement).closest("form");
                        if (form) {
                          form.requestSubmit();
                        }
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
                {error && <p className="mt-2 text-center text-sm text-red-400">{error}</p>}
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  {a.resend}{" "}
                  <Button variant="link" className="h-auto p-0" onClick={() => setOtpStep(null)}>
                    {a.tryAgain}
                  </Button>
                </p>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button
                  type="submit"
                  className="btn-glow w-full rounded-xl"
                  disabled={isLoading || otp.length !== 6}
                >
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
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOtpStep(null)}
                  disabled={isLoading}
                  className="w-full"
                >
                  {a.different}
                </Button>
              </CardFooter>
            </form>
          </>
        ) : (
          <>
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
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{a.idLabel}</Label>
                  <div className="relative flex items-center">
                    <Hash className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value.replace(/\D/g, "").slice(0, 5))}
                      placeholder="12345"
                      inputMode="numeric"
                      autoComplete={mode === "signUp" ? "off" : "username"}
                      className="rounded-xl bg-white/[0.04] pl-9 font-mono tracking-[0.2em]"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {mode === "signIn" && <p className="text-[11px] text-muted-foreground">{a.idHelp}</p>}
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

                <Button type="submit" className="btn-glow w-full rounded-xl" disabled={isLoading || loginId.length !== 5}>
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

                {/* Email OTP fallback */}
                <Button
                  type="button"
                  variant="outline"
                  className="btn-outline-glass w-full rounded-xl border-border/60"
                  onClick={async () => {
                    const email = window.prompt(a.emailPrompt);
                    if (!email) return;
                    try {
                      const fd = new FormData();
                      fd.set("email", email);
                      await signIn("email-otp", fd);
                      setOtpStep({ email });
                    } catch {
                      setError(a.errors.emailFailed);
                    }
                  }}
                  disabled={isLoading}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {a.emailOtpCta}
                </Button>

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
          </>
        )}

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
