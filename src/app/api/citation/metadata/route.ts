import { NextResponse } from "next/server";
import { getDefaultNetwork } from "@/lib/citation-network/openalex";
import { citationErrorResponse } from "../route-helpers";

export const revalidate = 3600;

export async function GET() {
  try {
    const network = await getDefaultNetwork();
    return NextResponse.json({
      metadata: network.metadata,
      clusters: network.clusters,
      total_papers: network.papers.length,
    });
  } catch (error) {
    return citationErrorResponse(error);
  }
}
