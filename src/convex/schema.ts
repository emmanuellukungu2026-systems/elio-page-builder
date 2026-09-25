import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // One portfolio page per business
    elioPages: defineTable({
      userId: v.id("users"),
      username: v.string(), // unique, 3-24 chars, lowercase

      // Identity
      displayName: v.string(), // business name
      trade: v.optional(v.string()), // sector / what they do
      headline: v.optional(v.string()), // tagline
      bio: v.optional(v.string()),
      story: v.optional(v.string()),
      location: v.optional(v.string()),
      since: v.optional(v.string()), // founded year

      // Contact
      email: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
      instagram: v.optional(v.string()),
      linkedin: v.optional(v.string()),

      // Look & feel
      logoUrl: v.optional(v.string()),
      coverUrl: v.optional(v.string()),
      accent: v.optional(v.string()),
      style: v.optional(v.string()), // noir | atelier | atoll | meridian
      template: v.optional(v.string()), // standard (link-in-bio) | pro (full portfolio)

      isPublished: v.optional(v.boolean()),
      publishedAt: v.optional(v.number()),
      updatedAt: v.optional(v.number()),

      items: v.array(
        v.object({
          id: v.string(),
          kind: v.string(), // project | portfolio | idea | service | price
          title: v.string(),
          description: v.optional(v.string()),
          imageUrl: v.optional(v.string()),
          linkUrl: v.optional(v.string()),
          tags: v.optional(v.array(v.string())),
          date: v.optional(v.string()),
          status: v.optional(v.string()),
        }),
      ),
    })
      .index("by_user", ["userId"])
      .index("by_username", ["username"])
      .index("by_published", ["isPublished"]),

    // Visitor messages on a page
    pageComments: defineTable({
      pageId: v.id("elioPages"),
      authorName: v.string(),
      body: v.string(),
    }).index("by_page", ["pageId"]),

    // Trace of concierge briefs (delivered via WhatsApp)
    serviceOrders: defineTable({
      userId: v.optional(v.id("users")),
      pack: v.string(),
      name: v.string(),
      email: v.string(),
      details: v.string(),
      status: v.optional(v.string()),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
