"use client";

import React, { useState } from "react";
import { Education } from "@/lib/schema/portfolio";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form-field";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  GraduationCap,
} from "lucide-react";

interface EducationFormProps {
  education: Education[];
  onEducationChange: (education: Education[]) => void;
}

export function EducationForm({
  education,
  onEducationChange,
}: EducationFormProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    education.length > 0 ? education[0].id : null
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAddEducation = () => {
    const newId = `edu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEntry: Education = {
      id: newId,
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
      order: education.length,
    };
    onEducationChange([...education, newEntry]);
    setExpandedId(newId);
  };

  const handleUpdateEducation = (id: string, updates: Partial<Education>) => {
    onEducationChange(
      education.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu))
    );
  };

  const handleDeleteEducation = (id: string) => {
    onEducationChange(
      education
        .filter((edu) => edu.id !== id)
        .map((edu, index) => ({ ...edu, order: index }))
    );
    if (expandedId === id) setExpandedId(null);
    setDeleteConfirmId(null);
  };

  const handleMoveEducation = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= education.length) return;

    const copy = [...education];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    onEducationChange(copy.map((edu, i) => ({ ...edu, order: i })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Education & Studies</h3>
          <p className="text-xs text-zinc-400">
            Academic degrees, certifications, or specialized bootcamps.
          </p>
        </div>
        <Button
          type="button"
          variant="brand"
          size="sm"
          onClick={handleAddEducation}
          className="h-8 text-xs gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-zinc-850 bg-zinc-900/30 text-center space-y-3">
          <GraduationCap className="w-8 h-8 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-zinc-300">No education entries</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Add university degrees, accredited programs, or foundational coursework.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddEducation}
            className="text-xs border-zinc-700 text-zinc-300"
          >
            Add education entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((entry, index) => {
            const isExpanded = expandedId === entry.id;

            return (
              <div
                key={entry.id}
                className="rounded-xl border border-zinc-850 bg-zinc-900/50 overflow-hidden transition-all"
              >
                {/* Header */}
                <div className="p-3.5 flex items-center justify-between bg-zinc-900/80 border-b border-zinc-850/80">
                  <div className="flex items-center gap-2 overflow-hidden">
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
                          {entry.institution.trim() || `Institution #${index + 1}`}
                        </span>
                        {entry.degree && (
                          <span className="text-xs text-zinc-400 ml-1.5 font-normal">
                            — {entry.degree}
                          </span>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveEducation(index, "up")}
                      disabled={index === 0}
                      className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move up"
                      aria-label="Move education entry up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveEducation(index, "down")}
                      disabled={index === education.length - 1}
                      className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move down"
                      aria-label="Move education entry down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(entry.id)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete education"
                      aria-label="Delete education"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Deletion Confirmation */}
                {deleteConfirmId === entry.id && (
                  <div className="p-3 bg-red-950/40 border-b border-red-800/60 flex items-center justify-between text-xs text-red-200">
                    <span>Delete this education record?</span>
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
                        onClick={() => handleDeleteEducation(entry.id)}
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
                    <div>
                      <FormLabel htmlFor={`edu-inst-${entry.id}`} required>
                        Institution / University
                      </FormLabel>
                      <Input
                        id={`edu-inst-${entry.id}`}
                        value={entry.institution}
                        onChange={(e) =>
                          handleUpdateEducation(entry.id, { institution: e.target.value })
                        }
                        placeholder="e.g. Stanford University"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <FormLabel htmlFor={`edu-deg-${entry.id}`}>
                          Degree / Qualification
                        </FormLabel>
                        <Input
                          id={`edu-deg-${entry.id}`}
                          value={entry.degree}
                          onChange={(e) =>
                            handleUpdateEducation(entry.id, { degree: e.target.value })
                          }
                          placeholder="e.g. B.S. in Computer Science"
                        />
                      </div>
                      <div>
                        <FormLabel htmlFor={`edu-field-${entry.id}`}>
                          Field of Study
                        </FormLabel>
                        <Input
                          id={`edu-field-${entry.id}`}
                          value={entry.fieldOfStudy}
                          onChange={(e) =>
                            handleUpdateEducation(entry.id, { fieldOfStudy: e.target.value })
                          }
                          placeholder="e.g. Distributed Computing"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <FormLabel htmlFor={`edu-start-${entry.id}`}>Start Date</FormLabel>
                        <Input
                          id={`edu-start-${entry.id}`}
                          value={entry.startDate}
                          onChange={(e) =>
                            handleUpdateEducation(entry.id, { startDate: e.target.value })
                          }
                          placeholder="e.g. 2016"
                        />
                      </div>
                      <div>
                        <FormLabel htmlFor={`edu-end-${entry.id}`}>End Date</FormLabel>
                        <Input
                          id={`edu-end-${entry.id}`}
                          value={entry.endDate}
                          onChange={(e) =>
                            handleUpdateEducation(entry.id, { endDate: e.target.value })
                          }
                          placeholder="e.g. 2020"
                        />
                      </div>
                    </div>

                    <div>
                      <FormLabel htmlFor={`edu-desc-${entry.id}`}>
                        Description & Honors
                      </FormLabel>
                      <Textarea
                        id={`edu-desc-${entry.id}`}
                        value={entry.description}
                        onChange={(e) =>
                          handleUpdateEducation(entry.id, { description: e.target.value })
                        }
                        placeholder="Notable coursework, honors, or thesis project."
                        rows={2}
                      />
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
