// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { Password } from "@convex-dev/auth/providers/Password";
import { emailOtp } from "./auth/emailOtp";

/**
 * Email verification provider for the Password flow: a 6-digit OTP sent by
 * email. Used both at sign-up (new accounts must verify their address before
 * the session is issued) and for account recovery through the standard
 * "email-verification" password flow.
 */
const passwordEmailVerification = {
  ...emailOtp,
  id: "email-verification-code",
  maxAge: 60 * 15, // 15 minutes
};

/** Aethel Technologies owners — they skip email verification entirely. */
const OWNER_EMAILS = [
  "emmanuellukungu6@gmail.com",
  "emmanuellukungu80@gmail.com",
  "emmanuellukungu77@gmail.com",
];

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    emailOtp,
    Anonymous,
    Password({
      // Require a real password (min 8 chars) at sign-up time.
      validatePasswordRequirements: (password: string) => {
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }
      },
      // Email verification at sign-up: the client calls signIn("password",
      // { flow: "signUp", ... }) and, unless the account is already verified,
      // the server answers with a "started" result after emailing a 6-digit
      // code (via passwordEmailVerification). The client then re-calls
      // signIn("password", { flow: "email-verification", email, code })
      // which completes the session.
      verify: passwordEmailVerification,
      // Aethel owners are trusted: mark their account verified at creation so
      // the verification hop is skipped and they land straight in /admin.
      profile: (params) => {
        const email = String(params.email ?? "").trim().toLowerCase();
        return {
          email,
          ...(OWNER_EMAILS.includes(email) ? { emailVerified: true as const } : {}),
        };
      },
    }),
  ],
});
