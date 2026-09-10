import { NextRequest, NextResponse } from "next/server";
import { buildAuthorNetwork } from "@/lib/citation-network/openalex";
import { citationErrorResponse } from "../route-helpers";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const authorId = request.nextUrl.searchParams.get("author_id")?.trim();
    if (!authorId) {
      return NextResponse.json(
        { detail: "Missing author_id." },
        { status: 400 }
      );
    }
    const network = await buildAuthorNetwork(authorId);
    return NextResponse.json(network);
  } catch (error) {
    return citationErrorResponse(error);
  }
}
