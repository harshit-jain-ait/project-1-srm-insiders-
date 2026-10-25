import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ filename: string }>;
}

const MIME_MAP: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { filename } = await params;

    // Strict path traversal defense: strip any directory segments
    const safeBase = path.basename(filename);
    if (!safeBase || safeBase !== filename) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const uploadsDir = path.resolve(process.cwd(), ".data", "uploads");
    const filePath = path.join(uploadsDir, safeBase);

    // Verify canonical path is inside uploadsDir
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(uploadsDir)) {
      return new NextResponse("Access denied", { status: 403 });
    }

    if (!fs.existsSync(resolvedPath)) {
      return new NextResponse("Asset not found", { status: 404 });
    }

    const ext = path.extname(safeBase).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";
    const fileBuffer = fs.readFileSync(resolvedPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[API/assets/[filename]] error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
