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

      loginId: v.optional(v.string()), // 5-digit account ID, shown to the user as their "ID"
      phone: v.optional(v.string()), // fundamental contact captured at sign-up
    })
      .index("email", ["email"]) // index for the email. do not remove or modify
      .index("by_login_id", ["loginId"]),

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
      style: v.optional(v.string()), // editorial | authory | corporate | elegant (page model)
      template: v.optional(v.string()), // legacy (standard | pro | cover) — all pages render the portfolio now

      isPublished: v.optional(v.boolean()),
      publishedAt: v.optional(v.number()),
      updatedAt: v.optional(v.number()),
      viewCount: v.optional(v.number()), // total visits counted on the public page

      items: v.array(
        v.object({
          id: v.string(),
          kind: v.string(), // project | portfolio | article | idea | service | price
          title: v.string(),
          description: v.optional(v.string()),
          body: v.optional(v.string()), // long-form content (articles, case studies)
          imageUrl: v.optional(v.string()),
          linkUrl: v.optional(v.string()),
          tags: v.optional(v.array(v.string())),
          date: v.optional(v.string()),
          startDate: v.optional(v.string()), // project start
          endDate: v.optional(v.string()), // project end
          client: v.optional(v.string()), // client name / employer
          role: v.optional(v.string()), // role held on the project
          status: v.optional(v.string()),
        }),
      ),
    })
      .index("by_user", ["userId"])
      .index("by_username", ["username"])
      .index("by_published", ["isPublished"]),

    // One counted visit on a public page, deduped per viewer session so a
    // refresh loop doesn't inflate the owner's stats.
    pageViews: defineTable({
      pageId: v.id("elioPages"),
      viewerKey: v.string(), // anonymous browser session id
      viewedAt: v.number(),
    })
      .index("by_page", ["pageId"])
      .index("by_page_viewer", ["pageId", "viewerKey"]),

    // Visitor messages on a page (+ internal studio notes, flagged `internal`
    // so they never appear on the public page)
    pageComments: defineTable({
      pageId: v.id("elioPages"),
      authorName: v.string(),
      body: v.string(),
      internal: v.optional(v.boolean()),
    }).index("by_page", ["pageId"]),

    // Private conversations between a page's visitors and its owner.
    // `visitorToken` is a secret handed to the visitor's browser so an
    // anonymous visitor can come back and read the owner's replies.
    conversations: defineTable({
      pageId: v.id("elioPages"),
      visitorName: v.string(),
      visitorContact: v.optional(v.string()),
      visitorToken: v.string(),
      lastBody: v.string(),
      lastAt: v.number(),
      lastFrom: v.union(v.literal("visitor"), v.literal("owner")),
      unread: v.number(), // messages waiting for the owner
    })
      .index("by_page", ["pageId"])
      .index("by_page_time", ["pageId", "lastAt"])
      .index("by_token", ["visitorToken"]),

    messages: defineTable({
      conversationId: v.id("conversations"),
      from: v.union(v.literal("visitor"), v.literal("owner")),
      body: v.string(),
      at: v.number(),
      readAt: v.optional(v.number()),
    }).index("by_conversation", ["conversationId"]),

    // Trace of concierge briefs (delivered via WhatsApp)
    serviceOrders: defineTable({
      userId: v.optional(v.id("users")),
      pack: v.string(),
      name: v.string(),
      email: v.string(),
      details: v.string(),
      cardTier: v.optional(v.string()), // standard | pro | independent (NFC card model chosen at order time)
      model: v.optional(v.string()), // editorial | authory | corporate | elegant (page style chosen at order time)
      status: v.optional(v.string()),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
