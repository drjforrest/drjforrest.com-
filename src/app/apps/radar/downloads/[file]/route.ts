import { createReadStream, existsSync, statSync } from "fs";
import path from "path";
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";
import { isRadarAuthenticated } from "@/lib/radar-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ file: string }> }
) {
  if (!(await isRadarAuthenticated())) {
    return NextResponse.redirect(new URL("/apps/radar", _request.url));
  }

  const { file } = await context.params;
  const safe = path.basename(decodeURIComponent(file));
  if (!safe.toLowerCase().endsWith(".dmg") || safe.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const full = path.join(process.cwd(), "content", "radar-downloads", safe);
  if (!existsSync(full)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const stat = statSync(full);
  const stream = createReadStream(full);
  const webStream = Readable.toWeb(stream) as unknown as ReadableStream;

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": "application/x-apple-diskimage",
      "Content-Length": String(stat.size),
      "Content-Disposition": `attachment; filename="${safe}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
