import { NextRequest, NextResponse } from "next/server";
import { previewAuthor } from "@/lib/citation-network/openalex";
import { citationErrorResponse } from "../route-helpers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query")?.trim();
    const offset = Number(request.nextUrl.searchParams.get("offset") || "0");
    if (!query) {
      return NextResponse.json(
        { detail: "Enter an author name, ORCID, or OpenAlex URL." },
        { status: 400 }
      );
    }
    const preview = await previewAuthor(query, Number.isNaN(offset) ? 0 : offset);
    return NextResponse.json(preview);
  } catch (error) {
    return citationErrorResponse(error);
  }
}
