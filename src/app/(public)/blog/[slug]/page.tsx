import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog-posts";
import { pageMetadata, articleLd } from "@/lib/seo";
import { SERIF_CLASS } from "@/lib/fonts";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  body: { bg: "bg-red-500/10", text: "text-red-600" },
  mind: { bg: "bg-purple-500/10", text: "text-purple-600" },
  spirit: { bg: "bg-amber-500/10", text: "text-amber-600" },
  science: { bg: "bg-blue-500/10", text: "text-blue-600" },
  lifestyle: { bg: "bg-green-500/10", text: "text-green-600" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  return pageMetadata({
    title: `${post.title} — 10X Vedic Transform`,
    description: post.excerpt,
    path: `/blog/${slug}`,
    ogTitle: post.title,
    ogImage: `/images/pexels/blog-${post.category}.jpg`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const cat = categoryColors[post.category] || categoryColors.mind;
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="text-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd(post)) }}
      />
      {/* Article Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#1E293B] py-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#FFB366] hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <span
            className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-[#FFD700] font-medium mb-4 uppercase tracking-wider"
          >
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </span>

          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight ${SERIF_CLASS}`}>
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#94a3b8]">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime} read
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-[#FFFEF5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article
            className="prose prose-lg max-w-none
              prose-p:text-[#374151] prose-p:leading-relaxed prose-p:mb-6
              prose-headings:text-[#1a1a1a] prose-headings:font-semibold
              prose-a:text-[#E8860D] prose-a:no-underline hover:prose-a:text-[#FF9933]
              prose-strong:text-[#1a1a1a]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="py-16 bg-[#FFF9F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-2xl sm:text-3xl font-semibold text-[#1a1a1a] mb-8 text-center ${SERIF_CLASS}`}>
              Related <span className="text-[#E8860D]">Articles</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rp) => {
                const rc = categoryColors[rp.category] || categoryColors.mind;
                return (
                  <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block">
                    <div className="p-5 rounded-2xl bg-white border border-[#FF9933]/20 shadow-sm hover:border-orange-500/40 hover:shadow-lg transition-all">
                      <span
                        className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${rc.bg} ${rc.text} font-medium mb-3`}
                      >
                        {rp.category.charAt(0).toUpperCase() + rp.category.slice(1)}
                      </span>
                      <h3 className="text-[#1a1a1a] font-semibold mb-2 group-hover:text-[#E8860D] transition-colors line-clamp-2">
                        {rp.title}
                      </h3>
                      <p className="text-sm text-[#64748b] leading-relaxed line-clamp-2 mb-3">
                        {rp.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#64748b]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {rp.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(rp.date)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
