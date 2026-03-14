import { BlogPageClient } from "./blog-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog — Vedic Wisdom & Insights" };

export default function BlogPage() {
  return <BlogPageClient />;
}
