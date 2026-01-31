"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { Sparkles, Check, Info } from "lucide-react";

interface Pillar {
  id: number | string;
  name: string;
  description?: string;
  icon?: string;
  category: string;
  completionRate?: number;
}

interface FocusPillarSelectorProps {
  pillars: Pillar[];
  selectedPillars: string[];
  maxSelection?: number;
  onSave: (pillarIds: string[]) => Promise<void>;
  isEditing?: boolean;
  className?: string;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Mental Health": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Physical Health": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  "Financial Health": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Relationship Health": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  default: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
};

export function FocusPillarSelector({
  pillars,
  selectedPillars: initialSelected,
  maxSelection = 3,
  onSave,
  isEditing: initialEditing = false,
  className = "",
}: FocusPillarSelectorProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (pillarId: number | string) => {
    if (!isEditing) return;
    const pillarIdStr = pillarId.toString();

    setSelected((prev) => {
      if (prev.includes(pillarIdStr)) {
        return prev.filter((id) => id !== pillarIdStr);
      }
      if (prev.length >= maxSelection) {
        return prev;
      }
      return [...prev, pillarIdStr];
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(selected);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSelected(initialSelected);
    setIsEditing(false);
  };

  // Group pillars by category
  const groupedPillars = pillars.reduce((acc, pillar) => {
    const cat = pillar.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(pillar);
    return acc;
  }, {} as Record<string, Pillar[]>);

  const selectedPillarDetails = pillars.filter((p) => selected.includes(p.id.toString()));

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base">Focus Pillars</CardTitle>
              <p className="text-xs text-gray-500">
                Choose up to {maxSelection} pillars to prioritize
              </p>
            </div>
          </div>

          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <>
            {/* Selection mode */}
            <div className="space-y-4">
              {Object.entries(groupedPillars).map(([category, catPillars]) => {
                const colors = categoryColors[category] || categoryColors.default;

                return (
                  <div key={category}>
                    <h4 className="text-xs font-medium text-gray-500 mb-2">{category}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {catPillars.map((pillar) => {
                        const isSelected = selected.includes(pillar.id.toString());
                        const canSelect = selected.length < maxSelection || isSelected;

                        return (
                          <button
                            key={pillar.id}
                            onClick={() => handleToggle(pillar.id)}
                            disabled={!canSelect && !isSelected}
                            className={cn(
                              "relative p-3 rounded-lg border-2 text-left transition-all",
                              isSelected
                                ? "border-amber-500 bg-amber-50"
                                : canSelect
                                ? `${colors.border} ${colors.bg} hover:border-amber-300`
                                : "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                            )}
                          >
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                            <span className="text-2xl mb-1 block">{pillar.icon || "🎯"}</span>
                            <p className="text-xs font-medium text-gray-900 line-clamp-2">
                              {pillar.name}
                            </p>
                            {pillar.completionRate !== undefined && (
                              <p className="text-xs text-gray-400 mt-1">
                                {pillar.completionRate}% done
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Selection counter */}
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-gray-500">
                  Selected: {selected.length}/{maxSelection}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={selected.length === 0 || isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Display mode */}
            {selectedPillarDetails.length > 0 ? (
              <div className="space-y-2">
                {selectedPillarDetails.map((pillar, index) => {
                  const colors = categoryColors[pillar.category] || categoryColors.default;

                  return (
                    <div
                      key={pillar.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg",
                        colors.bg,
                        colors.border,
                        "border"
                      )}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white">
                        <span className="text-lg">{pillar.icon || "🎯"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-medium", colors.text)}>
                          #{index + 1} {pillar.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{pillar.category}</p>
                      </div>
                      {pillar.completionRate !== undefined && (
                        <div className="text-right">
                          <p className={cn("text-sm font-bold", colors.text)}>
                            {pillar.completionRate}%
                          </p>
                          <p className="text-xs text-gray-400">complete</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Info className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  No focus pillars selected yet
                </p>
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  Choose Focus Pillars
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
