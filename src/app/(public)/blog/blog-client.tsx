"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Calendar, BookOpen, Brain, Sparkles, Dumbbell, FlaskConical, Leaf } from "lucide-react";
import { BLOG_POSTS, type BlogPost } from "@/data/blog-posts";

const categories = [
  { key: "all", label: "All" },
  { key: "body", label: "Body", icon: Dumbbell },
  { key: "mind", label: "Mind", icon: Brain },
  { key: "spirit", label: "Spirit", icon: Sparkles },
  { key: "science", label: "Science", icon: FlaskConical },
  { key: "lifestyle", label: "Lifestyle", icon: Leaf },
] as const;

const categoryColors: Record<string, { bg: string; text: string; thumbnail: string }> = {
  body: { bg: "bg-red-500/20", text: "text-red-300", thumbnail: "from-red-900/60 to-red-800/30" },
  mind: { bg: "bg-purple-500/20", text: "text-purple-300", thumbnail: "from-purple-900/60 to-purple-800/30" },
  spirit: { bg: "bg-amber-500/20", text: "text-amber-300", thumbnail: "from-amber-900/60 to-amber-800/30" },
  science: { bg: "bg-blue-500/20", text: "text-blue-300", thumbnail: "from-blue-900/60 to-blue-800/30" },
  lifestyle: { bg: "bg-green-500/20", text: "text-green-300", thumbnail: "from-green-900/60 to-green-800/30" },
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  body: Dumbbell,
  mind: Brain,
  spirit: Sparkles,
  science: FlaskConical,
  lifestyle: Leaf,
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ArticleCard({ post }: { post: BlogPost }) {
  const cat = categoryColors[post.category];
  const Icon = categoryIcons[post.category];

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-orange-500/30 transition-all overflow-hidden">
        {/* Thumbnail placeholder */}
        <div className={`h-40 bg-gradient-to-br ${cat.thumbnail} flex items-center justify-center`}>
          {Icon && <Icon className="w-12 h-12 text-white/30" />}
        </div>

        <div className="p-5">
          {/* Category badge */}
          <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${cat.bg} ${cat.text} font-medium mb-3`}>
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </span>

          <h3 className="text-white font-semibold mb-2 group-hover:text-orange-300 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-[#94a3b8] leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 text-xs text-[#64748b]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.date)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function BlogPageClient() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const featuredCat = featured ? categoryColors[featured.category] : null;
  const FeaturedIcon = featured ? categoryIcons[featured.category] : null;

  return (
    <div className="text-[#e2e8f0]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0a1e] to-[#1a1145] py-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/15 border border-orange-500/20 text-orange-300 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Vedic Wisdom &amp; Insights
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">
            Explore the intersection of ancient Vedic wisdom and modern science
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="bg-[#0f0a1e] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                    : "bg-white/[0.05] text-[#94a3b8] hover:bg-white/[0.1] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#0f0a1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <p className="text-center text-[#94a3b8] py-20">
              No articles found in this category yet. Check back soon.
            </p>
          ) : (
            <>
              {/* Featured Article */}
              {featured && featuredCat && (
                <Link href={`/blog/${featured.slug}`} className="group block mb-12">
                  <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-orange-500/30 transition-all overflow-hidden md:flex">
                    <div
                      className={`md:w-2/5 h-56 md:h-auto bg-gradient-to-br ${featuredCat.thumbnail} flex items-center justify-center`}
                    >
                      {FeaturedIcon && <FeaturedIcon className="w-20 h-20 text-white/20" />}
                    </div>
                    <div className="p-8 md:w-3/5 flex flex-col justify-center">
                      <span
                        className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${featuredCat.bg} ${featuredCat.text} font-medium mb-3 w-fit`}
                      >
                        {featured.category.charAt(0).toUpperCase() + featured.category.slice(1)}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-[#94a3b8] leading-relaxed mb-4">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-[#64748b]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featured.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(featured.date)}
                        </span>
                        <span className="text-[#94a3b8]">by {featured.author}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Article Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <ArticleCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
