import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const sessionId = await getSessionId();
    const { id } = await context.params;

    const link = await prisma.url.findFirst({
      where: { id, sessionId },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: link,
    });
  } catch (err) {
    console.error("GET /api/links/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const sessionId = await getSessionId();
    const { id } = await context.params;

    console.log("🔍 [Delete API] Deleting link with id:", id);

    // Verify that this link belongs to the current user
    const link = await prisma.url.findFirst({
      where: { id, sessionId },
    });

    if (!link) {
      console.log("❌ [Delete API] Link not found or unauthorized");
      return NextResponse.json(
        { error: "Link not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.url.delete({
      where: { id },
    });

    console.log("✅ [Delete API] Link deleted successfully");

    return NextResponse.json({
      success: true,
      message: "Link deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /api/links/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
