import { NextResponse } from "next/server";
console.log("🔍 [API Route] Importing prisma from @/lib/prisma...");
import { prisma } from "@/lib/prisma";
console.log("🔍 [API Route] Prisma imported successfully");
import { getSessionId } from "@/lib/session";
import { nanoid } from "nanoid";

// Helper function to validate URLs
function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  console.log("🔍 [API Route] POST /api/shorten called");
  try {
    const { url } = await req.json();
    console.log("🔍 [API Route] Request body parsed, url:", url);

    // 1. Input validation
    if (!url || typeof url !== "string") {
      console.log("❌ [API Route] Validation failed: Missing or invalid URL");
      return NextResponse.json(
        { error: "Missing or invalid URL" },
        { status: 400 }
      );
    }

    if (!isValidUrl(url)) {
      console.log("❌ [API Route] Validation failed: Invalid URL format");
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // 2. Get or create sessionId
    console.log("🔍 [API Route] Getting sessionId...");
    const sessionId = await getSessionId();
    console.log("🔍 [API Route] SessionId:", sessionId);

    // 3. Generate shortId
    const shortId = nanoid(8);
    console.log("🔍 [API Route] Generated shortId:", shortId);

    // 4. Store in database
    console.log("🔍 [API Route] Attempting to create URL in database...");
    const newUrl = await prisma.url.create({
      data: {
        originalUrl: url,
        shortId,
        sessionId,
      },
    });
    console.log("✅ [API Route] URL created successfully:", newUrl);

    // 5. Return response
    return NextResponse.json({
      success: true,
      data: newUrl,
    });
  } catch (err) {
    console.error("❌ [API Route] POST /api/shorten error:", err);
    console.error("❌ [API Route] Error name:", (err as Error).name);
    console.error("❌ [API Route] Error message:", (err as Error).message);
    console.error("❌ [API Route] Error stack:", (err as Error).stack);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

