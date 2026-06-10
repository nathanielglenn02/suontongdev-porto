import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Hybrid upload: If BLOB_READ_WRITE_TOKEN is defined, use Vercel Blob (useful for Vercel Serverless environment)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = file.name.split(".").pop() || "png";
      const blobName = `uploads/${uniqueSuffix}.${ext}`;
      
      const blob = await put(blobName, file, {
        access: "public",
      });
      
      return NextResponse.json({ url: blob.url });
    }

    // Fallback: Local upload for local development
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure public/uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.name.split(".").pop() || "png";
    const safeName = `${uniqueSuffix}.${ext}`;

    const filePath = join(uploadsDir, safeName);
    await writeFile(filePath, buffer);

    // Return the relative URL of the uploaded image
    return NextResponse.json({ url: `/uploads/${safeName}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
