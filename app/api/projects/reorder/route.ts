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

    // 3. Update order in database using transaction
    // We update each project's order to match its index in the sorted list
    const updates = ids.map((id, index) => 
      prisma.project.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
