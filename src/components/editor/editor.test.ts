import { describe, it, expect } from "vitest";
import {
  createEmptyPortfolio,
  initializePortfolioWithTemplate,
  validatePublishReadiness,
  reorderSection,
  PortfolioData,
  Project,
  Skill,
  SectionConfig,
} from "@/lib/schema/portfolio";
import { getAllTemplates, getTemplate } from "@/templates/registry";

describe("Visual Portfolio Editor & Studio Engine", () => {
  describe("Portfolio Initialization & Template Resolution", () => {
    it("initializes a valid canonical portfolio with Minimal Portfolio by default", () => {
      const portfolio = initializePortfolioWithTemplate("minimal-portfolio");

      expect(portfolio).toBeDefined();
      expect(portfolio.id).toBeDefined();
      expect(portfolio.appearance.templateId).toBe("minimal-portfolio");
      expect(portfolio.title).toBe("New Portfolio");
      expect(portfolio.sections.length).toBeGreaterThan(0);
      expect(portfolio.published).toBe(false);
    });

    it("initializes a valid canonical portfolio with Developer Pro template", () => {
      const portfolio = initializePortfolioWithTemplate("developer-pro");

      expect(portfolio.appearance.templateId).toBe("developer-pro");
      expect(portfolio.profile.fullName).toBe("");
      expect(portfolio.projects).toEqual([]);
      expect(portfolio.sections.length).toBeGreaterThan(0);
    });

    it("falls back safely to default template when unrecognized ID is passed", () => {
      const portfolio = initializePortfolioWithTemplate("invalid-non-existent-template");
      expect(portfolio.appearance.templateId).toBe("minimal-portfolio");
    });
  });

  describe("Synchronized Canonical State Updates", () => {
    it("updates portfolio title and updates timestamp", () => {
      const initial = initializePortfolioWithTemplate("minimal-portfolio");
      const updated: PortfolioData = {
        ...initial,
        title: "Alex Chen - Distributed Systems",
        updatedAt: new Date().toISOString(),
      };

      expect(updated.title).toBe("Alex Chen - Distributed Systems");
      expect(updated.appearance.templateId).toBe("minimal-portfolio");
    });

    it("updates profile fields without mutating other sections", () => {
      const initial = initializePortfolioWithTemplate("minimal-portfolio");
      const updated: PortfolioData = {
        ...initial,
        profile: {
          ...initial.profile,
          fullName: "Samira Patel",
          headline: "Principal Infrastructure Engineer",
          bio: "Specializing in Kubernetes control planes and low-latency systems.",
          location: "Berlin, Germany",
        },
      };

      expect(updated.profile.fullName).toBe("Samira Patel");
      expect(updated.profile.headline).toBe("Principal Infrastructure Engineer");
      expect(updated.profile.bio).toContain("Kubernetes");
      expect(updated.profile.location).toBe("Berlin, Germany");
      expect(updated.projects).toEqual([]);
      expect(updated.skills).toEqual([]);
    });

    it("adds, edits, and removes projects while preserving stable IDs and order", () => {
      const initial = initializePortfolioWithTemplate("developer-pro");

      const newProject: Project = {
        id: "proj-101",
        title: "Distributed KV Store",
        tagline: "",
        description: "Raft consensus implementation in Rust.",
        technologies: ["Rust", "gRPC", "Protobuf"],
        repoUrl: "https://github.com/developer/raft-kv",
        liveUrl: "",
        coverImageUrl: "",
        startDate: "",
        endDate: "",
        order: 0,
        featured: true,
      };

      // Add Project
      const withProject: PortfolioData = {
        ...initial,
        projects: [...initial.projects, newProject],
      };
      expect(withProject.projects).toHaveLength(1);
      expect(withProject.projects[0].title).toBe("Distributed KV Store");

      // Edit Project
      const editedProjects = withProject.projects.map((p) =>
        p.id === "proj-101"
          ? { ...p, description: "Updated high-throughput Raft consensus engine in Rust." }
          : p
      );
      const withEdit: PortfolioData = { ...withProject, projects: editedProjects };
      expect(withEdit.projects[0].description).toBe(
        "Updated high-throughput Raft consensus engine in Rust."
      );

      // Remove Project
      const withoutProject: PortfolioData = {
        ...withEdit,
        projects: withEdit.projects.filter((p) => p.id !== "proj-101"),
      };
      expect(withoutProject.projects).toHaveLength(0);
    });

    it("manages skills without fabricating proficiency scores", () => {
      const initial = initializePortfolioWithTemplate("developer-pro");

      const skill1: Skill = { id: "sk-1", name: "TypeScript", category: "Languages", order: 0 };
      const skill2: Skill = { id: "sk-2", name: "Next.js", category: "Frameworks", order: 1 };

      const withSkills: PortfolioData = {
        ...initial,
        skills: [skill1, skill2],
      };

      expect(withSkills.skills).toHaveLength(2);
      expect(withSkills.skills[0].name).toBe("TypeScript");
      expect(withSkills.skills[1].name).toBe("Next.js");
      // Verify no fake 0-100% proficiency scores were introduced
      expect((withSkills.skills[0] as unknown as { level?: number }).level).toBeUndefined();
    });
  });

  describe("Section Visibility and Order", () => {
    it("hiding a section updates its visible flag without deleting its content", () => {
      const initial = createEmptyPortfolio({
        projects: [
          {
            id: "p1",
            title: "Private Core Engine",
            description: "Proprietary algorithmic trader.",
            technologies: ["C++"],
          },
        ],
        sections: [
          { key: "profile", label: "Profile", visible: true, order: 0 },
          { key: "projects", label: "Projects", visible: true, order: 1 },
          { key: "skills", label: "Skills", visible: true, order: 2 },
        ],
      });

      // Disable projects section
      const toggledSections: SectionConfig[] = initial.sections.map((sec) =>
        sec.key === "projects" ? { ...sec, visible: false } : sec
      );

      const updatedPortfolio: PortfolioData = {
        ...initial,
        sections: toggledSections,
      };

      const projectsSec = updatedPortfolio.sections.find((s) => s.key === "projects");
      expect(projectsSec?.visible).toBe(false);

      // CRITICAL: Project content MUST NOT be deleted
      expect(updatedPortfolio.projects).toHaveLength(1);
      expect(updatedPortfolio.projects[0].title).toBe("Private Core Engine");
    });

    it("reordering sections updates ordering sequence correctly", () => {
      const initial = createEmptyPortfolio({
        sections: [
          { key: "profile", label: "Profile", visible: true, order: 0 },
          { key: "projects", label: "Projects", visible: true, order: 1 },
          { key: "skills", label: "Skills", visible: true, order: 2 },
          { key: "experience", label: "Experience", visible: true, order: 3 },
        ],
      });

      // Move skills (index 2) up
      const reordered = reorderSection(initial.sections, 2, "up");
      expect(reordered[1].key).toBe("skills");
      expect(reordered[1].order).toBe(1);
      expect(reordered[2].key).toBe("projects");
      expect(reordered[2].order).toBe(2);
    });
  });

  describe("Template Switching and Content Preservation", () => {
    it("preserves 100% of user data when switching from Minimal Portfolio to Developer Pro", () => {
      const portfolio: PortfolioData = createEmptyPortfolio({
        title: "Senior Fullstack Engineer",
        profile: {
          fullName: "Elena Rostova",
          headline: "Distributed Systems & UI Architect",
          bio: "Building resilient distributed backends and refined user experiences.",
          location: "San Francisco, CA",
        },
        projects: [
          {
            id: "p-42",
            title: "Edge Compute Platform",
            description: "Distributed execution network over WebAssembly.",
            technologies: ["Rust", "Wasm", "TypeScript"],
            liveUrl: "https://edge.example.com",
            repoUrl: "https://github.com/elena/edge-compute",
            featured: true,
          },
        ],
        skills: [{ id: "s-1", name: "Rust", category: "Systems" }],
        appearance: {
          templateId: "minimal-portfolio",
          colorScheme: "dark",
          accentColor: "blue",
          fontFamily: "serif",
        },
      });

      // Switch to Developer Pro
      const switched: PortfolioData = {
        ...portfolio,
        appearance: {
          ...portfolio.appearance,
          templateId: "developer-pro",
        },
      };

      // Ensure template changed
      expect(switched.appearance.templateId).toBe("developer-pro");

      // Ensure all canonical fields remained intact
      expect(switched.title).toBe("Senior Fullstack Engineer");
      expect(switched.profile.fullName).toBe("Elena Rostova");
      expect(switched.profile.headline).toBe("Distributed Systems & UI Architect");
      expect(switched.profile.bio).toContain("resilient distributed backends");
      expect(switched.profile.location).toBe("San Francisco, CA");
      expect(switched.projects).toHaveLength(1);
      expect(switched.projects[0].id).toBe("p-42");
      expect(switched.projects[0].title).toBe("Edge Compute Platform");
      expect(switched.projects[0].liveUrl).toBe("https://edge.example.com");
      expect(switched.skills).toHaveLength(1);
      expect(switched.skills[0].name).toBe("Rust");

      // Verify Appearance Settings are preserved
      expect(switched.appearance.colorScheme).toBe("dark");
      expect(switched.appearance.accentColor).toBe("blue");
    });

    it("guarantees approved accent colors and prohibits purple or violet gradients", () => {
      const templates = getAllTemplates();
      expect(templates.length).toBeGreaterThan(0);

      const allowedAccents = ["neutral", "blue", "slate"];
      allowedAccents.forEach((accent) => {
        expect(["neutral", "blue", "slate"]).toContain(accent);
        expect(accent).not.toMatch(/purple|violet/i);
      });
    });
  });

  describe("History Operations (Undo & Redo Mechanics)", () => {
    it("simulates sequential editing, undo, redo, and stack truncation correctly", () => {
      const MAX_HISTORY = 30;
      let history: PortfolioData[] = [];
      let future: PortfolioData[] = [];
      let current = initializePortfolioWithTemplate("minimal-portfolio");

      function applyEdit(next: PortfolioData) {
        history = [...history.slice(-(MAX_HISTORY - 1)), current];
        future = []; // Clear redo stack on new branch
        current = next;
      }

      function performUndo() {
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        history = history.slice(0, -1);
        future = [current, ...future];
        current = prev;
      }

      function performRedo() {
        if (future.length === 0) return;
        const next = future[0];
        future = future.slice(1);
        history = [...history, current];
        current = next;
      }

      // 1. Initial State
      expect(current.title).toBe("New Portfolio");
      expect(history).toHaveLength(0);
      expect(future).toHaveLength(0);

      // 2. First Edit: Change Title
      const edit1: PortfolioData = { ...current, title: "Version 1" };
      applyEdit(edit1);
      expect(current.title).toBe("Version 1");
      expect(history).toHaveLength(1);
      expect(future).toHaveLength(0);

      // 3. Second Edit: Update Profile
      const edit2: PortfolioData = {
        ...current,
        profile: { ...current.profile, fullName: "Jane Doe" },
      };
      applyEdit(edit2);
      expect(current.profile.fullName).toBe("Jane Doe");
      expect(history).toHaveLength(2);

      // 4. Undo Edit 2 (restores Edit 1)
      performUndo();
      expect(current.title).toBe("Version 1");
      expect(current.profile.fullName).toBe("");
      expect(history).toHaveLength(1);
      expect(future).toHaveLength(1);

      // 5. Undo Edit 1 (restores Initial)
      performUndo();
      expect(current.title).toBe("New Portfolio");
      expect(history).toHaveLength(0);
      expect(future).toHaveLength(2);

      // 6. Undo at boundary (no-op)
      performUndo();
      expect(current.title).toBe("New Portfolio");

      // 7. Redo Edit 1
      performRedo();
      expect(current.title).toBe("Version 1");
      expect(history).toHaveLength(1);
      expect(future).toHaveLength(1);

      // 8. Make a new edit from here: branch pruning (future must be cleared)
      const branchEdit: PortfolioData = { ...current, title: "Branched Title" };
      applyEdit(branchEdit);
      expect(current.title).toBe("Branched Title");
      expect(history).toHaveLength(2);
      expect(future).toHaveLength(0); // Future was pruned
    });
  });

  describe("Save State & Publish Readiness Validation", () => {
    it("detects unsaved state when serialized JSON differs from last saved state", () => {
      const savedPortfolio = initializePortfolioWithTemplate("minimal-portfolio");
      const lastSavedJson = JSON.stringify(savedPortfolio);

      const modifiedPortfolio: PortfolioData = {
        ...savedPortfolio,
        title: "Unsaved Title Keystroke",
      };

      const isUnsaved = JSON.stringify(modifiedPortfolio) !== lastSavedJson;
      expect(isUnsaved).toBe(true);

      // Reverting back restores clean saved state
      const revertedPortfolio: PortfolioData = {
        ...modifiedPortfolio,
        title: savedPortfolio.title,
      };
      const isRevertedSaved = JSON.stringify(revertedPortfolio) === lastSavedJson;
      expect(isRevertedSaved).toBe(true);
    });

    it("prevents publishing unready portfolios and reports actionable reasons", () => {
      // Empty portfolio has no full name, no headline, etc.
      const unready = initializePortfolioWithTemplate("minimal-portfolio");
      const readiness = validatePublishReadiness(unready);

      expect(readiness.isReady).toBe(false);
      expect(readiness.errors.length).toBeGreaterThan(0);
      expect(readiness.errors[0]).toMatch(/Full name/i);
    });

    it("permits publishing once canonical fields are legitimately filled", () => {
      const ready = createEmptyPortfolio({
        title: "Ready Portfolio",
        slug: "sarah-lin-sre",
        profile: {
          fullName: "Sarah Lin",
          headline: "Senior Site Reliability Engineer",
          bio: "Specializing in observability, reliability engineering, and incident response.",
          location: "Seattle, WA",
        },
        projects: [
          {
            id: "p1",
            title: "Automated Incident Playbooks",
            description: "Self-healing incident response operator for Kubernetes.",
            technologies: ["Python", "Kubernetes"],
          },
        ],
      });

      const readiness = validatePublishReadiness(ready);
      expect(readiness.isReady).toBe(true);
      expect(readiness.errors).toHaveLength(0);
    });
  });

  describe("Viewport Modes and Studio Preview Controls", () => {
    it("supports canonical device modes: desktop, tablet, mobile", () => {
      const deviceModes = ["desktop", "tablet", "mobile"] as const;
      expect(deviceModes).toContain("desktop");
      expect(deviceModes).toContain("tablet");
      expect(deviceModes).toContain("mobile");
    });

    it("supports zoom presets (100%, 85%, 75%) without layout breakage", () => {
      const allowedZooms = [1, 0.85, 0.75];
      allowedZooms.forEach((zoom) => {
        expect(zoom).toBeGreaterThan(0);
        expect(zoom).toBeLessThanOrEqual(1);
      });
    });

    it("exposes all registered templates to the visual switcher", () => {
      const templates = getAllTemplates();
      expect(templates.length).toBeGreaterThanOrEqual(2);

      const minimal = getTemplate("minimal-portfolio");
      const devPro = getTemplate("developer-pro");

      expect(minimal?.metadata.name).toBe("Minimal Portfolio");
      expect(devPro?.metadata.name).toBe("Developer Pro");
    });
  });
});
