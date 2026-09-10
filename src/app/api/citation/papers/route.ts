import { NextRequest, NextResponse } from "next/server";
import { getDefaultNetwork } from "@/lib/citation-network/openalex";
import { citationErrorResponse } from "../route-helpers";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const network = await getDefaultNetwork();
    const clusterParam = request.nextUrl.searchParams.get("cluster");
    const limitParam = request.nextUrl.searchParams.get("limit");
    let papers = network.papers;

    if (clusterParam !== null) {
      const cluster = Number(clusterParam);
      if (!Number.isNaN(cluster)) {
        papers = papers.filter((paper) => paper.cluster === cluster);
      }
    }
    if (limitParam) {
      const limit = Number(limitParam);
      if (!Number.isNaN(limit)) papers = papers.slice(0, limit);
    }

    return NextResponse.json({
      papers,
      count: papers.length,
      total_available: network.papers.length,
    });
  } catch (error) {
    return citationErrorResponse(error);
  }
}
