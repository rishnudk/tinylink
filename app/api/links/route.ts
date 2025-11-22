
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";


export async function GET() {
    try {
        const sessionId =  getSessionId();

        const links = await prisma.url.findMany({
            where: { sessionId},
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json({
            success: true,
            data: links
        });
    } catch (err) {
        console.error("GET /api/links error:", err);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}