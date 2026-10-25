"use client";

import React, { useState } from "react";
import { Skill, isDuplicateSkill } from "@/lib/schema/portfolio";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { FormLabel, FormHelperText, FormErrorMessage } from "@/components/ui/form-field";
import { Plus, Trash2, ArrowUp, ArrowDown, Layers } from "lucide-react";

interface SkillsFormProps {
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
}

const COMMON_CATEGORIES = [
  "General",
  "Languages",
  "Frontend",
  "Backend",
  "Distributed Systems",
  "Cloud & DevOps",
  "Databases",
  "Architecture & Design",
  "Tools & Workflows",
];

export function SkillsForm({ skills, onSkillsChange }: SkillsFormProps) {
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("General");
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSkillName.trim();
    if (!trimmed) return;

    if (isDuplicateSkill(skills, trimmed)) {
      setDuplicateError(`"${trimmed}" has already been added to your skills.`);
      return;
    }

    setDuplicateError(null);
    const newSkill: Skill = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      category: newSkillCategory,
      order: skills.length,
    };

    onSkillsChange([...skills, newSkill]);
    setNewSkillName("");
  };

  const handleUpdateSkill = (id: string, updates: Partial<Skill>) => {
    if (updates.name && isDuplicateSkill(skills, updates.name, id)) {
      setDuplicateError(`A skill named "${updates.name}" already exists.`);
      return;
    }
    setDuplicateError(null);
    onSkillsChange(
      skills.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleDeleteSkill = (id: string) => {
    onSkillsChange(
      skills
        .filter((s) => s.id !== id)
        .map((s, index) => ({ ...s, order: index }))
    );
    setDuplicateError(null);
  };

  const handleMoveSkill = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const copy = [...skills];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    onSkillsChange(copy.map((s, i) => ({ ...s, order: i })));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">Skills & Competencies</h3>
        <p className="text-xs text-zinc-400">
          List verified technical proficiencies, tools, and specialized domains.
        </p>
      </div>

      {/* Add New Skill Input Row */}
      <form onSubmit={handleAddSkill} className="space-y-2">
        <FormLabel htmlFor="new-skill-input">Add New Competency</FormLabel>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              id="new-skill-input"
              value={newSkillName}
              onChange={(e) => {
                setNewSkillName(e.target.value);
                if (duplicateError) setDuplicateError(null);
              }}
              placeholder="e.g. Distributed Consensus (Raft / Paxos)"
              className="h-9 text-xs"
            />
          </div>
          <div className="w-full sm:w-44 shrink-0">
            <Select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              options={COMMON_CATEGORIES.map((c) => ({ value: c, label: c }))}
              className="h-9 text-xs bg-zinc-950"
            />
          </div>
          <Button
            type="submit"
            variant="brand"
            size="sm"
            className="h-9 text-xs gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </Button>
        </div>
        {duplicateError && <FormErrorMessage message={duplicateError} />}
        <FormHelperText>
          Duplicate names are automatically prevented.
        </FormHelperText>
      </form>

      {/* Skills List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-zinc-300">
            Current Skills ({skills.length})
          </h4>
        </div>

        {skills.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-zinc-850 bg-zinc-900/30 text-center space-y-2">
            <Layers className="w-7 h-7 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400 font-medium">No skills entered yet</p>
            <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
              Add your primary programming languages, frameworks, or domain specializations above.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {skills.map((skill, index) => (
              <div
                key={skill.id}
                className="p-2.5 rounded-lg border border-zinc-850 bg-zinc-900/60 flex items-center justify-between gap-2 hover:border-zinc-800 transition-colors"
              >
                <div className="flex-1 flex items-center gap-2 overflow-hidden">
                  <span className="text-[11px] font-mono text-zinc-500 w-5 shrink-0">
                    {index + 1}.
                  </span>
                  <Input
                    value={skill.name}
                    onChange={(e) => handleUpdateSkill(skill.id, { name: e.target.value })}
                    className="h-7 text-xs bg-transparent border-transparent hover:border-zinc-800 focus:border-zinc-700 focus:bg-zinc-950 px-2 flex-1"
                  />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded shrink-0 hidden sm:inline-block">
                    {skill.category}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveSkill(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move up"
                    aria-label={`Move ${skill.name} up`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveSkill(index, "down")}
                    disabled={index === skills.length - 1}
                    className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move down"
                    aria-label={`Move ${skill.name} down`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Remove skill"
                    aria-label={`Remove ${skill.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
