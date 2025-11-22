import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await context.params;

    if (!shortId) {
      return NextResponse.json({ error: "Invalid shortId" }, { status: 400 });
    }

    // 1. Fetch URL from DB
    const record = await prisma.url.findUnique({
      where: { shortId },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Short link not found" },
        { status: 404 }
      );
    }

    // 2. Update click count + lastClickedAt
    await prisma.url.update({
      where: { id: record.id },
      data: {
        clicks: { increment: 1 },
        lastClickedAt: new Date(),
      },
    });

    // 3. Redirect to the original URL
    return redirect(record.originalUrl);
  } catch (err) {
    console.error("Redirect Error:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
