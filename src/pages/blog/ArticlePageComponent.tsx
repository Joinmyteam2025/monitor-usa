import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Heart, MessageCircle, ChevronUp, BookOpen, Send, User, Link2 } from "lucide-react";

// Persistent visitor ID for likes/comments
function getVisitorId(): string {
  let id = localStorage.getItem("_visitor_id");
  if (!id) {
    id = "v_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("_visitor_id", id);
  }
  return id;
}

interface ArticlePageProps {
  siteName: string;
  siteUrl: string;
  accentColor?: string;
  ctaUrl?: string;
  ctaText?: string;
  showNav?: boolean;
}

/* ── Shared navigation bar for article pages ── */
function ArticleNavBar({ siteName, siteUrl, accentColor, ctaUrl, ctaText }: { siteName: string; siteUrl: string; accentColor: string; ctaUrl: string; ctaText: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ background: "rgba(10,22,40,0.92)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <a href={siteUrl} className="flex items-center gap-2.5 text-white font-extrabold text-lg tracking-tight hover:opacity-90 transition-opacity" style={{ letterSpacing: "-0.02em" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}>
            {siteName.charAt(0)}
          </div>
          <span className="hidden sm:inline">{siteName}</span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          <a href={siteUrl} className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Home</a>
          <Link to="/blog" className="text-sm font-medium transition-colors" style={{ color: accentColor }}>Blog</Link>
          <a href={ctaUrl} className="ml-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 shadow-lg" style={{ backgroundColor: accentColor, boxShadow: `0 4px 14px ${accentColor}44` }}>
            {ctaText}
          </a>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-400 hover:text-white transition-colors" aria-label="Menu">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-3" style={{ background: "rgba(10,22,40,0.97)" }}>
          <a href={siteUrl} className="block text-sm text-gray-300 hover:text-white transition-colors font-medium py-1">Home</a>
          <Link to="/blog" className="block text-sm font-medium py-1" style={{ color: accentColor }}>Blog</Link>
          <a href={ctaUrl} className="block w-full text-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white mt-2" style={{ backgroundColor: accentColor }}>
            {ctaText}
          </a>
        </div>
      )}
    </nav>
  );
}

