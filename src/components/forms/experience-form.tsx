"use client";

import React, { useState } from "react";
import { Experience, validateDateRange } from "@/lib/schema/portfolio";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FormLabel, FormErrorMessage } from "@/components/ui/form-field";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Briefcase,
  X,
} from "lucide-react";

interface ExperienceFormProps {
  experience: Experience[];
  onExperienceChange: (experience: Experience[]) => void;
}

export function ExperienceForm({
  experience,
  onExperienceChange,
}: ExperienceFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    experience.length > 0 ? experience[0].id : null
  );
  const [highlightInputs, setHighlightInputs] = useState<Record<string, string>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAddExperience = () => {
    const newId = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEntry: Experience = {
      id: newId,
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      highlights: [],
      order: experience.length,
    };
    onExperienceChange([...experience, newEntry]);
    setExpandedId(newId);
  };

  const handleUpdateExperience = (id: string, updates: Partial<Experience>) => {
    onExperienceChange(
      experience.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const handleDeleteExperience = (id: string) => {
    onExperienceChange(
      experience
        .filter((e) => e.id !== id)
        .map((e, index) => ({ ...e, order: index }))
    );
    if (expandedId === id) setExpandedId(null);
    setDeleteConfirmId(null);
  };

  const handleMoveExperience = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experience.length) return;

    const copy = [...experience];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    onExperienceChange(copy.map((e, i) => ({ ...e, order: i })));
  };

  // Highlight bullet points manager
  const handleAddHighlight = (expId: string) => {
    const val = (highlightInputs[expId] || "").trim();
    if (!val) return;

    const entry = experience.find((e) => e.id === expId);
    if (!entry) return;

    handleUpdateExperience(expId, {
      highlights: [...entry.highlights, val],
    });

    setHighlightInputs((prev) => ({ ...prev, [expId]: "" }));
  };

  const handleRemoveHighlight = (expId: string, indexToRemove: number) => {
    const entry = experience.find((e) => e.id === expId);
    if (!entry) return;

    handleUpdateExperience(expId, {
      highlights: entry.highlights.filter((_, idx) => idx !== indexToRemove),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Work Experience</h3>
          <p className="text-xs text-zinc-400">
            Professional roles, leadership tenures, and career accomplishments.
          </p>
        </div>
        <Button
          type="button"
          variant="brand"
          size="sm"
          onClick={handleAddExperience}
          className="h-8 text-xs gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Role</span>
        </Button>
      </div>

      {experience.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 text-center space-y-3">
          <Briefcase className="w-8 h-8 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-zinc-300">No experience added</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Add your engineering, design, or professional positions to establish your career timeline.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddExperience}
            className="text-xs border-zinc-700 text-zinc-300"
          >
            Add first position
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((entry, index) => {
            const isExpanded = expandedId === entry.id;
            const dateValidation = validateDateRange(
              entry.startDate,
              entry.endDate,
              entry.current
            );

            return (
              <div
                key={entry.id}
                className="rounded-xl border border-zinc-850 bg-zinc-900/50 overflow-hidden transition-all"
              >
                {/* Header Bar */}
                <div className="p-3.5 flex items-center justify-between bg-zinc-900/80 border-b border-zinc-850/80">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      className="flex items-center gap-2 text-left hover:text-white transition-colors cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="text-xs font-semibold text-zinc-200">
                          {entry.role.trim() || `Position #${index + 1}`}
                        </span>
                        {entry.company && (
                          <span className="text-xs text-zinc-400 ml-1.5 font-normal">
                            at {entry.company}
                          </span>
                        )}
                      </div>
                    </button>
                    {entry.current && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-1.5 py-0.2 rounded shrink-0">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveExperience(index, "up")}
                      disabled={index === 0}
                      className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move up"
                      aria-label="Move position up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveExperience(index, "down")}
                      disabled={index === experience.length - 1}
                      className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move down"
                      aria-label="Move position down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(entry.id)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete experience"
                      aria-label="Delete experience"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Deletion Confirmation */}
                {deleteConfirmId === entry.id && (
                  <div className="p-3 bg-red-950/40 border-b border-red-800/60 flex items-center justify-between text-xs text-red-200">
                    <span>Delete this experience record?</span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(null)}
                        className="h-6 text-xs text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteExperience(entry.id)}
                        className="h-6 text-xs"
                      >
                        Confirm Delete
                      </Button>
                    </div>
                  </div>
                )}

                {/* Fields */}
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <FormLabel htmlFor={`exp-role-${entry.id}`} required>
                          Role / Title
                        </FormLabel>
                        <Input
                          id={`exp-role-${entry.id}`}
                          value={entry.role}
                          onChange={(e) =>
                            handleUpdateExperience(entry.id, { role: e.target.value })
                          }
                          placeholder="e.g. Lead Infrastructure Engineer"
                        />
                      </div>
                      <div>
                        <FormLabel htmlFor={`exp-company-${entry.id}`} required>
                          Company / Organization
                        </FormLabel>
                        <Input
                          id={`exp-company-${entry.id}`}
                          value={entry.company}
                          onChange={(e) =>
                            handleUpdateExperience(entry.id, { company: e.target.value })
                          }
                          placeholder="e.g. Cloudflare"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <FormLabel htmlFor={`exp-location-${entry.id}`}>Location</FormLabel>
                        <Input
                          id={`exp-location-${entry.id}`}
                          value={entry.location}
                          onChange={(e) =>
                            handleUpdateExperience(entry.id, { location: e.target.value })
                          }
                          placeholder="e.g. Remote / San Francisco"
                        />
                      </div>
                      <div>
                        <FormLabel htmlFor={`exp-start-${entry.id}`}>Start Date</FormLabel>
                        <Input
                          id={`exp-start-${entry.id}`}
                          value={entry.startDate}
                          onChange={(e) =>
                            handleUpdateExperience(entry.id, { startDate: e.target.value })
                          }
                          placeholder="e.g. Jan 2022 or 2022-01"
                        />
                      </div>
                      <div>
                        <FormLabel htmlFor={`exp-end-${entry.id}`}>End Date</FormLabel>
                        <Input
                          id={`exp-end-${entry.id}`}
                          value={entry.current ? "Present" : entry.endDate}
                          disabled={entry.current}
                          onChange={(e) =>
                            handleUpdateExperience(entry.id, { endDate: e.target.value })
                          }
                          placeholder="e.g. Present or Dec 2024"
                          hasError={!dateValidation.isValid}
                        />
                      </div>
                    </div>

                    {!dateValidation.isValid && (
                      <FormErrorMessage message={dateValidation.error} />
                    )}

                    {/* Current Position Toggle */}
                    <div className="flex items-center gap-2 pt-1">
                      <Switch
                        id={`exp-curr-${entry.id}`}
                        checked={entry.current}
                        onCheckedChange={(checked) =>
                          handleUpdateExperience(entry.id, {
                            current: checked,
                            endDate: checked ? "" : entry.endDate,
                          })
                        }
                      />
                      <label
                        htmlFor={`exp-curr-${entry.id}`}
                        className="text-xs text-zinc-300 font-medium cursor-pointer"
                      >
                        I currently work in this role
                      </label>
                    </div>

                    {/* Description */}
                    <div>
                      <FormLabel htmlFor={`exp-desc-${entry.id}`}>Overview</FormLabel>
                      <Textarea
                        id={`exp-desc-${entry.id}`}
                        value={entry.description}
                        onChange={(e) =>
                          handleUpdateExperience(entry.id, { description: e.target.value })
                        }
                        placeholder="Core scope of responsibilities, team scale, and primary mission."
                        rows={3}
                      />
                    </div>

                    {/* Key Highlights / Bullets */}
                    <div className="space-y-2">
                      <FormLabel htmlFor={`exp-hl-input-${entry.id}`}>
                        Key Achievements & Highlights
                      </FormLabel>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`exp-hl-input-${entry.id}`}
                          value={highlightInputs[entry.id] || ""}
                          onChange={(e) =>
                            setHighlightInputs((prev) => ({
                              ...prev,
                              [entry.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddHighlight(entry.id);
                            }
                          }}
                          placeholder="e.g. Reduced distributed latency by 45% via custom gRPC serialization"
                          className="h-8 text-xs"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddHighlight(entry.id)}
                          className="h-8 text-xs border-zinc-700"
                        >
                          Add
                        </Button>
                      </div>

                      {entry.highlights.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {entry.highlights.map((hl, hlIdx) => (
                            <div
                              key={hlIdx}
                              className="flex items-start justify-between gap-2 text-xs text-zinc-300 bg-zinc-950 p-2 rounded border border-zinc-850"
                            >
                              <span className="leading-relaxed flex-1">
                                • {hl}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveHighlight(entry.id, hlIdx)}
                                className="text-zinc-500 hover:text-red-400 cursor-pointer pt-0.5"
                                aria-label="Remove achievement bullet"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
