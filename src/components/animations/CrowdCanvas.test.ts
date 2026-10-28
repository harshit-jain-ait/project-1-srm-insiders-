import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { CrowdCanvas, Skiper39 } from "./CrowdCanvas";

describe("Part 20 — CrowdCanvas & Skiper39 Animation Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders CrowdCanvas canvas element with appropriate accessibility attributes", () => {
    const html = renderToString(
      React.createElement(CrowdCanvas, {
        src: "/images/peeps/all-peeps.png",
        rows: 15,
        cols: 7,
      })
    );

    expect(html).toContain("<canvas");
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("pointer-events-none");
  });

  it("renders with custom className and responsive scaling props", () => {
    const html = renderToString(
      React.createElement(CrowdCanvas, {
        src: "/images/peeps/all-peeps.png",
        rows: 15,
        cols: 7,
        className: "custom-hero-canvas-test",
        speedMultiplier: 1.2,
        maxPeeps: 8,
        characterScale: 0.5,
      })
    );

    expect(html).toContain("custom-hero-canvas-test");
    expect(html).toContain('aria-hidden="true"');
  });

  it("renders Skiper39 demo component containing the canvas and typography", () => {
    const html = renderToString(React.createElement(Skiper39));

    expect(html).toContain("Crowd Canvas");
    expect(html).toContain("A Vibrant Community of Builders");
    expect(html).toContain("<canvas");
  });

  it("safely handles custom row and column configurations without throw", () => {
    expect(() => {
      renderToString(
        React.createElement(CrowdCanvas, {
          src: "/test-sprite.png",
          rows: 10,
          cols: 5,
        })
      );
    }).not.toThrow();
  });
});
