import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Authenticate session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key-1234567890";
    
    let isAuthenticated = false;
    if (sessionCookie) {
      const payload = await verifyToken(sessionCookie, jwtSecret);
      if (payload && payload.username === "admin") {
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { ids } = body as { ids: number[] };

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // 3. Update order in database sequentially to avoid transaction write conflicts/deadlocks in TiDB
    for (let i = 0; i < ids.length; i++) {
      await prisma.project.update({
        where: { id: ids[i] },
        data: { order: i },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Reorder error:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
