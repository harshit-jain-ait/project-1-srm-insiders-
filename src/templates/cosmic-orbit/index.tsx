/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useMemo, useRef, Component, ErrorInfo, ReactNode } from "react";
import { TemplateProps } from "../types";
import { SafeExternalLink } from "../shared";
import {
  Globe,
  MapPin,
  Sparkles,
  ArrowRight,
  Plus,
  ExternalLink,
  Mail,
  Menu,
  X,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Cpu,
  Layers,
  Code2,
  Atom,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// ── Social Icons (Clean SVG components) ───────────────────────────────────────
function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.67 1.67 0 1 0 0 3.34 1.67 1.67 0 0 0 0-3.34z" />
    </svg>
  );
}

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// ── Section Error Boundary ───────────────────────────────────────────────────
interface SectionBoundaryProps {
  sectionName: string;
  children: ReactNode;
}
interface SectionBoundaryState {
  hasError: boolean;
}
class SectionErrorBoundary extends Component<SectionBoundaryProps, SectionBoundaryState> {
  constructor(props: SectionBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): SectionBoundaryState {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[CosmicOrbit] Error in section "${this.props.sectionName}":`, error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="py-8 px-4 text-center my-4 rounded-xl border border-cyan-900/30 bg-cyan-950/20 text-cyan-400 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 mx-auto mb-1 opacity-70" />
          <span>Notice: This section could not render</span>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Ringed Planet Logo Icon ──────────────────────────────────────────────────
function RingedPlanetIcon({ className = "w-5 h-5 text-cyan-400" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="6" fill="currentColor" fillOpacity="0.15" />
      <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-25 12 12)" />
    </svg>
  );
}

// ── Astronaut SVG Illustration ───────────────────────────────────────────────
function FloatingAstronautSVG({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="helmetVisor" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#4BE5FF" />
          <stop offset="45%" stopColor="#1269DB" />
          <stop offset="100%" stopColor="#051329" />
        </radialGradient>
        <filter id="astroGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g filter="url(#astroGlow)">
        {/* Backpack / Life Support */}
        <rect x="52" y="55" width="56" height="48" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="58" y="62" width="10" height="20" rx="3" fill="#0f172a" />
        <rect x="92" y="62" width="10" height="20" rx="3" fill="#0f172a" />
        <circle cx="80" cy="72" r="4" fill="#38bdf8" fillOpacity="0.6" />

        {/* Suit Body */}
        <ellipse cx="80" cy="85" rx="22" ry="24" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        {/* Chest Panel */}
        <rect x="71" y="78" width="18" height="14" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
        <circle cx="76" cy="84" r="1.5" fill="#ef4444" />
        <circle cx="81" cy="84" r="1.5" fill="#38bdf8" />
        <circle cx="84.5" cy="84" r="1.5" fill="#10b981" />

        {/* Arms */}
        <ellipse cx="54" cy="84" rx="7" ry="14" transform="rotate(25 54 84)" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="49" cy="95" r="5" fill="#0284c7" />
        <ellipse cx="106" cy="84" rx="7" ry="14" transform="rotate(-25 106 84)" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="111" cy="95" r="5" fill="#0284c7" />

        {/* Legs */}
        <ellipse cx="70" cy="115" rx="7" ry="16" transform="rotate(10 70 115)" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
        <ellipse cx="69" cy="128" rx="8" ry="5" fill="#0284c7" />
        <ellipse cx="90" cy="115" rx="7" ry="16" transform="rotate(-10 90 115)" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
        <ellipse cx="91" cy="128" rx="8" ry="5" fill="#0284c7" />

        {/* Helmet Outer */}
        <circle cx="80" cy="46" r="24" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        {/* Helmet Visor */}
        <ellipse cx="80" cy="47" rx="17" ry="14" fill="url(#helmetVisor)" stroke="#4BE5FF" strokeWidth="1.5" />
        {/* Visor Glare */}
        <path d="M72 40 Q 80 37 88 41" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
      </g>
    </svg>
  );
}

// ── Default Skills Catalog with Category & Color ─────────────────────────────
const DEFAULT_COSMIC_SKILLS = [
  { name: "React", category: "Frontend", icon: Atom, color: "#00d8ff" },
  { name: "Next.js", category: "Frontend", icon: Code2, color: "#ffffff" },
  { name: "Node.js", category: "Backend", icon: Cpu, color: "#68a063" },
  { name: "TypeScript", category: "Language", icon: Layers, color: "#3178c6" },
  { name: "Tailwind CSS", category: "Styling", icon: Sparkles, color: "#38bdf8" },
];

export function CosmicOrbitTemplate({ portfolio, isLivePreview = false }: TemplateProps) {
  const {
    profile,
    projects,
    experience,
    skills,
    education,
    socialLinks,
    sections,
    cosmicSettings,
  } = portfolio;

  // ── Scoped Settings with Graceful Fallbacks ────────────────────────────────
  const enableIntro = cosmicSettings?.enableIntroAnimation ?? true;
  const showAstronaut = cosmicSettings?.showAstronaut ?? true;
  const showPlanet = cosmicSettings?.showPlanetBackground ?? true;
  const showStars = cosmicSettings?.showStarParticles ?? true;
  const enableParallax = cosmicSettings?.enableParallaxEffects ?? true;
  const showHud = cosmicSettings?.showHudElements ?? false;

  const planetColor = cosmicSettings?.planetColor || "#1269DB";
  const accentColor = cosmicSettings?.accentColor || "#4BE5FF";
  const bgIntensity = (cosmicSettings?.backgroundIntensity ?? 70) / 100;
  const planetGlowIntensity = (cosmicSettings?.planetGlowIntensity ?? 80) / 100;
  const starDensity = cosmicSettings?.starDensity || "medium";
  const animIntensity = cosmicSettings?.animationIntensity || "medium";

  const heroHeading = cosmicSettings?.heroHeading || "HELLO, FELLOW\nGALAXY MEMBER";
  const heroSubtitle =
    cosmicSettings?.heroSubtitle ||
    (profile?.fullName ? `I AM ${profile.fullName.toUpperCase()}` : "I AM JAY");
  const heroTagline =
    cosmicSettings?.heroTagline ||
    profile?.headline?.toUpperCase() ||
    "A DEVELOPER EXPLORING IDEAS BEYOND BOUNDARIES";
  const ctaText = cosmicSettings?.callToActionText || "CLICK TO EXPLORE";
  const hudCoords = cosmicSettings?.hudCoordinates || "28.6139° N 77.2090° E";
  const hudLabel = cosmicSettings?.hudEdgeLabel || "EXPLORER / LEARN / BUILD / REPEAT";

  // Heading split into two lines for styling (line 1 solid, line 2 outlined cyan)
  const headingLines = useMemo(() => {
    if (heroHeading.includes("\n")) {
      const parts = heroHeading.split("\n");
      return [parts[0] || "", parts.slice(1).join(" ")];
    }
    const words = heroHeading.trim().split(" ");
    if (words.length <= 2) return [words[0] || "", words.slice(1).join(" ")];
    const half = Math.ceil(words.length / 2);
    return [words.slice(0, half).join(" "), words.slice(half).join(" ")];
  }, [heroHeading]);

  // Section visibility helpers
  const isSectionVisible = (key: string): boolean => {
    const sec = sections?.find((s) => s.key === key);
    return sec ? sec.visible !== false : true;
  };

  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Smooth scroll handler inside preview container
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setActiveSection(targetId);
    setMobileMenuOpen(false);

    const targetEl = document.getElementById(`cosmic-${targetId}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Starfield generation (density responsive)
  const starCount = starDensity === "high" ? 85 : starDensity === "low" ? 30 : 55;
  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.8,
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }));
  }, [starCount]);

  // Derived visible skills
  const displaySkills = useMemo(() => {
    if (skills && skills.length > 0) {
      return skills.map((s) => ({
        name: s.name,
        category: s.category || "Skill",
        icon: Atom,
        color: accentColor,
      }));
    }
    return DEFAULT_COSMIC_SKILLS;
  }, [skills, accentColor]);

  // Social icons map
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github": return GithubIcon;
      case "linkedin": return LinkedinIcon;
      case "twitter":
      case "x": return TwitterIcon;
      case "instagram": return InstagramIcon;
      case "youtube": return YoutubeIcon;
      default: return Mail;
    }
  };

  return (
    <article
      id="cosmic-orbit-root"
      className="relative w-full min-h-screen text-[#f1f5f9] select-text overflow-hidden font-sans"
      style={{
        backgroundColor: "#070B14",
        ["--cosmic-accent" as string]: accentColor,
        ["--cosmic-planet" as string]: planetColor,
        ["--cosmic-glow" as string]: `${planetGlowIntensity}`,
      }}
    >
      {/* ── Scoped Font Import & Global Cosmic Keyframes ──────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        .font-orbitron {
          font-family: 'Orbitron', 'Space Grotesk', -apple-system, sans-serif;
        }

        @keyframes cosmicFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(2deg);
          }
        }

        @keyframes cosmicComet {
          0% {
            transform: translateX(0px) translateY(0px) scale(0.6);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 0.9;
          }
          100% {
            transform: translateX(450px) translateY(260px) scale(1.1);
            opacity: 0;
          }
        }

        @keyframes cosmicTwinkle {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.25); }
        }

        .animate-cosmic-float {
          animation: cosmicFloat 5.5s ease-in-out infinite;
        }

        .animate-cosmic-comet {
          animation: cosmicComet 7s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }

        .cosmic-stroke-text {
          color: transparent;
          -webkit-text-stroke: 1.5px ${accentColor};
        }
      `}</style>

      {/* ── 1. STICKY TOP NAVIGATION BAR ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070B14]/80 border-b border-[#202C40]/80 px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between transition-colors">
        {/* Left: Ringed Planet Logo + Title */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "home")}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform">
            <RingedPlanetIcon className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="font-orbitron font-bold text-sm tracking-wider text-white group-hover:text-cyan-300 transition-colors uppercase">
            {profile?.fullName || portfolio?.title || "Portfolio"}
          </span>
        </a>

        {/* Center/Right: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2 text-xs font-mono">
          {[
            { id: "home", label: "Home", show: true },
            { id: "about", label: "About", show: isSectionVisible("profile") },
            { id: "skills", label: "Skills", show: isSectionVisible("skills") },
            { id: "experience", label: "Experience", show: isSectionVisible("experience") },
            { id: "education", label: "Education", show: isSectionVisible("education") },
            { id: "projects", label: "Projects", show: isSectionVisible("projects") },
            { id: "contact", label: "Contact", show: isSectionVisible("contact") },
          ]
            .filter((l) => l.show)
            .map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                    isActive
                      ? "border border-cyan-400 text-cyan-300 bg-cyan-500/10 shadow-[0_0_12px_rgba(75,229,255,0.25)]"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg border border-[#202C40] bg-slate-900/60 text-slate-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden z-30 sticky top-14 bg-[#090e1a]/95 border-b border-[#202C40] p-4 space-y-2 backdrop-blur-xl animate-in slide-in-from-top-2 duration-150">
          {[
            { id: "home", label: "Home" },
            { id: "about", label: "About" },
            { id: "skills", label: "Skills" },
            { id: "experience", label: "Experience" },
            { id: "education", label: "Education" },
            { id: "projects", label: "Projects" },
            { id: "contact", label: "Contact" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className="block px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/30"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* ── 2. HERO SECTION (Space Viewport with Deep Planet Arc & Astronaut) ─ */}
      <section
        id="cosmic-home"
        className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col justify-between items-center text-center overflow-hidden pt-10 pb-8 px-4 sm:px-6"
      >
        {/* Background Layer A: Deep Nebula Clouds & Gradients */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{ opacity: bgIntensity }}
        >
          {/* Blue-violet cosmic nebula */}
          <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-indigo-700/25 blur-[140px] rounded-full" />
          <div className="absolute top-24 right-0 w-[550px] h-[550px] bg-cyan-600/20 blur-[130px] rounded-full" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/25 blur-[160px] rounded-full" />
        </div>

        {/* Background Layer B: Distant Planet with Blue Rim (Upper Left) */}
        <div className="absolute top-8 left-6 sm:top-14 sm:left-14 w-28 h-28 sm:w-36 sm:h-36 rounded-full pointer-events-none opacity-80">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1269DB]/40 via-[#070B14] to-[#070B14] border border-cyan-400/30 shadow-[0_0_25px_rgba(75,229,255,0.2)]" />
        </div>

        {/* Background Layer C: Shooting Comet (Upper Left) */}
        <div className="absolute top-12 left-10 w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-white rotate-[32deg] pointer-events-none animate-cosmic-comet shadow-[0_0_8px_#4BE5FF]" />

        {/* Background Layer D: Starfield Particles */}
        {showStars && (
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
            {stars.map((s) => (
              <span
                key={s.id}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${s.y}%`,
                  left: `${s.x}%`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  opacity: s.opacity,
                  animation: `cosmicTwinkle ${s.duration}s ease-in-out infinite ${s.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Top Eyebrow & HUD Display */}
        <div className="w-full max-w-5xl flex items-center justify-between relative z-10 pt-2">
          <div className="hidden sm:block w-24" />

          {/* Eyebrow Transmission Line */}
          <div className="inline-flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-cyan-300 uppercase mx-auto">
            <span className="w-6 sm:w-10 h-px bg-cyan-400/60" />
            <span>A TRANSMISSION FROM EARTH</span>
            <span className="w-6 sm:w-10 h-px bg-cyan-400/60" />
          </div>

          {/* HUD Readout (Upper Right) */}
          {showHud ? (
            <div className="text-right font-mono text-[10px] text-cyan-400/80 hidden sm:block border-l border-cyan-500/30 pl-3">
              <div className="font-bold tracking-wider text-cyan-300">EARTH</div>
              <div className="text-slate-400 text-[9px]">{hudCoords}</div>
            </div>
          ) : (
            <div className="hidden sm:block w-24" />
          )}
        </div>

        {/* Vertical HUD Ribbon on Right Edge */}
        {showHud && (
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 font-mono text-[9px] text-cyan-400/70 select-none z-20 pointer-events-none"
            aria-hidden="true"
          >
            <div className="h-10 w-px bg-cyan-400/40" />
            <span className="[writing-mode:vertical-rl] tracking-[0.3em] font-semibold uppercase">
              {hudLabel}
            </span>
            <div className="h-10 w-px bg-cyan-400/40" />
          </div>
        )}

        {/* Center Headings */}
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4 my-auto pt-6 pb-2">
          {/* Main 2-Line Geometric Headline */}
          <h1 className="font-orbitron font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.12]">
            <span className="block text-white drop-shadow-[0_0_25px_rgba(75,229,255,0.4)]">
              {headingLines[0]}
            </span>
            <span className="block cosmic-stroke-text drop-shadow-[0_0_20px_rgba(75,229,255,0.35)] mt-1">
              {headingLines[1]}
            </span>
          </h1>

          {/* Subtitle ("I AM JAY") */}
          <div className="font-orbitron font-semibold text-lg sm:text-2xl tracking-[0.25em] text-white pt-1 uppercase">
            {heroSubtitle}
          </div>

          {/* Description / Mission Tagline */}
          <p className="text-[11px] sm:text-xs font-mono tracking-[0.18em] text-[#91A1B8] uppercase max-w-xl mx-auto leading-relaxed">
            {heroTagline}
          </p>
        </div>

        {/* Foreground Planet Arc, City Silhouettes & Floating Astronaut */}
        <div className="relative w-full max-w-4xl h-56 sm:h-72 md:h-80 flex items-center justify-center overflow-visible z-10">
          {/* Futuristic City Silhouette (Left & Right Flanks) */}
          <div className="absolute bottom-6 left-2 sm:left-6 w-36 sm:w-52 h-20 opacity-40 pointer-events-none" aria-hidden="true">
            <svg viewBox="0 0 160 80" className="w-full h-full fill-[#050c18] stroke-[#1269DB]/40" strokeWidth="0.75">
              <rect x="10" y="25" width="16" height="55" rx="1" />
              <rect x="30" y="10" width="18" height="70" rx="1" />
              <polygon points="39,2 35,10 43,10" fill="#38bdf8" />
              <rect x="52" y="32" width="14" height="48" rx="1" />
              <rect x="70" y="18" width="22" height="62" rx="1" />
              {/* Window dots */}
              <circle cx="39" cy="22" r="1" fill="#ec4899" />
              <circle cx="39" cy="30" r="1" fill="#38bdf8" />
              <circle cx="78" cy="28" r="1" fill="#38bdf8" />
              <circle cx="82" cy="36" r="1" fill="#ec4899" />
            </svg>
          </div>

          <div className="absolute bottom-6 right-2 sm:right-6 w-36 sm:w-52 h-20 opacity-40 pointer-events-none scale-x-[-1]" aria-hidden="true">
            <svg viewBox="0 0 160 80" className="w-full h-full fill-[#050c18] stroke-[#1269DB]/40" strokeWidth="0.75">
              <rect x="10" y="25" width="16" height="55" rx="1" />
              <rect x="30" y="10" width="18" height="70" rx="1" />
              <polygon points="39,2 35,10 43,10" fill="#38bdf8" />
              <rect x="52" y="32" width="14" height="48" rx="1" />
              <circle cx="39" cy="22" r="1" fill="#38bdf8" />
              <circle cx="78" cy="28" r="1" fill="#ec4899" />
            </svg>
          </div>

          {/* Large Glowing Earth-like Planet Arc in Lower Half */}
          {showPlanet && (
            <div className="absolute -bottom-24 sm:-bottom-28 w-[520px] sm:w-[720px] md:w-[860px] h-[360px] sm:h-[480px] rounded-[50%] overflow-hidden pointer-events-none select-none">
              {/* Atmospheric cyan rim glow */}
              <div
                className="w-full h-full rounded-[50%] border-t-2 border-cyan-300 transition-all duration-300"
                style={{
                  background: `radial-gradient(ellipse at 50% 10%, #1e5ca8 0%, ${planetColor} 30%, #061938 65%, #070B14 85%)`,
                  boxShadow: `0 -18px 45px rgba(75, 229, 255, ${planetGlowIntensity * 0.75}), 0 -35px 90px rgba(18, 105, 219, ${planetGlowIntensity * 0.6})`,
                }}
              >
                {/* Surface continent & cloud simulation */}
                <div className="w-full h-full opacity-40 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.35)_0%,transparent_35%),radial-gradient(circle_at_70%_20%,rgba(75,229,255,0.4)_0%,transparent_40%)]" />
              </div>
            </div>
          )}

          {/* Floating Astronaut hovering right above the planet arc */}
          {showAstronaut && (
            <div className="absolute bottom-28 sm:bottom-36 z-20 animate-cosmic-float pointer-events-none select-none">
              <FloatingAstronautSVG className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-[0_8px_20px_rgba(75,229,255,0.4)]" />
            </div>
          )}

          {/* Call to Action Pill Button with Circular Arrow Badge */}
          <div className="absolute bottom-8 sm:bottom-12 z-30">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "about")}
              className="inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 rounded-full border border-cyan-400/80 bg-[#070e1c]/90 hover:bg-cyan-950/80 text-white font-orbitron text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(75,229,255,0.3)] hover:shadow-[0_0_30px_rgba(75,229,255,0.5)] group cursor-pointer"
            >
              <span>{ctaText}</span>
              <span className="w-6 h-6 rounded-full bg-cyan-400 text-[#070B14] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator (Circled Plus + Text) */}
        <div className="relative z-10 flex flex-col items-center gap-1.5 pt-4 text-[9px] font-mono tracking-[0.25em] text-slate-400 select-none">
          <div className="w-5 h-5 rounded-full border border-cyan-400/50 flex items-center justify-center text-cyan-300">
            <Plus className="w-3 h-3" />
          </div>
          <span className="uppercase text-[9px] text-cyan-200/70">SCROLL TO BEGIN YOUR JOURNEY</span>
        </div>
      </section>

      {/* ── 3. ABOUT ME SECTION (Mission Briefing Card) ─────────────────────── */}
      {isSectionVisible("profile") && (
        <SectionErrorBoundary sectionName="About Me">
          <section id="cosmic-about" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
              <RingedPlanetIcon className="w-5 h-5 text-cyan-400" />
              <h2 className="font-orbitron font-bold text-lg sm:text-xl tracking-wider text-white uppercase">
                ABOUT ME
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/60 to-transparent ml-2" />
            </div>

            {/* 2-Column Mission Briefing Card */}
            <div className="rounded-2xl border border-[#202C40] bg-[#0c1222]/80 backdrop-blur-md p-5 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.5)] grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Left Column: Portrait */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-cyan-500/40 shadow-[0_0_25px_rgba(75,229,255,0.2)] bg-slate-900 group">
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile?.fullName || "Cosmic Explorer"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0b162c] to-[#070B14] p-4 text-center">
                      <FloatingAstronautSVG className="w-24 h-24 mb-2 opacity-90" />
                      <span className="font-orbitron text-[10px] text-cyan-300 font-semibold tracking-wider">
                        MISSION PILOT
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 border border-cyan-400/20 rounded-2xl pointer-events-none" />
                </div>
              </div>

              {/* Right Column: Mission Briefing Content */}
              <div className="md:col-span-8 space-y-4 text-left">
                <div className="inline-block text-[11px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
                  MISSION BRIEFING
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  {profile?.bio ||
                    profile?.longBio ||
                    `I'm ${profile?.fullName || "Jay"}, a passionate developer who loves building modern web experiences. I enjoy turning ideas into interactive products and exploring new technologies that push the boundaries of what's possible.`}
                </p>

                {/* Location & Availability Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-2 border-t border-[#202C40]/60">
                  {(profile?.location || "New Delhi, India") && (
                    <div className="flex items-center gap-1.5 text-cyan-300">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{profile?.location || "New Delhi, India"}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{profile?.statusBadge || "Available for new opportunities"}</span>
                  </div>
                </div>

                {/* Configured Social Icons */}
                <div className="flex items-center gap-2.5 pt-2">
                  {socialLinks && socialLinks.length > 0 ? (
                    socialLinks.map((link) => {
                      const IconComp = getSocialIcon(link.platform);
                      return (
                        <SafeExternalLink
                          key={link.id}
                          href={link.url}
                          className="w-8 h-8 rounded-lg border border-[#202C40] bg-slate-900/80 hover:bg-cyan-950/80 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all shadow-sm"
                          aria-label={link.platform}
                        >
                          <IconComp className="w-4 h-4" />
                        </SafeExternalLink>
                      );
                    })
                  ) : (
                    // Default fallback links matching reference
                    [
                      { platform: "github", url: "https://github.com", icon: GithubIcon },
                      { platform: "linkedin", url: "https://linkedin.com", icon: LinkedinIcon },
                      { platform: "x", url: "https://twitter.com", icon: TwitterIcon },
                      { platform: "instagram", url: "https://instagram.com", icon: InstagramIcon },
                      { platform: "youtube", url: "https://youtube.com", icon: YoutubeIcon },
                    ].map((item) => {
                      const IconComp = item.icon;
                      return (
                        <a
                          key={item.platform}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg border border-[#202C40] bg-slate-900/80 hover:bg-cyan-950/80 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all shadow-sm"
                        >
                          <IconComp className="w-4 h-4" />
                        </a>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </section>
        </SectionErrorBoundary>
      )}

      {/* ── 4. SKILLS & TECHNOLOGIES SECTION ─────────────────────────────────── */}
      {isSectionVisible("skills") && (
        <SectionErrorBoundary sectionName="Skills & Technologies">
          <section id="cosmic-skills" className="max-w-5xl mx-auto px-4 sm:px-6 py-14 scroll-mt-20">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-2">
              <RingedPlanetIcon className="w-5 h-5 text-cyan-400" />
              <h2 className="font-orbitron font-bold text-lg sm:text-xl tracking-wider text-white uppercase">
                SKILLS &amp; TECHNOLOGIES
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/60 to-transparent ml-2" />
            </div>

            <p className="text-xs font-mono text-slate-400 mb-6 text-left">
              Tools and technologies I work with.
            </p>

            {/* Responsive Grid: 5 across on desktop, 3 on tablet, 2 on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {displaySkills.map((skill, idx) => {
                const IconComp = skill.icon || Atom;
                return (
                  <div
                    key={`${skill.name}-${idx}`}
                    className="p-3.5 rounded-xl border border-[#202C40] bg-[#0c1222]/70 hover:bg-[#111a30] hover:border-cyan-400/60 transition-all duration-300 text-left flex items-center gap-3 group shadow-sm hover:shadow-[0_4px_16px_rgba(75,229,255,0.15)]"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${skill.color}15`, color: skill.color }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {skill.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider truncate">
                        {skill.category}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </SectionErrorBoundary>
      )}

      {/* ── 5. WORK EXPERIENCE (Orbital Timeline) ────────────────────────────── */}
      {isSectionVisible("experience") && experience && experience.length > 0 && (
        <SectionErrorBoundary sectionName="Work Experience">
          <section id="cosmic-experience" className="max-w-5xl mx-auto px-4 sm:px-6 py-14 scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <h2 className="font-orbitron font-bold text-lg sm:text-xl tracking-wider text-white uppercase">
                EXPEDITIONS &amp; EXPERIENCE
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/60 to-transparent ml-2" />
            </div>

            <div className="relative pl-6 sm:pl-8 border-l border-cyan-500/30 space-y-8 text-left">
              {experience.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Glowing orbital waypoint node */}
                  <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#070B14] border-2 border-cyan-400 group-hover:bg-cyan-400 shadow-[0_0_10px_#4BE5FF] transition-colors" />

                  <div className="p-5 rounded-xl border border-[#202C40] bg-[#0c1222]/80 backdrop-blur space-y-2 group-hover:border-cyan-400/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-orbitron font-bold text-sm sm:text-base text-white text-left">
                        {exp.role}
                      </h3>
                      <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-800/40 shrink-0">
                        {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-400">
                      {exp.company} {exp.location ? `· ${exp.location}` : ""}
                    </div>

                    {exp.description && (
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">
                        {exp.description}
                      </p>
                    )}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {exp.highlights.map((h, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-[#202C40] text-slate-400">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </SectionErrorBoundary>
      )}

      {/* ── 6. EDUCATION (Orbital Waypoints) ─────────────────────────────────── */}
      {isSectionVisible("education") && education && education.length > 0 && (
        <SectionErrorBoundary sectionName="Education">
          <section id="cosmic-education" className="max-w-5xl mx-auto px-4 sm:px-6 py-14 scroll-mt-20">
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <h2 className="font-orbitron font-bold text-lg sm:text-xl tracking-wider text-white uppercase">
                ACADEMIA &amp; KNOWLEDGE
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/60 to-transparent ml-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-5 rounded-xl border border-[#202C40] bg-[#0c1222]/80 backdrop-blur space-y-2 hover:border-cyan-400/50 transition-colors"
                >
                  <div className="text-[10px] font-mono text-cyan-300">
                    {edu.startDate} — {edu.endDate || "Present"}
                  </div>
                  <h3 className="font-orbitron font-bold text-sm text-white">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                  </h3>
                  <div className="text-xs font-mono text-slate-400">{edu.institution}</div>
                  {edu.description && (
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </SectionErrorBoundary>
      )}

      {/* ── 7. EXPLORED WORLDS & PROJECTS ────────────────────────────────────── */}
      {isSectionVisible("projects") && projects && projects.length > 0 && (
        <SectionErrorBoundary sectionName="Projects">
          <section id="cosmic-projects" className="max-w-5xl mx-auto px-4 sm:px-6 py-14 scroll-mt-20">
            <div className="flex items-center gap-3 mb-2">
              <FolderGit2 className="w-5 h-5 text-cyan-400" />
              <h2 className="font-orbitron font-bold text-lg sm:text-xl tracking-wider text-white uppercase">
                EXPLORED WORLDS &amp; PROJECTS
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/60 to-transparent ml-2" />
            </div>

            <p className="text-xs font-mono text-slate-400 mb-8 text-left">
              Mission deliverables, open source platforms, and engineering systems.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-[#202C40] bg-[#0c1222]/80 backdrop-blur overflow-hidden flex flex-col justify-between hover:border-cyan-400/60 hover:shadow-[0_8px_30px_rgba(75,229,255,0.18)] transition-all duration-300 group"
                >
                  <div>
                    {/* Thumbnail frame */}
                    <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden border-b border-[#202C40]">
                      {proj.coverImageUrl ? (
                        <img
                          src={proj.coverImageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0c172d] to-[#070B14]">
                          <RingedPlanetIcon className="w-8 h-8 text-cyan-400/50 mb-1" />
                          <span className="font-orbitron text-[10px] text-cyan-400/60">SECTOR {proj.title.slice(0, 3).toUpperCase()}</span>
                        </div>
                      )}
                      {proj.featured && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 font-mono text-[9px] font-bold tracking-wider">
                          FEATURED
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-orbitron font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {proj.description}
                      </p>

                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.technologies.slice(0, 3).map((t) => (
                            <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-[#202C40] text-slate-400">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Links Row */}
                  <div className="p-4 pt-1 border-t border-[#202C40]/50 flex items-center gap-2">
                    {proj.liveUrl && (
                      <SafeExternalLink
                        href={proj.liveUrl}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </SafeExternalLink>
                    )}
                    {proj.repoUrl && (
                      <SafeExternalLink
                        href={proj.repoUrl}
                        className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-[#202C40] text-slate-300 hover:text-white text-[11px] font-mono flex items-center justify-center gap-1 transition-colors"
                        aria-label="Source code"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </SafeExternalLink>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </SectionErrorBoundary>
      )}

      {/* ── 8. TRANSMISSION CONTACT & SOCIAL ─────────────────────────────────── */}
      {isSectionVisible("contact") && (
        <SectionErrorBoundary sectionName="Contact">
          <section id="cosmic-contact" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20 text-center">
            <div className="p-8 sm:p-12 rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0c1426] to-[#070B14] shadow-[0_0_50px_rgba(75,229,255,0.12)] space-y-4">
              <div className="w-12 h-12 rounded-full border border-cyan-400/50 bg-cyan-950/60 text-cyan-300 flex items-center justify-center mx-auto mb-2">
                <RingedPlanetIcon className="w-6 h-6" />
              </div>

              <h2 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
                INITIATE TRANSMISSION
              </h2>

              <p className="text-xs sm:text-sm font-mono text-slate-300 max-w-md mx-auto leading-relaxed">
                Open to mission collaborations, engineering roles, and exploratory projects across the cosmos.
              </p>

              <div className="pt-4 flex justify-center">
                <a
                  href={`mailto:${profile?.email || "contact@portfolify.dev"}`}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/30 text-white font-orbitron text-xs sm:text-sm font-bold tracking-wider shadow-[0_0_25px_rgba(75,229,255,0.3)] transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-cyan-300" />
                  <span>{profile?.email || "SEND MESSAGE"}</span>
                </a>
              </div>
            </div>
          </section>
        </SectionErrorBoundary>
      )}

      {/* ── 9. MINIMAL COSMIC FOOTER ─────────────────────────────────────────── */}
      <footer className="w-full border-t border-[#202C40]/60 py-8 px-4 sm:px-6 text-center text-xs font-mono text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <RingedPlanetIcon className="w-4 h-4" />
            <span className="font-orbitron font-bold text-white text-[11px] uppercase">
              {profile?.fullName || "Cosmic Orbit"}
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} {profile?.fullName || "Cosmic Orbit"}. All rights reserved across the galaxy.
          </div>
        </div>
      </footer>
    </article>
  );
}

export default CosmicOrbitTemplate;
