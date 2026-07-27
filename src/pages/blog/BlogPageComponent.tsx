import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search, ArrowLeft } from "lucide-react";

// SEO: inject JSON-LD for Blog listing
function BlogListingSchema({ siteUrl, siteName }: { siteUrl: string; siteName: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteName} Blog`,
    url: `${siteUrl}/blog`,
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

interface BlogPageProps {
  siteName: string;
  siteUrl: string;
  accentColor?: string;
  ctaUrl?: string;
  ctaText?: string;
  showNav?: boolean;
}

/* ── Shared navigation bar for blog pages ── */
function BlogNavBar({ siteName, siteUrl, accentColor, ctaUrl, ctaText }: { siteName: string; siteUrl: string; accentColor: string; ctaUrl: string; ctaText: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ background: "rgba(10,22,40,0.92)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo / Site Name */}
        <a href={siteUrl} className="flex items-center gap-2.5 text-white font-extrabold text-lg tracking-tight hover:opacity-90 transition-opacity" style={{ letterSpacing: "-0.02em" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}>
            {siteName.charAt(0)}
          </div>
          <span className="hidden sm:inline">{siteName}</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <a href={siteUrl} className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Home</a>
          <Link to="/blog" className="text-sm font-medium transition-colors" style={{ color: accentColor }}>Blog</Link>
          <a href={ctaUrl} className="ml-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 shadow-lg" style={{ backgroundColor: accentColor, boxShadow: `0 4px 14px ${accentColor}44` }}>
            {ctaText}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-400 hover:text-white transition-colors" aria-label="Menu">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>

      {/* Mobile menu */}
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

export function BlogPage({
  siteName,
  siteUrl,
  accentColor = "#3B82F6",
  ctaUrl = "/signup",
  ctaText = "Get Started Free",
  showNav = true,
}: BlogPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const result = useQuery(api.articles.list, {
    category: selectedCategory ?? undefined,
    limit: 50,
  });
  const articles = result ?? [];

  useEffect(() => {
    document.title = `Expert Insights & Resources — ${siteName} Blog`;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = `Expert articles, guides, and insights from ${siteName}. Stay informed with the latest strategies and industry knowledge.`;
  }, [siteName]);

  const categories = Array.from(new Set(articles.map((a: any) => a.category).filter(Boolean)));
  const filtered = searchQuery
    ? articles.filter((a: any) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  // Featured article = first one
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <BlogListingSchema siteUrl={siteUrl} siteName={siteName} />

      {/* Navigation */}
      {showNav && <BlogNavBar siteName={siteName} siteUrl={siteUrl} accentColor={accentColor} ctaUrl={ctaUrl} ctaText={ctaText} />}

      {/* Header */}
      <div className="border-b border-white/10" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to {siteName}
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: accentColor }}>{siteName}</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                Expert Insights & Resources
              </h1>
              <p className="text-gray-400 mt-3 text-lg max-w-xl">In-depth articles, strategies, and expert guidance to help you succeed.</p>
            </div>
            <div className="relative w-full md:w-80 flex-shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all text-sm"
              />
            </div>
          </div>

          {/* Category filters */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-8">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory ? "text-white shadow-lg" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
                style={!selectedCategory ? { backgroundColor: accentColor, boxShadow: `0 4px 12px ${accentColor}44` } : {}}
              >
                All Articles
              </button>
              {categories.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat ? "text-white shadow-lg" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                  style={selectedCategory === cat ? { backgroundColor: accentColor, boxShadow: `0 4px 12px ${accentColor}44` } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Featured article (large card) */}
        {featured && (
          <Link to={`/blog/${featured.slug}`} className="group block mb-12">
            <div className="relative rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
              <div className="grid md:grid-cols-2">
                {featured.heroImage && (
                  <div className="h-64 md:h-full min-h-[300px] overflow-hidden">
                    <img src={featured.heroImage} alt={featured.heroImageAlt || featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="eager" />
                  </div>
                )}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${accentColor}22`, color: accentColor }}>
                      {featured.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {featured.readTime} min
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 group-hover:text-blue-300 transition-colors leading-tight" style={{ letterSpacing: "-0.02em" }}>
                    {featured.title}
                  </h2>
                  <p className="text-gray-400 mb-6 line-clamp-3 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)` }}>
                        {featured.author?.charAt(0) || "Z"}
                      </div>
                      <span className="text-sm text-gray-400">{featured.author || "Zach Garner"}</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: accentColor }}>
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Article grid */}
        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article: any) => (
              <Link key={article._id} to={`/blog/${article.slug}`} className="group block rounded-xl border border-white/5 hover:border-white/10 overflow-hidden transition-all hover:transform hover:translate-y-[-2px]" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
                {article.heroImage && (
                  <div className="h-48 overflow-hidden">
                    <img src={article.heroImage} alt={article.heroImageAlt || article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime} min
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors leading-snug" style={{ letterSpacing: "-0.01em" }}>
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">{article.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)` }}>
                        {article.author?.charAt(0) || "Z"}
                      </div>
                      <span className="text-xs text-gray-500">{article.author || "Zach Garner"}</span>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
            <p className="text-gray-400">Try adjusting your search or browse all categories.</p>
          </div>
        )}
      </div>
    </div>
  );
}
