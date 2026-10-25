import { describe, it, expect } from "vitest";
import { getAllTemplates, getTemplate, isValidTemplateId } from "./registry";

describe("Template Registry", () => {
  it("registers Minimal Portfolio and Developer Pro", () => {
    const templates = getAllTemplates();
    expect(templates).toHaveLength(2);

    const ids = templates.map((t) => t.metadata.id);
    expect(ids).toContain("minimal-portfolio");
    expect(ids).toContain("developer-pro");
  });

  it("retrieves template by valid ID", () => {
    const devPro = getTemplate("developer-pro");
    expect(devPro).toBeDefined();
    expect(devPro?.metadata.name).toBe("Developer Pro");
    expect(devPro?.component).toBeDefined();
  });

  it("returns undefined for unknown template ID without throwing", () => {
    const unknown = getTemplate("non-existent-template");
    expect(unknown).toBeUndefined();
  });

  it("validates template ID correctly", () => {
    expect(isValidTemplateId("minimal-portfolio")).toBe(true);
    expect(isValidTemplateId("developer-pro")).toBe(true);
    expect(isValidTemplateId("invalid")).toBe(false);
  });
});
