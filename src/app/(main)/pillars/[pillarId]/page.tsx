import { PILLARS } from "@/constants/pillars";
import { PillarDetailClient } from "./pillar-detail-client";

export function generateStaticParams() {
  return PILLARS.map((pillar) => ({ pillarId: pillar.slug }));
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ pillarId: string }>;
}) {
  const { pillarId } = await params;
  return <PillarDetailClient pillarId={pillarId} />;
}
