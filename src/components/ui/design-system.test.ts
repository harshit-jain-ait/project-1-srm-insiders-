import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Design System Utilities & Token Rules", () => {
  it("merges class names without collision or duplication", () => {
    const merged = cn(
      "px-4 py-2",
      "text-sm font-medium",
      "px-6", // Should override px-4 cleanly via tailwind-merge
      false && "hidden",
      undefined,
      null
    );

    expect(merged).toContain("px-6");
    expect(merged).not.toContain("px-4");
    expect(merged).toContain("text-sm");
    expect(merged).toContain("font-medium");
  });

  it("strictly enforces absence of purple or violet classes in theme tokens", async () => {
    const fs = await import("fs/promises");
    const path = await import("path");
    const cssContent = await fs.readFile(
      path.resolve(process.cwd(), "src/app/globals.css"),
      "utf-8"
    );

    // Rule: Never use purple or violet gradients
    expect(cssContent.toLowerCase()).not.toContain("purple");
    expect(cssContent.toLowerCase()).not.toContain("violet");
    expect(cssContent.toLowerCase()).not.toContain("fuchsia");
  });

  it("verifies semantic color tokens exist in globals.css", async () => {
    const fs = await import("fs/promises");
    const path = await import("path");
    const cssContent = await fs.readFile(
      path.resolve(process.cwd(), "src/app/globals.css"),
      "utf-8"
    );

    expect(cssContent).toContain("--background");
    expect(cssContent).toContain("--foreground");
    expect(cssContent).toContain("--surface");
    expect(cssContent).toContain("--border");
    expect(cssContent).toContain("--brand-blue");
    expect(cssContent).toContain("--success");
    expect(cssContent).toContain("--warning");
    expect(cssContent).toContain("--error");
  });
});
