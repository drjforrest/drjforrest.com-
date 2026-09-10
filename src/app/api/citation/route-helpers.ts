import { NextResponse } from "next/server";
import { CitationNetworkError } from "@/lib/citation-network/openalex";

export function citationErrorResponse(error: unknown) {
  if (error instanceof CitationNetworkError) {
    return NextResponse.json(
      { detail: error.message },
      { status: error.status }
    );
  }
  const message = error instanceof Error ? error.message : "Citation network error";
  return NextResponse.json({ detail: message }, { status: 500 });
}
