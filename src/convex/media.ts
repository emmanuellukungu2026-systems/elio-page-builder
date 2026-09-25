import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Media uploads (client photos, logos, covers) stored in Convex Storage.
 * Only the owner allowlist may upload — client pages are built by the team.
 */

const OWNER_EMAILS = [
  "emmanuellukungu6@gmail.com",
  "emmanuellukungu80@gmail.com",
  "emmanuellukungu77@gmail.com",
];

async function isOwner(ctx: {
  db: { get(id: unknown): Promise<{ email?: string } | null> };
  auth: unknown;
}): Promise<boolean> {
  const userId = await getAuthUserId(ctx as never);
  if (userId === null) return false;
  const user = await ctx.db.get(userId);
  const email = (user?.email ?? "").trim().toLowerCase();
  return !!email && OWNER_EMAILS.includes(email);
}

/** Step 1 — hand the browser a short-lived upload URL. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    if (!(await isOwner(ctx))) throw new Error("Admin only");
    return await ctx.storage.generateUploadUrl();
  },
});

/** Step 2 — attach the stored file; returns its public /api/files URL. */
export const attachMedia = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    if (!(await isOwner(ctx))) throw new Error("Admin only");
    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw new Error("Upload failed");
    return { storageId, url };
  },
});

/** Delete a stored file (e.g. replacing a logo). */
export const deleteMedia = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    if (!(await isOwner(ctx))) throw new Error("Admin only");
    await ctx.storage.delete(storageId);
  },
});
