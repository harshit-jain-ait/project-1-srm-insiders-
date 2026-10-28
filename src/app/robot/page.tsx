import React from "react";
import { Metadata } from "next";
import { RobotHeroScene } from "@/components/robot-3d/robot-hero-scene";

export const metadata: Metadata = {
  title: "3D Robot Hero Scene — MCODE Procedural Three.js",
  description:
    "Procedural 3D robot hero scene recreation with Three.js, real-time mouse tracking, floating physics, and dynamic lighting.",
};

export default function RobotPage() {
  return <RobotHeroScene />;
}
