import { BlogPageClient } from "./blog-client";

export const metadata = { title: "Blog — Vedic Wisdom & Insights" };
export const dynamic = "force-dynamic";

export default function BlogPage() {
  return <BlogPageClient />;
}
