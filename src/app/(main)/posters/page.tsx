import { PostersGallery } from "./posters-gallery";

// Force dynamic rendering through the server Lambda. The default static
// prerender produced an S3 asset that CloudFront's OpenNext routing
// couldn't resolve (returned AccessDenied on /posters). All other (main)
// routes also go through the Lambda; this keeps the behaviour consistent.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Teaching Posters — Vedic Transform",
  description:
    "Browsable archive of Vedic teaching posters rooted in Patanjali's Yoga Sutras and Ayurvedic principles.",
};

export default function PostersPage() {
  return <PostersGallery />;
}
