/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef } from "react";
import { PortfolioData } from "@/lib/schema/portfolio";
import { Printer, X, FileText } from "lucide-react";

interface KineticCvModalProps {
  portfolio: PortfolioData;
  isOpen: boolean;
  onClose: () => void;
}

export function KineticCvModal({ portfolio, isOpen, onClose }: KineticCvModalProps) {
  const { profile, skills, experience, education } = portfolio;
  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const displayName = profile.fullName?.trim() || "";
  const displayPhone = profile.phone?.trim() || "";
  const displayEmail = profile.email?.trim() || "";
  const websiteSocial = portfolio.socialLinks?.find(
    (s) => s.platform === "website" || s.platform === "other"
  );
  const displayWebsite =
    websiteSocial?.url ||
    (portfolio.customDomain?.domain
      ? `https://${portfolio.customDomain.domain}`
      : portfolio.seo?.canonicalUrl || "");

  const displayBio =
    profile.bio?.trim() ||
    profile.longBio?.trim() ||
    "";

  // Tech skills with progress percentages (Only shown when skills exist)
  const techSkillsList = (skills && skills.length > 0)
    ? skills.slice(0, 6).map((s, idx) => ({
        name: s.name,
        percentage:
          s.level === "expert"
            ? 92
            : s.level === "advanced"
            ? 82
            : s.level === "intermediate"
            ? 70
            : 60 + ((idx * 7) % 30),
      }))
    : [];

  // Core competency bullet points (Only from user skills)
  const skillsBullets = (skills && skills.length > 0)
    ? skills.map((s) => `Proficiency in ${s.name} and related modern ecosystem tools.`).slice(0, 6)
    : [];

  // Work experience entries (Only from user experience)
  const experienceList = (experience && experience.length > 0)
    ? experience
    : [];

  // Education entries (Only from user education)
  const educationList = (education && education.length > 0)
    ? education
    : [];

  const handlePrint = () => {
    if (typeof window === "undefined") return;

    const paper = document.getElementById("kinetic-cv-paper");
    if (!paper) {
      window.print();
      return;
    }

    // Collect all stylesheets from parent document (Tailwind, global CSS, custom fonts)
    let stylesHtml = "";
    document.querySelectorAll("link[rel='stylesheet'], style").forEach((node) => {
      stylesHtml += node.outerHTML;
    });

    // Create an isolated hidden iframe for printing to avoid parent overflow:hidden clipping
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${displayName ? `${displayName} - CV` : "Curriculum Vitae"}</title>
          ${stylesHtml}
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              color: #0f172a !important;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              width: 100% !important;
              min-height: auto !important;
              overflow: visible !important;
            }
            #kinetic-cv-paper {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              overflow: visible !important;
              background: #ffffff !important;
              color: #0f172a !important;
            }
          </style>
        </head>
        <body>
          ${paper.outerHTML}
        </body>
      </html>
    `);
    doc.close();

    // Allow browser layout engine to paint content before print dialog opens
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error("Print iframe failed, fallback to window.print", err);
        window.print();
      } finally {
        setTimeout(() => {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 1500);
      }
    }, 280);
  };

  return (
    <div
      id="kinetic-cv-modal-root"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto"
    >
      {/* Top Floating Control Bar (Hidden on print) */}
      <div className="w-full max-w-4xl flex items-center justify-between py-3 px-4 mb-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur text-white print:hidden shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#ff5c1a]" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
              Generated Curriculum Vitae (CV)
            </h2>
            <p className="text-[10px] text-zinc-400 hidden sm:block">
              Formatted in Christine Smith editorial layout from your uploaded profile data
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ff5c1a] hover:bg-[#e04f14] text-white font-semibold text-xs transition-colors shadow-lg shadow-orange-600/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download / Print PDF</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close CV preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable Sheet Wrapper */}
      <div
        ref={printContainerRef}
        id="kinetic-cv-paper"
        className="w-full max-w-[820px] bg-white text-slate-900 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] p-8 sm:p-12 overflow-hidden print:shadow-none print:rounded-none print:p-6 print:max-w-none print:w-full print:m-0"
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        {/* HEADER: Photo on Left + Peach Rounded Pill Card on Right */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pb-4">
          {/* Profile Photo */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-slate-100 shadow-md shrink-0 bg-slate-100 flex items-center justify-center">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-600 text-3xl font-black">
                {displayName.charAt(0) || "U"}
              </div>
            )}
          </div>

          {/* Peach / Orange Header Pill Card */}
          <div
            className="flex-1 w-full rounded-[28px] p-6 sm:p-7 text-black shadow-sm"
            style={{ backgroundColor: "#f7a072" }}
          >
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-black">
              {displayName || "YOUR NAME"}
            </h1>
            <div className="mt-2.5 space-y-1 text-xs sm:text-sm font-medium text-black/85">
              {displayPhone && <p>{displayPhone}</p>}
              {displayEmail && <p>{displayEmail}</p>}
              {displayWebsite && <p className="truncate">{displayWebsite}</p>}
            </div>
          </div>
        </div>

        {/* BODY TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 mt-6">
          {/* LEFT COLUMN: Light Grey Pill Card with Summary & Tech Skills */}
          <div
            className="md:col-span-5 rounded-[28px] p-6 sm:p-7 flex flex-col justify-between space-y-8"
            style={{ backgroundColor: "#eef0f3" }}
          >
            {/* Summary */}
            <div className="space-y-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Summary
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {displayBio || "Experienced developer specializing in modern web applications, scalable cloud infrastructure, and user-centered digital products."}
              </p>
            </div>

            {/* Tech Skills with Orange Progress Bars */}
            <div className="space-y-4 pt-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Tech Skills
              </h2>
              <div className="space-y-3.5">
                {(techSkillsList.length > 0 ? techSkillsList : [
                  { name: "TypeScript / JavaScript", percentage: 90 },
                  { name: "React & Next.js", percentage: 88 },
                  { name: "Tailwind CSS", percentage: 85 },
                  { name: "Node.js & APIs", percentage: 80 },
                ]).map((skill, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-800">
                      {skill.name}
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-300 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${skill.percentage}%`,
                          backgroundColor: "#f7a072",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Skills Bullets, Experience, Education */}
          <div className="md:col-span-7 space-y-6 sm:space-y-7 px-1 sm:px-2">
            {/* Skills */}
            <div className="space-y-2.5">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Skills
              </h2>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-outside pl-4 leading-relaxed">
                {(skillsBullets.length > 0 ? skillsBullets : [
                  "Modern responsive web design and component architecture.",
                  "RESTful API design and database integrations.",
                  "Performance optimization, SEO best practices, and code reliability.",
                ]).map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            </div>

            {/* Experience */}
            <div className="space-y-4 pt-1">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Experience
              </h2>
              <div className="space-y-4">
                {(experienceList.length > 0 ? experienceList : [
                  {
                    id: "default-exp",
                    role: "Software Developer",
                    company: "Technology Studio",
                    location: "Remote",
                    startDate: "2022",
                    endDate: "Present",
                    current: true,
                    description: "Built high-performance web applications and engineered user interfaces with modern tech stacks.",
                    highlights: [],
                  },
                ]).map((exp, idx) => {
                  const duties = exp.description
                    ? exp.description
                        .split("\n")
                        .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
                        .filter(Boolean)
                    : [];

                  return (
                    <div key={exp.id || idx} className="space-y-1">
                      <h3 className="text-xs font-bold uppercase text-slate-900">
                        {exp.role || "ENGINEER"} - {exp.startDate || "2020"} - {exp.endDate || "PRESENT"}
                      </h3>
                      <div className="text-[11px] font-bold uppercase text-slate-600">
                        {exp.company}{exp.location ? `, ${exp.location}` : ""}
                      </div>
                      {duties.length > 0 ? (
                        <ul className="space-y-1 text-xs text-slate-700 list-disc list-outside pl-4 pt-1 leading-relaxed">
                          {duties.map((duty, dIdx) => (
                            <li key={dIdx}>{duty}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-700 pt-1 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2.5 pt-1">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Education
              </h2>
              <div className="space-y-3">
                {(educationList.length > 0 ? educationList : [
                  {
                    id: "default-edu",
                    institution: "University / Institution",
                    degree: "Bachelor's Degree",
                    fieldOfStudy: "Computer Science / Design",
                    startDate: "2018",
                    endDate: "2022",
                    description: "",
                  },
                ]).map((edu, idx) => (
                  <div key={edu.id || idx} className="space-y-0.5">
                    <h3 className="text-xs font-bold uppercase text-slate-900">
                      {edu.institution}
                    </h3>
                    <p className="text-xs text-slate-700">
                      {edu.degree}
                      {edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ""}
                      {edu.endDate ? ` (${edu.endDate})` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Watermark Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono select-none">
          <span>PORTFOLIFY &bull; GENERATED CV</span>
          <span>COOLFREECV</span>
        </div>
      </div>

      {/* Direct window.print CSS fallback */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          html, body {
            overflow: visible !important;
            height: auto !important;
            background: #ffffff !important;
          }
          body > *:not(#kinetic-cv-modal-root) {
            display: none !important;
          }
          #kinetic-cv-modal-root {
            position: static !important;
            display: block !important;
            overflow: visible !important;
            padding: 0 !important;
            background: #ffffff !important;
            backdrop-filter: none !important;
          }
          #kinetic-cv-paper {
            position: relative !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `,
        }}
      />
    </div>
  );
}

export default KineticCvModal;
