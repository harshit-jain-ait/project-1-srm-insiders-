import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { POST as uploadAssetRoute } from "./upload/route";
import { GET as getAssetRoute } from "./[filename]/route";

describe("Asset Upload & Retrieval API", () => {
  it("uploads a valid PNG file and returns the asset URL and metadata", async () => {
    const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
    const file = new File([pngBytes], "architecture_diagram.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("file", file);

    const req = new NextRequest("http://localhost:3000/api/assets/upload", {
      method: "POST",
      body: formData,
    });

    const res = await uploadAssetRoute(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.assetUrl).toMatch(/^\/api\/assets\/architecture_diagram_/);
    expect(json.filename).toBeDefined();
    expect(json.mimeType).toBe("image/png");

    // Retrieve the uploaded asset
    const getReq = new NextRequest(`http://localhost:3000/api/assets/${json.filename}`);
    const getRes = await getAssetRoute(getReq, {
      params: Promise.resolve({ filename: json.filename }),
    });

    expect(getRes.status).toBe(200);
    expect(getRes.headers.get("Content-Type")).toBe("image/png");
    expect(getRes.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("rejects an upload without a file payload", async () => {
    const formData = new FormData();
    const req = new NextRequest("http://localhost:3000/api/assets/upload", {
      method: "POST",
      body: formData,
    });

    const res = await uploadAssetRoute(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("No file provided");
  });

  it("rejects an upload with forged MIME type (text file claimed as PNG)", async () => {
    const fakeFile = new File(["not a png at all"], "fake.png", { type: "image/png" });
    const formData = new FormData();
    formData.append("file", fakeFile);

    const req = new NextRequest("http://localhost:3000/api/assets/upload", {
      method: "POST",
      body: formData,
    });

    const res = await uploadAssetRoute(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Invalid or unrecognized image binary signature");
  });

  it("blocks directory traversal attempts when retrieving assets", async () => {
    const badReq = new NextRequest("http://localhost:3000/api/assets/../../etc/passwd");
    const badRes = await getAssetRoute(badReq, {
      params: Promise.resolve({ filename: "../../etc/passwd" }),
    });

    // Should return 400 Bad Request or 404
    expect([400, 404]).toContain(badRes.status);
  });
});
