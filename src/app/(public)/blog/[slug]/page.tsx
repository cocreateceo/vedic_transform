import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog-posts";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  body: { bg: "bg-red-500/20", text: "text-red-300" },
  mind: { bg: "bg-purple-500/20", text: "text-purple-300" },
  spirit: { bg: "bg-amber-500/20", text: "text-amber-300" },
  science: { bg: "bg-blue-500/20", text: "text-blue-300" },
  lifestyle: { bg: "bg-green-500/20", text: "text-green-300" },
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
  return {
    title: post.title,
    description: post.excerpt,
  };
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
    <div className="text-[#e2e8f0]">
      {/* Article Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0d08] to-[#1a1508] py-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <span
            className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${cat.bg} ${cat.text} font-medium mb-4`}
          >
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
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
      <section className="py-12 bg-[#0f0d08]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article
            className="prose prose-invert prose-lg max-w-none
              prose-p:text-[#c4c9d4] prose-p:leading-relaxed prose-p:mb-6
              prose-headings:text-white prose-headings:font-bold
              prose-a:text-orange-400 prose-a:no-underline hover:prose-a:text-orange-300
              prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-[#0f0d08] to-[#1a1508]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              Related{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Articles
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rp) => {
                const rc = categoryColors[rp.category] || categoryColors.mind;
                return (
                  <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block">
                    <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-orange-500/30 transition-all">
                      <span
                        className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${rc.bg} ${rc.text} font-medium mb-3`}
                      >
                        {rp.category.charAt(0).toUpperCase() + rp.category.slice(1)}
                      </span>
                      <h3 className="text-white font-semibold mb-2 group-hover:text-orange-300 transition-colors line-clamp-2">
                        {rp.title}
                      </h3>
                      <p className="text-sm text-[#94a3b8] leading-relaxed line-clamp-2 mb-3">
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
