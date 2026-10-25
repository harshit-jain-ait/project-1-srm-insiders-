"use client";

import React from "react";
import { Project } from "@/lib/schema/portfolio";
import { sanitizeEmbedUrl } from "@/lib/assets/embed-sanitizer";
import { GithubIcon } from "@/components/ui/icons";
import {
  ExternalLink,
  Calendar,
  User,
  Users,
  Briefcase,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Quote,
  CheckCircle2,
} from "lucide-react";

interface CaseStudyRendererProps {
  project: Project;
  authorName?: string;
  theme?: "dark" | "light";
  className?: string;
  showBackLink?: boolean;
  backHref?: string;
}

export function CaseStudyRenderer({
  project,
  authorName,
  theme = "dark",
  className = "",
  showBackLink = false,
  backHref,
}: CaseStudyRendererProps) {
  const isDark = theme === "dark";
  const caseStudy = project.caseStudy;
  const sections = (caseStudy?.sections || []).filter((s) => s.visible !== false);

  const containerBg = isDark ? "bg-zinc-950 text-zinc-100" : "bg-white text-zinc-900";
  const cardBg = isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-zinc-50 border-zinc-200";
  const textMuted = isDark ? "text-zinc-400" : "text-zinc-600";
  const headingColor = isDark ? "text-white" : "text-zinc-950";

  return (
    <article className={`w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-16 ${containerBg} ${className}`}>
      {/* Optional Back to Portfolio Link */}
      {showBackLink && backHref && (
        <div className="border-b border-zinc-800/80 pb-6">
          <a
            href={backHref}
            className={`inline-flex items-center gap-1.5 text-xs font-mono transition-colors ${
              isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            <span>← Back to {authorName ? `${authorName}'s Portfolio` : "Portfolio"}</span>
          </a>
        </div>
      )}

      {/* Case Study Header & Hero */}
      <header className="space-y-6">
        {/* Badges Bar: Category & Status */}
        <div className="flex flex-wrap items-center gap-2">
          {project.category && (
            <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#356ae6]/10 text-[#356ae6] border border-[#356ae6]/30">
              {project.category}
            </span>
          )}
          {project.status && (
            <span
              className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                project.status === "completed"
                  ? isDark
                    ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/60"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : isDark
                  ? "bg-zinc-800 text-zinc-400 border-zinc-700"
                  : "bg-zinc-100 text-zinc-600 border-zinc-300"
              }`}
            >
              {project.status.replace("_", " ")}
            </span>
          )}
          {project.featured && (
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-950/40 text-amber-400 border border-amber-800/60">
              ★ Featured
            </span>
          )}
        </div>

        {/* Project Title */}
        <h1 className={`text-3xl sm:text-5xl font-bold tracking-tight leading-tight ${headingColor}`}>
          {project.title}
        </h1>

        {/* Tagline / Executive Summary */}
        {(project.tagline || caseStudy?.overview) && (
          <p className={`text-lg sm:text-xl font-light leading-relaxed max-w-3xl ${textMuted}`}>
            {project.tagline || caseStudy?.overview}
          </p>
        )}

        {/* Project Metadata Grid */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border text-xs ${cardBg}`}>
          {caseStudy?.role && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 flex items-center gap-1">
                <User className="w-3 h-3" />
                Role
              </span>
              <p className="font-medium text-white">{caseStudy.role}</p>
            </div>
          )}

          {caseStudy?.team && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Team
              </span>
              <p className="font-medium text-white">{caseStudy.team}</p>
            </div>
          )}

          {caseStudy?.client && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                Client / Org
              </span>
              <p className="font-medium text-white">{caseStudy.client}</p>
            </div>
          )}

          {(project.startDate || project.endDate || caseStudy?.timeline) && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Timeline
              </span>
              <p className="font-medium text-white">
                {caseStudy?.timeline || `${project.startDate || ""} - ${project.endDate || "Present"}`}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons: Live Demo & Repository Links */}
        {(project.liveUrl || project.repoUrl) && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#356ae6] text-white hover:bg-[#2e5cd0] transition-colors shadow-sm"
              >
                <span>Live Project Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-zinc-200 hover:text-white hover:bg-zinc-800"
                    : "bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-100"
                }`}
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Source Repository</span>
              </a>
            )}
          </div>
        )}

        {/* Technologies Pills */}
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-xs font-mono text-zinc-500 mr-1 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Stack:
            </span>
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-md border ${
                  isDark
                    ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                    : "bg-zinc-100 border-zinc-200 text-zinc-700"
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Cover Image */}
        {project.coverImageUrl && (
          <div className="pt-4 overflow-hidden rounded-2xl border border-zinc-800 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="w-full h-auto max-h-[500px] object-cover"
              loading="eager"
            />
          </div>
        )}
      </header>

      {/* Case Study Sections Body */}
      {sections.length > 0 ? (
        <div className="space-y-16">
          {sections.map((section) => (
            <section key={section.id} className="space-y-6 scroll-mt-24">
              {/* Section Header */}
              {section.title && (
                <h2 className={`text-2xl sm:text-3xl font-semibold tracking-tight ${headingColor}`}>
                  {section.title}
                </h2>
              )}

              {/* SECTION TYPE 1: Standard Rich Text */}
              {section.type === "text" && section.content && (
                <div className={`prose ${isDark ? "prose-invert" : ""} max-w-none text-sm sm:text-base leading-relaxed space-y-4 font-light ${textMuted}`}>
                  {section.content.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}

              {/* SECTION TYPE 2: Problem & Solution Split Card */}
              {section.type === "problem_solution" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-2xl border space-y-3 ${isDark ? "bg-red-950/10 border-red-900/40" : "bg-red-50/50 border-red-200"}`}>
                    <h3 className="text-sm font-semibold text-red-400 uppercase font-mono tracking-wider flex items-center gap-2">
                      The Challenge
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDark ? "text-red-200/80" : "text-red-900"}`}>
                      {section.content || "Challenge description not supplied."}
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border space-y-3 ${isDark ? "bg-emerald-950/10 border-emerald-900/40" : "bg-emerald-50/50 border-emerald-200"}`}>
                    <h3 className="text-sm font-semibold text-emerald-400 uppercase font-mono tracking-wider flex items-center gap-2">
                      The Solution
                    </h3>
                    {section.bullets && section.bullets.length > 0 ? (
                      <ul className="space-y-2 text-sm">
                        {section.bullets.map((b, idx) => (
                          <li key={idx} className={`flex items-start gap-2 ${isDark ? "text-emerald-200/80" : "text-emerald-900"}`}>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-sm leading-relaxed ${isDark ? "text-emerald-200/80" : "text-emerald-900"}`}>
                        Implementation details not provided.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION TYPE 3: Technical Architecture */}
              {section.type === "technical_architecture" && (
                <div className={`p-6 rounded-2xl border space-y-5 ${cardBg}`}>
                  {section.content && (
                    <p className={`text-sm sm:text-base leading-relaxed ${textMuted}`}>
                      {section.content}
                    </p>
                  )}
                  {section.bullets && section.bullets.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                      <span className="text-xs font-semibold text-white uppercase font-mono tracking-wider">
                        Architectural Decisions & Trade-offs:
                      </span>
                      <ul className="space-y-2 text-sm pt-2">
                        {section.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#356ae6] mt-2 shrink-0" />
                            <span className={textMuted}>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION TYPE 4: Process Steps */}
              {section.type === "process" && section.bullets && section.bullets.length > 0 && (
                <div className="space-y-4">
                  {section.content && (
                    <p className={`text-sm sm:text-base leading-relaxed ${textMuted}`}>
                      {section.content}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {section.bullets.map((step, idx) => (
                      <div key={idx} className={`p-5 rounded-2xl border flex gap-4 ${cardBg}`}>
                        <div className="h-8 w-8 rounded-xl bg-zinc-800 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <p className={`text-sm leading-relaxed ${textMuted}`}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION TYPE 5: Key Metrics & Verified Outcomes */}
              {section.type === "metrics" && section.metrics && section.metrics.length > 0 && (
                <div className="space-y-4">
                  {section.content && (
                    <p className={`text-sm sm:text-base leading-relaxed ${textMuted}`}>
                      {section.content}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.metrics.map((metric) => (
                      <div key={metric.id} className={`p-5 rounded-2xl border space-y-2 ${cardBg}`}>
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                          <span>{metric.period || "Outcome"}</span>
                          <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <div className="text-3xl font-extrabold text-white tracking-tight">
                          {metric.value}
                        </div>
                        <div className="text-xs font-semibold text-zinc-200">
                          {metric.label}
                        </div>
                        {metric.baseline && (
                          <div className="text-[11px] text-zinc-400 font-mono">
                            Baseline: {metric.baseline}
                          </div>
                        )}
                        {metric.context && (
                          <p className="text-[11px] text-zinc-400 font-light pt-1 border-t border-zinc-800/80">
                            {metric.context}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION TYPE 6: Image Gallery */}
              {section.type === "gallery" && section.media && section.media.length > 0 && (
                <div className="space-y-4">
                  {section.content && (
                    <p className={`text-sm sm:text-base leading-relaxed ${textMuted}`}>
                      {section.content}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {section.media.map((item) => (
                      <figure key={item.id} className="space-y-2 overflow-hidden rounded-2xl border border-zinc-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={item.alt || section.title}
                          className="w-full h-auto object-cover max-h-[360px]"
                          loading="lazy"
                        />
                        {item.caption && (
                          <figcaption className="text-xs text-zinc-400 px-3 py-2 italic font-light">
                            {item.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION TYPE 7: Featured Image with Caption */}
              {section.type === "image_caption" && section.media && section.media.length > 0 && (
                <figure className="space-y-2.5 overflow-hidden rounded-2xl border border-zinc-800 shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={section.media[0].url}
                    alt={section.media[0].alt || section.title}
                    className="w-full h-auto object-cover max-h-[500px]"
                    loading="lazy"
                  />
                  {section.media[0].caption && (
                    <figcaption className="text-xs text-zinc-400 px-4 py-2.5 italic font-light text-center">
                      {section.media[0].caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* SECTION TYPE 8: Sandboxed Video Embed */}
              {section.type === "video_embed" && section.embedUrl && (
                <div className="space-y-3">
                  {(() => {
                    const sanitized = sanitizeEmbedUrl(section.embedUrl);
                    if (!sanitized.isValid || !sanitized.embedUrl) {
                      return (
                        <div className="p-4 rounded-xl border border-zinc-800 text-xs text-zinc-400">
                          Video preview unavailable.
                        </div>
                      );
                    }
                    return (
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                        <iframe
                          src={sanitized.embedUrl}
                          title={section.title || "Video Demonstration"}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          sandbox="allow-scripts allow-same-origin allow-presentation"
                          allowFullScreen
                        />
                      </div>
                    );
                  })()}
                  {section.content && (
                    <p className={`text-xs sm:text-sm font-light ${textMuted}`}>
                      {section.content}
                    </p>
                  )}
                </div>
              )}

              {/* SECTION TYPE 9: Interactive Prototype Embed */}
              {section.type === "prototype_embed" && section.embedUrl && (
                <div className="space-y-3">
                  {(() => {
                    const sanitized = sanitizeEmbedUrl(section.embedUrl);
                    if (!sanitized.isValid || !sanitized.embedUrl) {
                      return (
                        <div className="p-4 rounded-xl border border-zinc-800 text-xs text-zinc-400">
                          Prototype embed unavailable.
                        </div>
                      );
                    }
                    return (
                      <div className="relative h-[480px] w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                        <iframe
                          src={sanitized.embedUrl}
                          title={section.title || "Interactive Prototype"}
                          className="absolute inset-0 w-full h-full"
                          sandbox="allow-scripts allow-same-origin"
                          allowFullScreen
                        />
                      </div>
                    );
                  })()}
                  {section.content && (
                    <p className={`text-xs sm:text-sm font-light ${textMuted}`}>
                      {section.content}
                    </p>
                  )}
                </div>
              )}

              {/* SECTION TYPE 10: Milestones Timeline */}
              {section.type === "timeline" && section.timeline && section.timeline.length > 0 && (
                <div className="space-y-6 border-l-2 border-zinc-800 pl-6 ml-3">
                  {section.timeline.map((item) => (
                    <div key={item.id} className="relative space-y-1">
                      <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-[#356ae6] border-2 border-zinc-950" />
                      <div className="text-xs font-mono text-zinc-400">{item.date}</div>
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      {item.description && (
                        <p className={`text-xs leading-relaxed ${textMuted}`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* SECTION TYPE 11: Quote / Testimonial */}
              {section.type === "quote" && section.quote && (
                <blockquote className={`p-6 rounded-2xl border space-y-3 ${cardBg}`}>
                  <Quote className="w-6 h-6 text-blue-400 opacity-60" />
                  <p className="text-base sm:text-lg italic font-light text-zinc-200">
                    &ldquo;{section.quote.quote}&rdquo;
                  </p>
                  {(section.quote.author || section.quote.role) && (
                    <div className="text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/80">
                      <span className="font-semibold text-zinc-200">{section.quote.author}</span>
                      {section.quote.role && ` — ${section.quote.role}`}
                      {section.quote.attributionUrl && (
                        <a
                          href={section.quote.attributionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Reference</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </blockquote>
              )}

              {/* SECTION TYPE 12: Resources & References */}
              {section.type === "links" && section.links && section.links.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-4 rounded-xl border flex items-start justify-between gap-3 group transition-colors ${cardBg} hover:border-zinc-700`}
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors block truncate">
                          {link.title}
                        </span>
                        {link.description && (
                          <p className={`text-xs line-clamp-2 ${textMuted}`}>
                            {link.description}
                          </p>
                        )}
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      ) : (
        /* Fallback if no sections are added yet, but description exists */
        project.description && (
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold tracking-tight ${headingColor}`}>
              About This Project
            </h2>
            <div className={`prose ${isDark ? "prose-invert" : ""} max-w-none text-sm leading-relaxed space-y-4 font-light ${textMuted}`}>
              {project.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        )
      )}
    </article>
  );
}
