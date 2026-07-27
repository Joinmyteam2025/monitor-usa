import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Public Queries ──────────────────────────────────────────

export const list = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    let q = ctx.db.query("articles").withIndex("by_published").order("desc");
    const all = await q.collect();
    let articles = all.filter((a) => a.status === "published");
    if (args.category) {
      articles = articles.filter((a) => a.category === args.category);
    }
    const cursor = args.cursor ?? 0;
    const page = articles.slice(cursor, cursor + limit);
    return page;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const article = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!article) return null;
    // Get like count
    const likes = await ctx.db
      .query("articleLikes")
      .withIndex("by_article", (q) => q.eq("articleId", article._id))
      .collect();
    // Get comments
    const comments = await ctx.db
      .query("articleComments")
      .withIndex("by_article", (q) => q.eq("articleId", article._id))
      .collect();
    const sortedComments = comments
      .filter((c) => c.status === "approved")
      .sort((a, b) => b.createdAt - a.createdAt);
    // Get reactions
    const reactions = await ctx.db
      .query("articleReactions")
      .withIndex("by_article", (q) => q.eq("articleId", article._id))
      .collect();
    // Group reactions by emoji
    const reactionCounts: Record<string, number> = {};
    reactions.forEach((r) => {
      reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
    });
    return {
      ...article,
      likeCount: likes.length,
      comments: sortedComments,
      reactionCounts,
      viewCount: article.viewCount || 0,
    };
  },
});

export const getCategories = query({
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    const published = articles.filter((a) => a.status === "published");
    const cats = new Set(published.map((a) => a.category));
    return Array.from(cats).sort();
  },
});

export const getSitemap = query({
  handler: async (ctx) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_published")
      .order("desc")
      .collect();
    return articles
      .filter((a) => a.status === "published")
      .map((a) => ({
        slug: a.slug,
        title: a.title,
        publishedAt: a.publishedAt,
        category: a.category,
      }));
  },
});

// ── View Tracking ───────────────────────────────────────────

export const recordView = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const article = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (article) {
      await ctx.db.patch(article._id, {
        viewCount: (article.viewCount || 0) + 1,
      });
    }
  },
});

// ── Like System ─────────────────────────────────────────────

export const toggleLike = mutation({
  args: {
    articleId: v.id("articles"),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("articleLikes")
      .withIndex("by_visitor", (q) =>
        q.eq("articleId", args.articleId).eq("visitorId", args.visitorId)
      )
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
      return { liked: false };
    }
    await ctx.db.insert("articleLikes", {
      articleId: args.articleId,
      visitorId: args.visitorId,
      createdAt: Date.now(),
    });
    return { liked: true };
  },
});

export const hasLiked = query({
  args: {
    articleId: v.id("articles"),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.articleId || !args.visitorId) return false;
    const existing = await ctx.db
      .query("articleLikes")
      .withIndex("by_visitor", (q) =>
        q.eq("articleId", args.articleId).eq("visitorId", args.visitorId)
      )
      .first();
    return !!existing;
  },
});

// ── Reaction System ─────────────────────────────────────────

export const toggleReaction = mutation({
  args: {
    articleId: v.id("articles"),
    visitorId: v.string(),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("articleReactions")
      .withIndex("by_visitor", (q) =>
        q.eq("articleId", args.articleId).eq("visitorId", args.visitorId)
      )
      .first();
    if (existing && existing.emoji === args.emoji) {
      await ctx.db.delete(existing._id);
      return { reacted: false };
    }
    if (existing) {
      await ctx.db.patch(existing._id, { emoji: args.emoji });
      return { reacted: true, changed: true };
    }
    await ctx.db.insert("articleReactions", {
      articleId: args.articleId,
      visitorId: args.visitorId,
      emoji: args.emoji,
      createdAt: Date.now(),
    });
    return { reacted: true };
  },
});

export const getVisitorReaction = query({
  args: {
    articleId: v.id("articles"),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.articleId || !args.visitorId) return null;
    const existing = await ctx.db
      .query("articleReactions")
      .withIndex("by_visitor", (q) =>
        q.eq("articleId", args.articleId).eq("visitorId", args.visitorId)
      )
      .first();
    return existing?.emoji || null;
  },
});

// ── Comment System ──────────────────────────────────────────

export const addComment = mutation({
  args: {
    articleId: v.id("articles"),
    name: v.string(),
    content: v.string(),
    visitorId: v.string(),
    parentId: v.optional(v.id("articleComments")),
  },
  handler: async (ctx, args) => {
    if (args.content.trim().length < 2 || args.content.length > 2000) {
      return { success: false, error: "Comment must be between 2 and 2000 characters" };
    }
    if (args.name.trim().length < 1 || args.name.length > 100) {
      return { success: false, error: "Name is required" };
    }
    const id = await ctx.db.insert("articleComments", {
      articleId: args.articleId,
      name: args.name.trim(),
      content: args.content.trim(),
      visitorId: args.visitorId,
      parentId: args.parentId,
      status: "approved",
      createdAt: Date.now(),
    });
    return { success: true, id };
  },
});

export const getComments = query({
  args: { articleId: v.id("articles") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("articleComments")
      .withIndex("by_article", (q) => q.eq("articleId", args.articleId))
      .collect();
    return comments
      .filter((c) => c.status === "approved")
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ── Mutations (used by content engine) ──────────────────────

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    metaTitle: v.string(),
    metaDescription: v.string(),
    schemaMarkup: v.string(),
    ctaUrl: v.string(),
    ctaText: v.string(),
    author: v.string(),
    readTime: v.number(),
    status: v.string(),
    publishedAt: v.number(),
    featuredImage: v.optional(v.string()),
    heroImage: v.optional(v.string()),
    heroImageAlt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      return { success: false, error: "Slug already exists" };
    }
    const id = await ctx.db.insert("articles", {
      ...args,
      viewCount: 0,
      createdAt: Date.now(),
    });
    return { success: true, id };
  },
});

export const createBatch = mutation({
  args: {
    articles: v.array(
      v.object({
        title: v.string(),
        slug: v.string(),
        content: v.string(),
        excerpt: v.string(),
        category: v.string(),
        tags: v.array(v.string()),
        metaTitle: v.string(),
        metaDescription: v.string(),
        schemaMarkup: v.string(),
        ctaUrl: v.string(),
        ctaText: v.string(),
        author: v.string(),
        readTime: v.number(),
        status: v.string(),
        publishedAt: v.number(),
        featuredImage: v.optional(v.string()),
        heroImage: v.optional(v.string()),
        heroImageAlt: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const article of args.articles) {
      const existing = await ctx.db
        .query("articles")
        .withIndex("by_slug", (q) => q.eq("slug", article.slug))
        .first();
      if (existing) {
        results.push({ slug: article.slug, status: "skipped", reason: "exists" });
        continue;
      }
      const id = await ctx.db.insert("articles", {
        ...article,
        viewCount: 0,
        createdAt: Date.now(),
      });
      results.push({ slug: article.slug, status: "created", id });
    }
    return results;
  },
});

export const deleteById = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const deleteAll = mutation({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db.query("articles").collect();
    for (const article of articles) { await ctx.db.delete(article._id); }
    const likes = await ctx.db.query("articleLikes").collect();
    for (const like of likes) { await ctx.db.delete(like._id); }
    const comments = await ctx.db.query("articleComments").collect();
    for (const comment of comments) { await ctx.db.delete(comment._id); }
    const reactions = await ctx.db.query("articleReactions").collect();
    for (const reaction of reactions) { await ctx.db.delete(reaction._id); }
    return { deleted: articles.length };
  },
});
