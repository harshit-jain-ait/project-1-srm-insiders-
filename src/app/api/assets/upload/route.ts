import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { validateAssetUpload } from "@/lib/assets/asset-validator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "No file provided in 'file' field." },
        { status: 400 }
      );
    }

    const blob = file as Blob;
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = (file as File).name || "uploaded_image";
    const mimeType = blob.type || "";

    const validation = validateAssetUpload(fileName, buffer, mimeType);
    if (!validation.isValid || !validation.safeFileName) {
      return NextResponse.json(
        { success: false, error: validation.error || "File validation failed." },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists in .data/uploads
    const uploadsDir = path.resolve(process.cwd(), ".data", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const targetPath = path.join(uploadsDir, validation.safeFileName);
    fs.writeFileSync(targetPath, buffer);

    const assetUrl = `/api/assets/${validation.safeFileName}`;

    return NextResponse.json(
      {
        success: true,
        assetUrl,
        filename: validation.safeFileName,
        mimeType: validation.mimeType,
        data: {
          url: assetUrl,
          fileName: validation.safeFileName,
          mimeType: validation.mimeType,
          sizeBytes: buffer.length,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API/assets/upload] Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during asset upload." },
      { status: 500 }
    );
  }
}
