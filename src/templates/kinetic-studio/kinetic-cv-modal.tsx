/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef } from "react";
import { PortfolioData } from "@/lib/schema/portfolio";
import { Printer, X, FileText, ExternalLink } from "lucide-react";

interface KineticCvModalProps {
  portfolio: PortfolioData;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Builds standalone, bulletproof HTML for printing/saving the CV as PDF.
 * Uses inline, self-contained CSS so it never conflicts with parent modal/editor styles.
 */
function buildCvPrintHtml(portfolio: PortfolioData): string {
  const { profile, skills, experience, education, socialLinks } = portfolio;
  const displayName = profile.fullName?.trim() || "YOUR NAME";
  const displayPhone = profile.phone?.trim() || "";
  const displayEmail = profile.email?.trim() || "";
  const websiteSocial = socialLinks?.find(
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
    "Experienced developer specializing in modern web applications, scalable cloud infrastructure, and user-centered digital products.";

  const skillsList = skills || [];
  const techSkillsList =
    skillsList.length > 0
      ? skillsList.slice(0, 6).map((s, idx) => ({
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
      : [
          { name: "TypeScript / JavaScript", percentage: 90 },
          { name: "React & Next.js", percentage: 88 },
          { name: "Tailwind CSS", percentage: 85 },
          { name: "Node.js & APIs", percentage: 80 },
        ];

  const skillsBullets =
    skillsList.length > 0
      ? skillsList.map((s) => `Proficiency in ${s.name} and related modern ecosystem tools.`).slice(0, 5)
      : [
          "Modern responsive web design and component architecture.",
          "RESTful API design and database integrations.",
          "Performance optimization, SEO best practices, and code reliability.",
        ];

  const experienceList =
    experience && experience.length > 0
      ? experience
      : [
          {
            id: "exp-default",
            role: "Software Developer",
            company: "Technology Studio",
            location: "Remote",
            startDate: "2022",
            endDate: "Present",
            current: true,
            description:
              "Built high-performance web applications and engineered user interfaces with modern tech stacks.",
            highlights: [],
            order: 0,
          },
        ];

  const educationList =
    education && education.length > 0
      ? education
      : [
          {
            id: "edu-default",
            institution: "University / Institution",
            degree: "Bachelor's Degree",
            fieldOfStudy: "Computer Science / Design",
            startDate: "2018",
            endDate: "2022",
            description: "",
            order: 0,
          },
        ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${displayName} - CV</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #ffffff !important;
      color: #0f172a;
      width: 100%;
      line-height: 1.4;
      font-size: 12px;
      padding: 10px;
    }
    .cv-sheet {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
    }
    .header-row {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;
    }
    .avatar-wrap {
      width: 115px;
      height: 115px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      border: 4px solid #f1f5f9;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 900;
      color: #475569;
    }
    .avatar-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .peach-card {
      flex: 1;
      background-color: #f7a072 !important;
      border-radius: 24px;
      padding: 20px 24px;
      color: #000000;
    }
    .peach-card h1 {
      font-size: 24px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 6px;
      color: #000000;
    }
    .peach-card p {
      font-size: 12px;
      font-weight: 500;
      color: rgba(0,0,0,0.85);
      margin: 2px 0;
    }
    .columns-row {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }
    .left-col {
      width: 38%;
      background-color: #eef0f3 !important;
      border-radius: 24px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .right-col {
      width: 60%;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-right: 6px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .summary-text {
      font-size: 11px;
      color: #334155;
      line-height: 1.5;
      white-space: pre-line;
    }
    .skill-bar-row {
      margin-bottom: 9px;
    }
    .skill-name {
      font-size: 10px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 3px;
    }
    .bar-bg {
      width: 100%;
      height: 7px;
      background-color: #cbd5e1 !important;
      border-radius: 999px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      background-color: #f7a072 !important;
      border-radius: 999px;
    }
    .bullet-list {
      padding-left: 16px;
      font-size: 11px;
      color: #334155;
      line-height: 1.5;
    }
    .bullet-list li {
      margin-bottom: 4px;
    }
    .exp-item {
      margin-bottom: 12px;
    }
    .exp-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: #0f172a;
    }
    .exp-company {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #475569;
      margin: 1px 0 3px 0;
    }
    .exp-desc {
      font-size: 11px;
      color: #334155;
      line-height: 1.4;
    }
    .edu-item {
      margin-bottom: 8px;
    }
    .edu-inst {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: #0f172a;
    }
    .edu-degree {
      font-size: 11px;
      color: #334155;
    }
    .footer-watermark {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      font-family: monospace;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="cv-sheet">
    <!-- Header -->
    <div class="header-row">
      <div class="avatar-wrap">
        ${
          profile.avatarUrl
            ? `<img src="${profile.avatarUrl}" alt="${displayName}" />`
            : `<span>${displayName.charAt(0) || "U"}</span>`
        }
      </div>
      <div class="peach-card">
        <h1>${displayName}</h1>
        ${displayPhone ? `<p>${displayPhone}</p>` : ""}
        ${displayEmail ? `<p>${displayEmail}</p>` : ""}
        ${displayWebsite ? `<p>${displayWebsite}</p>` : ""}
      </div>
    </div>

    <!-- Body Columns -->
    <div class="columns-row">
      <!-- Left Column -->
      <div class="left-col">
        <div>
          <div class="section-title">Summary</div>
          <div class="summary-text">${displayBio}</div>
        </div>

        <div>
          <div class="section-title">Tech Skills</div>
          ${techSkillsList
            .map(
              (s) => `
            <div class="skill-bar-row">
              <div class="skill-name">${s.name}</div>
              <div class="bar-bg">
                <div class="bar-fill" style="width: ${s.percentage}%"></div>
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-col">
        <div>
          <div class="section-title">Skills</div>
          <ul class="bullet-list">
            ${skillsBullets.map((b) => `<li>${b}</li>`).join("")}
          </ul>
        </div>

        <div>
          <div class="section-title">Experience</div>
          ${experienceList
            .map(
              (exp) => `
            <div class="exp-item">
              <div class="exp-title">${exp.role || "ENGINEER"} - ${exp.startDate || "2020"} - ${exp.current ? "PRESENT" : exp.endDate || "PRESENT"}</div>
              <div class="exp-company">${exp.company}${exp.location ? `, ${exp.location}` : ""}</div>
              ${
                exp.description
                  ? `<div class="exp-desc">${exp.description}</div>`
                  : ""
              }
            </div>`
            )
            .join("")}
        </div>

        <div>
          <div class="section-title">Education</div>
          ${educationList
            .map(
              (edu) => `
            <div class="edu-item">
              <div class="edu-inst">${edu.institution}</div>
              <div class="edu-degree">${edu.degree}${edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ""}${edu.endDate ? ` (${edu.endDate})` : ""}</div>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </div>

    <!-- Watermark -->
    <div class="footer-watermark">
      <span>PORTFOLIFY &bull; GENERATED CV</span>
      <span>COOLFREECV</span>
    </div>
  </div>
</body>
</html>`;
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

  const techSkillsList =
    skills && skills.length > 0
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

  const skillsBullets =
    skills && skills.length > 0
      ? skills.map((s) => `Proficiency in ${s.name} and related modern ecosystem tools.`).slice(0, 6)
      : [];

  const experienceList = experience && experience.length > 0 ? experience : [];
  const educationList = education && education.length > 0 ? education : [];

  const handlePrint = () => {
    if (typeof window === "undefined") return;

    // Remove any previously created print iframe
    const existing = document.getElementById("portfolify-cv-print-frame");
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    // Build standalone HTML with zero dependencies
    const htmlContent = buildCvPrintHtml(portfolio);

    // Create a real-sized off-screen iframe (NOT 0x0) so Chromium lays out the page box properly
    const iframe = document.createElement("iframe");
    iframe.id = "portfolify-cv-print-frame";
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "850px";
    iframe.style.height = "1200px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(htmlContent);
    doc.close();

    // Give browser paint engine time to render before triggering native print
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error("Print iframe error, fallback to window.print", err);
        window.print();
      }
    }, 350);
  };

  const handleOpenNewTab = () => {
    if (typeof window === "undefined") return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(buildCvPrintHtml(portfolio));
      printWindow.document.close();
      printWindow.focus();
    }
  };

  return (
    <div
      id="kinetic-cv-modal-root"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-6"
    >
      {/* Top Floating Control Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between py-3 px-4 mb-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur text-white shrink-0">
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
          {/* Open in full tab option */}
          <button
            type="button"
            onClick={handleOpenNewTab}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
            title="Open printable CV full page in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Tab</span>
          </button>

          {/* Download / Print PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ff5c1a] hover:bg-[#e04f14] text-white font-semibold text-xs transition-colors shadow-lg shadow-orange-600/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download / Print PDF</span>
          </button>

          {/* Close Modal */}
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

      {/* Printable Sheet Wrapper (In-modal visual preview) */}
      <div
        ref={printContainerRef}
        id="kinetic-cv-paper"
        className="w-full max-w-[820px] bg-white text-slate-900 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] p-8 sm:p-12 overflow-hidden"
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
                {displayBio ||
                  "Experienced developer specializing in modern web applications, scalable cloud infrastructure, and user-centered digital products."}
              </p>
            </div>

            {/* Tech Skills with Orange Progress Bars */}
            <div className="space-y-4 pt-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Tech Skills
              </h2>
              <div className="space-y-3.5">
                {(techSkillsList.length > 0
                  ? techSkillsList
                  : [
                      { name: "TypeScript / JavaScript", percentage: 90 },
                      { name: "React & Next.js", percentage: 88 },
                      { name: "Tailwind CSS", percentage: 85 },
                      { name: "Node.js & APIs", percentage: 80 },
                    ]
                ).map((skill, i) => (
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
                {(skillsBullets.length > 0
                  ? skillsBullets
                  : [
                      "Modern responsive web design and component architecture.",
                      "RESTful API design and database integrations.",
                      "Performance optimization, SEO best practices, and code reliability.",
                    ]
                ).map((bullet, idx) => (
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
                {(experienceList.length > 0
                  ? experienceList
                  : [
                      {
                        id: "default-exp",
                        role: "Software Developer",
                        company: "Technology Studio",
                        location: "Remote",
                        startDate: "2022",
                        endDate: "Present",
                        current: true,
                        description:
                          "Built high-performance web applications and engineered user interfaces with modern tech stacks.",
                        highlights: [],
                      },
                    ]
                ).map((exp, idx) => {
                  const duties = exp.description
                    ? exp.description
                        .split("\n")
                        .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
                        .filter(Boolean)
                    : [];

                  return (
                    <div key={exp.id || idx} className="space-y-1">
                      <h3 className="text-xs font-bold uppercase text-slate-900">
                        {exp.role || "ENGINEER"} - {exp.startDate || "2020"} -{" "}
                        {exp.endDate || "PRESENT"}
                      </h3>
                      <div className="text-[11px] font-bold uppercase text-slate-600">
                        {exp.company}
                        {exp.location ? `, ${exp.location}` : ""}
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
                {(educationList.length > 0
                  ? educationList
                  : [
                      {
                        id: "default-edu",
                        institution: "University / Institution",
                        degree: "Bachelor's Degree",
                        fieldOfStudy: "Computer Science / Design",
                        startDate: "2018",
                        endDate: "2022",
                        description: "",
                      },
                    ]
                ).map((edu, idx) => (
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
    </div>
  );
}

export default KineticCvModal;
