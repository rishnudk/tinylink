import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
  try {
    const { url } = await req.json();

    // 1. Input validation
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid URL" },
        { status: 400 }
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // 2. Get or create sessionId
    const sessionId = await getSessionId();

    // 3. Generate shortId
    const shortId = nanoid(8);

    // 4. Store in database
    const newUrl = await prisma.url.create({
      data: {
        originalUrl: url,
        shortId,
        sessionId,
      },
    });

    // 5. Return response
    return NextResponse.json({
      success: true,
      data: newUrl,
    });
  } catch (err) {
    console.error("POST /api/shorten error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