export function ArticlePage({
  siteName,
  siteUrl,
  accentColor = "#3B82F6",
  ctaUrl = "/signup",
  ctaText = "Get Started Free",
  showNav = true,
}: ArticlePageProps) {
  const { slug } = useParams<{ slug: string }>();
  const article = useQuery(api.articles.getBySlug, { slug: slug ?? "" });
  const articles = useQuery(api.articles.list, { limit: 4 });
  const toggleLike = useMutation(api.articles.toggleLike);
  const addComment = useMutation(api.articles.addComment);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [visitorId] = useState(getVisitorId);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentName, setCommentName] = useState(() => localStorage.getItem("_comment_name") || "");
  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);

  // Check if visitor has liked this article
  const hasLiked = useQuery(
    api.articles.hasLiked,
    article?._id ? { articleId: article._id, visitorId } : "skip"
  );

  useEffect(() => {
    if (hasLiked !== undefined) setLiked(hasLiked);
  }, [hasLiked]);

  useEffect(() => {
    if (article?.likeCount !== undefined) setLikeCount(article.likeCount);
  }, [article?.likeCount]);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set document title and meta tags
  useEffect(() => {
    if (article) {
      document.title = article.metaTitle || `${article.title} — ${siteName}`;
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
      meta.content = article.metaDescription || article.excerpt;
      const ogTags: Record<string, string> = {
        "og:title": article.metaTitle || article.title,
        "og:description": article.metaDescription || article.excerpt,
        "og:type": "article",
        "og:url": `${siteUrl}/blog/${article.slug}`,
        "og:image": article.heroImage || "",
        "article:published_time": new Date(article.publishedAt).toISOString(),
      };
      Object.entries(ogTags).forEach(([prop, content]) => {
        let tag = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement;
        if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", prop); document.head.appendChild(tag); }
        tag.content = content;
      });
    }
  }, [article, siteName, siteUrl]);

  const handleLike = useCallback(async () => {
    if (!article?._id) return;
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? Math.max(0, prev - 1) : prev + 1));
    try {
      await toggleLike({ articleId: article._id, visitorId });
    } catch {
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : Math.max(0, prev - 1)));
    }
  }, [article?._id, liked, toggleLike, visitorId]);

  const handleComment = useCallback(async () => {
    if (!article?._id || !commentText.trim() || !commentName.trim()) return;
    setCommentSubmitting(true);
    try {
      localStorage.setItem("_comment_name", commentName.trim());
      await addComment({
        articleId: article._id,
        name: commentName.trim(),
        content: commentText.trim(),
        visitorId,
      });
      setCommentText("");
    } catch (e) {
      console.error("Comment failed:", e);
    } finally {
      setCommentSubmitting(false);
    }
  }, [article?._id, commentName, commentText, addComment, visitorId]);

  if (article === undefined) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-blue-400 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold text-white">Article Not Found</h1>
        <p className="text-gray-400 text-center max-w-md">The article you're looking for may have been moved or no longer exists.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/15 transition-all">
          <ArrowLeft className="w-4 h-4" /> Browse All Articles
        </Link>
      </div>
    );
  }

  const shareUrl = `${siteUrl}/blog/${article.slug}`;
  const shareTitle = encodeURIComponent(article.title);
  // shareDesc available if needed: encodeURIComponent(article.excerpt || "")
  const relatedArticles = (articles || []).filter((a: any) => a.slug !== article.slug).slice(0, 3);
  const comments = article.comments || [];

  // Social share destinations
  const shareLinks = [
    { name: "Facebook", icon: "fb", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${shareTitle}`, color: "#1877F2" },
    { name: "LinkedIn", icon: "li", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, color: "#0A66C2" },
    { name: "X / Twitter", icon: "tw", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`, color: "#000" },
    { name: "WhatsApp", icon: "wa", url: `https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`, color: "#25D366" },
    { name: "Reddit", icon: "rd", url: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${shareTitle}`, color: "#FF4500" },
    { name: "Telegram", icon: "tg", url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`, color: "#0088CC" },
    { name: "Email", icon: "em", url: `mailto:?subject=${shareTitle}&body=Check%20out%20this%20article:%20${encodeURIComponent(shareUrl)}`, color: "#6B7280" },
  ];

  function getSocialIcon(icon: string) {
    const icons: Record<string, string> = {
      fb: "M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.02 10.12 11.93v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8v8.44C19.61 23.09 24 18.09 24 12.07",
      li: "M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z",
      tw: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      wa: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
      rd: "M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 000-.462.342.342 0 00-.461 0c-.536.536-1.726.735-2.5.735-.774 0-1.965-.2-2.5-.735a.366.366 0 00-.23-.095z",
      tg: "M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
      em: "M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z",
    };
    return icons[icon] || "";
  }

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Navigation */}
      {showNav && <ArticleNavBar siteName={siteName} siteUrl={siteUrl} accentColor={accentColor} ctaUrl={ctaUrl} ctaText={ctaText} />}

      {/* Reading progress bar */}
      <div className="fixed left-0 right-0 h-1" style={{ top: showNav ? "64px" : 0, zIndex: 49, background: "rgba(255,255,255,0.05)" }}>
        <div className="h-full transition-[width] duration-150 ease-out" style={{ width: `${scrollProgress}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }} />
      </div>

      {/* Schema.org JSON-LD */}
      {article.schemaMarkup && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: article.schemaMarkup }} />
      )}

      {/* Hero section with image */}
      <div className="relative">
        {article.heroImage ? (
          <>
            <div className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
              <img src={article.heroImage} alt={article.heroImageAlt || article.title} className="w-full h-full object-cover" loading="eager" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,22,40,0.3) 0%, rgba(10,22,40,0.6) 50%, rgba(10,22,40,1) 100%)" }} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 pb-12 md:pb-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors mb-6 backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
                </Link>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm" style={{ backgroundColor: `${accentColor}cc`, color: "#fff" }}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-white/70"><Clock className="w-3.5 h-3.5" /> {article.readTime} min read</span>
                  <span className="flex items-center gap-1 text-sm text-white/70"><Calendar className="w-3.5 h-3.5" /> {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight">{article.title}</h1>
              </div>
            </div>
          </>
        ) : (
          <div className="pt-24 pb-12 md:pb-16 border-b border-white/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"><ArrowLeft className="w-4 h-4" /> Back to Blog</Link>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${accentColor}22`, color: accentColor }}>{article.category}</span>
                <span className="flex items-center gap-1 text-sm text-gray-500"><Clock className="w-3.5 h-3.5" /> {article.readTime} min read</span>
                <span className="flex items-center gap-1 text-sm text-gray-500"><Calendar className="w-3.5 h-3.5" /> {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight">{article.title}</h1>
            </div>
          </div>
        )}
      </div>

      {/* Author bar + excerpt + engagement */}
      <div className="border-b border-white/10 bg-[#0B1A30]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-lg text-gray-300 mb-6 leading-relaxed italic">{article.excerpt}</p>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/10" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}>
                {article.author?.charAt(0) || "Z"}
              </div>
              <div>
                <div className="text-white text-sm font-semibold">{article.author || "Zach Garner"}</div>
                <div className="text-gray-500 text-xs">{siteName} · Expert Contributor</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Like button */}
              <button onClick={handleLike} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${liked ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"}`}>
                <Heart className={`w-4 h-4 ${liked ? "fill-red-400" : ""}`} />
                <span>{likeCount > 0 ? likeCount : ""}</span>
                <span className="hidden sm:inline">{liked ? "Liked" : "Like"}</span>
              </button>
              {/* Comment scroll */}
              <button onClick={() => commentsRef.current?.scrollIntoView({ behavior: "smooth" })} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5 transition-all">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length > 0 ? comments.length : ""}</span>
                <span className="hidden sm:inline">Comment{comments.length !== 1 ? "s" : ""}</span>
              </button>
              {/* Share button */}
              <div className="relative">
                <button onClick={() => setShowShareMenu(!showShareMenu)} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5 transition-all">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                {/* Share dropdown */}
                {showShareMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl bg-[#1a2744] border border-white/10 shadow-2xl overflow-hidden">
                      <div className="p-3 border-b border-white/10">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Share this article</p>
                      </div>
                      {shareLinks.map((link) => (
                        <a key={link.name} href={link.url} target={link.name === "Email" ? "_self" : "_blank"} rel="noopener noreferrer" onClick={() => setShowShareMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${link.color}22` }}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={link.color}><path d={getSocialIcon(link.icon)} /></svg>
                          </div>
                          {link.name}
                        </a>
                      ))}
                      <button onClick={() => { navigator.clipboard.writeText(shareUrl); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); setShowShareMenu(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors w-full border-t border-white/10">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10">
                          <Link2 className="w-4 h-4 text-gray-400" />
                        </div>
                        {copySuccess ? "✓ Link Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article content */}
      <article ref={articleRef} className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <style dangerouslySetInnerHTML={{ __html: `
          .article-body { font-family: 'Georgia', 'Times New Roman', serif; }
          .article-body p { margin-bottom: 1.75em; color: #cbd5e1; line-height: 1.95; font-size: 1.125rem; letter-spacing: 0.01em; }
          .article-body p:first-of-type::first-letter { float: left; font-size: 3.5em; line-height: 0.8; font-weight: 700; color: ${accentColor}; margin: 0.05em 0.12em 0 0; font-family: 'Georgia', serif; }
          .article-body h2 { font-family: system-ui, -apple-system, sans-serif; font-size: 1.85rem; font-weight: 800; color: #f1f5f9; margin-top: 3em; margin-bottom: 1em; line-height: 1.25; padding-left: 16px; border-left: 4px solid ${accentColor}; letter-spacing: -0.02em; }
          .article-body h3 { font-family: system-ui, -apple-system, sans-serif; font-size: 1.35rem; font-weight: 700; color: #e2e8f0; margin-top: 2.5em; margin-bottom: 0.75em; line-height: 1.35; letter-spacing: -0.01em; }
          .article-body ul, .article-body ol { margin-bottom: 1.75em; padding-left: 1.5em; color: #cbd5e1; }
          .article-body li { margin-bottom: 0.85em; line-height: 1.8; font-size: 1.08rem; }
          .article-body li strong, .article-body strong { color: #f1f5f9; }
          .article-body a { color: ${accentColor}; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: ${accentColor}44; }
          .article-body a:hover { text-decoration-color: ${accentColor}; }
          .article-body blockquote { border-left: 4px solid ${accentColor}; padding: 1.5em 2em; margin: 2em 0; background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border-radius: 0 16px 16px 0; color: #94a3b8; font-style: italic; font-size: 1.15em; line-height: 1.8; position: relative; }
          .article-body blockquote::before { content: '\\201C'; position: absolute; top: -10px; left: 16px; font-size: 4em; color: ${accentColor}33; font-family: Georgia, serif; line-height: 1; }
          .article-body img { max-width: 100%; height: auto; border-radius: 16px; margin: 2em 0; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
          .article-body hr { border: none; height: 1px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent); margin: 3em 0; }
          .article-body .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 2em 0; border-radius: 12px; }
          .article-body table { width: 100%; border-collapse: separate; border-spacing: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.25); min-width: 480px; background: #0d2137; }
          .article-body thead th { background: linear-gradient(135deg, #1e3a5f, #1e40af); color: #ffffff; padding: 14px 18px; text-align: left; font-weight: 700; font-size: 0.85em; text-transform: uppercase; letter-spacing: 0.06em; font-family: system-ui, sans-serif; white-space: nowrap; }
          .article-body tbody tr { background: #0d2137; }
          .article-body tbody tr:nth-child(even) { background: #0f2a45; }
          .article-body td { padding: 13px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); color: #e2e8f0; font-size: 0.95em; font-family: system-ui, sans-serif; line-height: 1.5; }
          .article-body td:first-child { color: #f1f5f9; font-weight: 600; }
          .article-body tbody tr:hover td { background: rgba(255,255,255,0.06); }
          .article-body tbody tr:last-child td { border-bottom: none; }
          .article-body .comparison-table { background: #0d2137; }
          .article-body .comparison-table tbody td { color: #e2e8f0; border-bottom: 1px solid rgba(255,255,255,0.08); }
          .article-body .comparison-table tbody tr { background: #0d2137; }
          .article-body .comparison-table tbody tr:nth-child(even) { background: #0f2a45; }
          .article-body .comparison-table tbody tr:hover { background: rgba(255,255,255,0.06); }
          .article-body .comparison-table tbody td:first-child { color: #f1f5f9; font-weight: 600; }
          .article-body .stat-card .stat-number { color: #60a5fa; }
          .article-body .stat-card .stat-label { color: #94a3b8; }
          .article-body .stat-card .stat-source { color: #475569; }
          .article-body .stat-card { background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.08); }
          .article-body .pro-tip { background: linear-gradient(135deg, rgba(234,179,8,0.1), rgba(234,179,8,0.04)); }
          .article-body .pro-tip strong { color: #fbbf24; }
          .article-body .pro-tip p, .article-body .pro-tip { color: #fde68a; }
          .article-body .info-box { background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.08); }
          .article-body .info-box h4 { color: #f1f5f9; }
          .article-body .warning-box { background: linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.04)); color: #fed7aa; }
          .article-body .warning-box strong { color: #fb923c; }
          .article-body .toc-box { background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.08); }
          .article-body .toc-box h4 { color: #f1f5f9; }
          .article-body .toc-box li { color: #cbd5e1; }
          .article-body .toc-box a { color: #60a5fa; }
          .article-body .author-box { background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.08); }
          .article-body .author-box .author-info h4 { color: #f1f5f9; }
          .article-body .author-box .author-info p { color: #94a3b8; }
          @media (prefers-color-scheme: light) {
            .article-body table { background: #ffffff; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
            .article-body thead th { background: linear-gradient(135deg, #1e3a5f, #1e40af); color: #ffffff; }
            .article-body tbody tr { background: #ffffff; }
            .article-body tbody tr:nth-child(even) { background: #f8fafc; }
            .article-body td { color: #1e293b; border-bottom-color: #e2e8f0; }
            .article-body td:first-child { color: #0f172a; }
            .article-body tbody tr:hover td { background: #f1f5f9; }
          }
          .article-body .faq-section { margin-top: 1.5em; }
          .article-body .faq-item { margin-bottom: 1em; padding: 1.5em 2em; background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); transition: border-color 0.3s; }
          .article-body .faq-item:hover { border-color: ${accentColor}44; }
          .article-body .faq-item h3 { margin-top: 0; margin-bottom: 0.5em; font-size: 1.1rem; color: #f1f5f9; font-family: system-ui, sans-serif; }
          .article-body .faq-item p { margin-bottom: 0; font-size: 1rem; }
          .article-body .key-takeaways { background: linear-gradient(135deg, ${accentColor}12, ${accentColor}06); border: 1px solid ${accentColor}22; border-radius: 16px; padding: 28px 32px; margin: 2.5em 0; position: relative; overflow: hidden; }
          .article-body .key-takeaways::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, ${accentColor}, ${accentColor}44); }
          .article-body .key-takeaways h3 { margin: 0 0 16px; color: ${accentColor}; font-size: 1.05em; border: none; padding: 0; font-family: system-ui, sans-serif; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 800; }
          .article-body .key-takeaways ul { margin: 0; padding-left: 20px; }
          .article-body .key-takeaways li { margin-bottom: 10px; color: #cbd5e1; font-size: 1rem; }
          .article-body .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin: 2.5em 0; }
          .article-body .stat-card { background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 28px 20px; text-align: center; position: relative; overflow: hidden; transition: transform 0.3s; }
          .article-body .stat-card:hover { transform: translateY(-2px); border-color: ${accentColor}44; }
          .article-body .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, ${accentColor}66, transparent); }
          .article-body .stat-card .stat-number { font-size: 2.2em; font-weight: 900; background: linear-gradient(135deg, ${accentColor}, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; font-family: system-ui, sans-serif; }
          .article-body .stat-card .stat-label { font-size: 0.88em; color: #94a3b8; margin-top: 10px; line-height: 1.4; font-family: system-ui, sans-serif; }
          .article-body .stat-card .stat-source { font-size: 0.72em; color: #475569; margin-top: 8px; font-style: italic; }
          .article-body .pro-tip { background: linear-gradient(135deg, rgba(234,179,8,0.1), rgba(234,179,8,0.04)); border: 1px solid rgba(234,179,8,0.2); border-radius: 16px; padding: 24px 28px; margin: 2em 0; position: relative; overflow: hidden; }
          .article-body .pro-tip::before { content: '💡'; position: absolute; top: -8px; right: 16px; font-size: 2.5em; opacity: 0.15; }
          .article-body .pro-tip strong { color: #fbbf24; font-family: system-ui, sans-serif; }
          .article-body .pro-tip p, .article-body .pro-tip { color: #fde68a; font-size: 1rem; }
          .article-body .cta-banner { background: linear-gradient(135deg, ${accentColor}18, ${accentColor}08); border: 1px solid ${accentColor}33; border-radius: 20px; padding: 40px 36px; text-align: center; margin: 3em 0; position: relative; overflow: hidden; }
          .article-body .cta-banner::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, ${accentColor}15, transparent 70%); }
          .article-body .cta-banner h3 { color: #f1f5f9; margin: 0 0 12px; font-size: 1.5em; border: none; padding: 0; font-family: system-ui, sans-serif; position: relative; }
          .article-body .cta-banner p { color: #94a3b8; margin: 0 0 24px; position: relative; font-size: 1.05em; }
          .article-body .cta-banner a { display: inline-block; background: ${accentColor}; color: #fff; padding: 16px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 1.05em; font-family: system-ui, sans-serif; position: relative; box-shadow: 0 4px 16px ${accentColor}44; transition: transform 0.2s; }
          .article-body .cta-banner a:hover { transform: translateY(-2px); }
          .article-body .toc-box { background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px 32px; margin: 2em 0; }
          .article-body .toc-box h4 { margin: 0 0 16px; color: #f1f5f9; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.08em; font-family: system-ui, sans-serif; font-weight: 700; }
          .article-body .toc-box ol { margin: 0; padding-left: 20px; counter-reset: toc; list-style: none; }
          .article-body .toc-box li { margin-bottom: 8px; counter-increment: toc; padding-left: 8px; }
          .article-body .toc-box li::before { content: counter(toc) "."; color: ${accentColor}; font-weight: 700; margin-right: 8px; }
          .article-body .toc-box a { color: #94a3b8; text-decoration: none; }
          .article-body .toc-box a:hover { color: ${accentColor}; }
          .article-body .author-box { display: flex; align-items: center; gap: 20px; background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); border-radius: 16px; padding: 24px 28px; margin: 3em 0; border: 1px solid rgba(255,255,255,0.08); }
          .article-body .author-box .author-avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, ${accentColor}, ${accentColor}88); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 1.4em; flex-shrink: 0; }
          .article-body .author-box .author-info h4 { margin: 0 0 4px; color: #f1f5f9; font-size: 1.05rem; border: none; padding: 0; font-family: system-ui, sans-serif; }
          .article-body .author-box .author-info p { margin: 0; color: #94a3b8; font-size: 0.9em; line-height: 1.5; }
          .article-body .article-hero-img { width: 100%; max-height: 450px; object-fit: cover; border-radius: 16px; margin-bottom: 2em; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
          .article-body .article-hero-caption { text-align: center; font-size: 0.82em; color: #475569; margin-top: -1.5em; margin-bottom: 2em; font-style: italic; font-family: system-ui, sans-serif; }
          .article-body .warning-box { background: linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.04)); border: 1px solid rgba(249,115,22,0.2); border-radius: 16px; padding: 24px 28px; margin: 2em 0; color: #fed7aa; }
          .article-body .info-box { background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px 28px; margin: 2em 0; }
          .article-body .info-box h4 { margin: 0 0 10px; color: #f1f5f9; border: none; padding: 0; font-family: system-ui, sans-serif; }
          @media (max-width: 640px) {
            .article-body p { font-size: 1rem; line-height: 1.85; margin-bottom: 1.5em; }
            .article-body p:first-of-type::first-letter { font-size: 2.8em; }
            .article-body h2 { font-size: 1.45rem; margin-top: 2.5em; padding-left: 12px; }
            .article-body h3 { font-size: 1.15rem; }
            .article-body li { font-size: 0.95rem; }
            .article-body .stat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
            .article-body .stat-card { padding: 20px 14px; }
            .article-body .stat-card .stat-number { font-size: 1.6em; }
            .article-body .cta-banner { padding: 28px 20px; }
            .article-body .author-box { flex-direction: column; text-align: center; gap: 12px; }
            .article-body .article-hero-img { max-height: 250px; border-radius: 12px; }
            .article-body table { min-width: 420px; }
            .article-body thead th { padding: 10px 12px; font-size: 0.78em; }
            .article-body td { padding: 10px 12px; font-size: 0.88em; }
          }
        `}} />

        <div className="article-body max-w-none" dangerouslySetInnerHTML={{ __html: (article.content || "").replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<table/g, '<div class="table-wrapper"><table').replace(/<\/table>/g, "</table></div>") }} />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold" style={{ fontFamily: "system-ui, sans-serif" }}>Topics</p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <span key={tag} className="px-4 py-1.5 rounded-full text-xs bg-white/5 text-gray-400 border border-white/5">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Engagement bar (mobile-friendly) */}
        <div className="mt-10 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={handleLike} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${liked ? "bg-red-500/20 text-red-400 border border-red-500/30 scale-105" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"}`}>
                <Heart className={`w-5 h-5 ${liked ? "fill-red-400" : ""}`} />
                {likeCount > 0 ? `${likeCount} Like${likeCount !== 1 ? "s" : ""}` : "Like this article"}
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center" style={{ fontFamily: "system-ui, sans-serif" }}>
              Found this helpful? Share it with your network ↓
            </p>
          </div>
          {/* Full social share row */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 pt-4 border-t border-white/10">
            {shareLinks.map((link) => (
              <a key={link.name} href={link.url} target={link.name === "Email" ? "_self" : "_blank"} rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-white transition-all hover:scale-105 hover:shadow-lg" style={{ backgroundColor: link.color }} title={`Share on ${link.name}`}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d={getSocialIcon(link.icon)} /></svg>
                <span className="hidden sm:inline">{link.name}</span>
              </a>
            ))}
            <button onClick={() => { navigator.clipboard.writeText(shareUrl); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition-all">
              <Link2 className="w-3.5 h-3.5" />
              {copySuccess ? "✓ Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl border border-white/10 overflow-hidden" style={{ background: `linear-gradient(135deg, ${accentColor}10, ${accentColor}05)` }}>
          <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}66)` }} />
          <div className="p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "system-ui, sans-serif", letterSpacing: "-0.02em" }}>Ready to Take the Next Step?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">{article.ctaText || `Join ${siteName} today and start building your future.`}</p>
            <a href={article.ctaUrl || ctaUrl} className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-bold text-lg transition-all hover:scale-[1.02]" style={{ backgroundColor: accentColor, boxShadow: `0 4px 20px ${accentColor}44`, fontFamily: "system-ui, sans-serif" }}>
              {ctaText} <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Comments section */}
        <div ref={commentsRef} className="mt-16 pt-8 border-t border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: "system-ui, sans-serif" }}>
            <MessageCircle className="w-5 h-5" style={{ color: accentColor }} />
            Discussion ({comments.length})
          </h3>

          {/* Comment form */}
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-5 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <input type="text" placeholder="Your name" value={commentName} onChange={(e) => setCommentName(e.target.value)} className="flex-1 bg-transparent border-b border-white/10 text-white placeholder-gray-500 py-2 focus:outline-none focus:border-white/30 text-sm" maxLength={100} />
            </div>
            <textarea placeholder="Share your thoughts on this article..." value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={3} className="w-full bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-gray-500 p-3 focus:outline-none focus:border-white/20 text-sm resize-none" maxLength={2000} />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-600">{commentText.length}/2000</span>
              <button onClick={handleComment} disabled={commentSubmitting || !commentText.trim() || !commentName.trim()} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.02]" style={{ backgroundColor: accentColor }}>
                <Send className="w-4 h-4" />
                {commentSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>

          {/* Comments list */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment: any) => (
                <div key={comment._id} className="rounded-xl bg-white/[0.02] border border-white/5 p-5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${accentColor}88, ${accentColor}44)` }}>
                      {comment.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <span className="text-white text-sm font-semibold" style={{ fontFamily: "system-ui, sans-serif" }}>{comment.name}</span>
                      <span className="text-gray-600 text-xs ml-2">
                        {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed pl-12">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <MessageCircle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Be the first to share your thoughts on this article.</p>
            </div>
          )}
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "system-ui, sans-serif" }}>Continue Reading</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedArticles.map((related: any) => (
                <Link key={related._id} to={`/blog/${related.slug}`} className="group block rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all overflow-hidden">
                  {related.heroImage && (
                    <div className="h-36 overflow-hidden">
                      <img src={related.heroImage} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>{related.category}</span>
                    <h4 className="text-sm font-semibold text-white mt-2 line-clamp-2 group-hover:text-blue-300 transition-colors" style={{ fontFamily: "system-ui, sans-serif" }}>{related.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{related.readTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Back to top */}
      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center shadow-lg">
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
