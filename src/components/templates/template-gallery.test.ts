import { describe, it, expect } from "vitest";
import { getAllTemplates, getTemplate, isValidTemplateId } from "@/templates/registry";

describe("Template Gallery Business Logic & Search Verification", () => {
  const templates = getAllTemplates();

  it("loads all registered templates from the central registry", () => {
    expect(templates.length).toBeGreaterThanOrEqual(2);
    const ids = templates.map((t) => t.metadata.id);
    expect(ids).toContain("minimal-portfolio");
    expect(ids).toContain("developer-pro");
  });

  it("performs case-insensitive search across name, description, and tags", () => {
    const query = "developer";

    const matches = templates.filter((tpl) => {
      const q = query.toLowerCase();
      const matchesName = tpl.metadata.name.toLowerCase().includes(q);
      const matchesDesc = tpl.metadata.description.toLowerCase().includes(q);
      const matchesTags = tpl.metadata.tags.some((t) => t.toLowerCase().includes(q));
      return matchesName || matchesDesc || matchesTags;
    });

    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some((m) => m.metadata.id === "developer-pro")).toBe(true);
  });

  it("filters accurately by category", () => {
    const editorialTemplates = templates.filter(
      (t) => t.metadata.category === "Editorial"
    );
    expect(editorialTemplates.length).toBeGreaterThan(0);
    expect(editorialTemplates.some((t) => t.metadata.id === "minimal-portfolio")).toBe(true);

    const engineeringTemplates = templates.filter(
      (t) => t.metadata.category === "Engineering"
    );
    expect(engineeringTemplates.length).toBeGreaterThan(0);
    expect(engineeringTemplates.some((t) => t.metadata.id === "developer-pro")).toBe(true);
  });

  it("combines search query and category filters seamlessly", () => {
    const query = "typography";
    const category: string = "Editorial";

    const matches = templates.filter((tpl) => {
      if (category !== "All" && tpl.metadata.category !== category) return false;
      const q = query.toLowerCase();
      return (
        tpl.metadata.name.toLowerCase().includes(q) ||
        tpl.metadata.description.toLowerCase().includes(q) ||
        tpl.metadata.tags.some((t) => t.toLowerCase().includes(q))
      );
    });

    expect(matches).toHaveLength(1);
    expect(matches[0].metadata.id).toBe("minimal-portfolio");
  });

  it("returns zero matches for non-existent search and handles gracefully", () => {
    const query = "non-existent-xyz-query-12345";
    const matches = templates.filter((tpl) =>
      tpl.metadata.name.toLowerCase().includes(query)
    );
    expect(matches).toHaveLength(0);
  });

  it("sorts templates by name ascending and descending", () => {
    const asc = [...templates].sort((a, b) =>
      a.metadata.name.localeCompare(b.metadata.name)
    );
    expect(asc[0].metadata.name <= asc[1].metadata.name).toBe(true);

    const desc = [...templates].sort((a, b) =>
      b.metadata.name.localeCompare(a.metadata.name)
    );
    expect(desc[0].metadata.name >= desc[1].metadata.name).toBe(true);
  });

  it("guarantees stable, valid template IDs for selection", () => {
    templates.forEach((tpl) => {
      expect(isValidTemplateId(tpl.metadata.id)).toBe(true);
      const retrieved = getTemplate(tpl.metadata.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.metadata.id).toBe(tpl.metadata.id);
    });
  });
});
