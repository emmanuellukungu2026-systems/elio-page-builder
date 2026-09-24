import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Record a concierge brief. The brief itself is delivered to the team via
 * WhatsApp; this row is a lightweight trace so nothing gets lost.
 */
export const createOrder = mutation({
  args: {
    pack: v.string(),
    name: v.string(),
    email: v.string(),
    details: v.string(),
  },
  handler: async (ctx, { pack, name, email, details }) => {
    const userId = await getAuthUserId(ctx);
    return await ctx.db.insert("serviceOrders", {
      userId: userId ?? undefined,
      pack: pack || "whatsapp",
      name: name.trim(),
      email: email.trim(),
      details: details.trim(),
      status: "new",
    });
  },
});
