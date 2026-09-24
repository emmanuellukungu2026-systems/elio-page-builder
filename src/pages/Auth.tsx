import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Loader2, Mail, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
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

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { t } = useI18n();
  const a = t.auth;
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(searchParams.get("returnTo"), redirectAfterAuth);
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
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

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="orbs" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>

      <Card className="glass-strong w-full max-w-sm rounded-3xl border-border/60 shadow-none">
        {step === "signIn" ? (
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
              <CardTitle className="font-display text-2xl">{a.title}</CardTitle>
              <CardDescription>{a.sub}</CardDescription>
            </CardHeader>
            <form onSubmit={handleEmailSubmit}>
              <CardContent className="space-y-4">
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="email"
                    placeholder={a.emailPh}
                    type="email"
                    className="rounded-xl bg-white/[0.04] pl-9"
                    disabled={isLoading}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}

                <Button type="submit" className="btn-glow w-full rounded-xl" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {a.sending}
                    </>
                  ) : (
                    <>
                      {a.continue} <ArrowRight className="ml-1 h-4 w-4" />
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
                  variant="outline"
                  className="btn-outline-glass w-full rounded-xl border-border/60"
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  {a.guest}
                </Button>
              </CardContent>
            </form>
          </>
        ) : (
          <>
            <CardHeader className="mt-2 text-center">
              <CardTitle className="font-display text-2xl">{a.checkTitle}</CardTitle>
              <CardDescription>
                {a.checkText} {step.email}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleOtpSubmit}>
              <CardContent className="pb-4">
                <input type="hidden" name="email" value={step.email} />
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
                  <Button variant="link" className="h-auto p-0" onClick={() => setStep("signIn")}>
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
                  onClick={() => setStep("signIn")}
                  disabled={isLoading}
                  className="w-full"
                >
                  {a.different}
                </Button>
              </CardFooter>
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
