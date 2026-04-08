"use client";

import React from "react";
import type { DynamicTheme, SelectionStats, CalendarDay, RangeTag } from "@/lib/types";
import MonthlyNotes from "./MonthlyNotes";
import SelectionIntel from "./SelectionIntel";

interface SmartPanelProps {
  isRangeSelected: boolean;
  dynamicTheme: DynamicTheme;
  notes: string;
  onNotesChange: (text: string) => void;
  daysInCurrentMonth: number;
  todayDate: number;
  calendarDays: CalendarDay[];
  monthIndex: number;
  selectionStats: SelectionStats | null;
  rangeNote: string;
  onRangeNoteChange: (text: string) => void;
  /** Currently active tags for the selected range */
  rangeTags: RangeTag[];
  /** Toggle a tag on/off for the selected range */
  onToggleTag: (tag: RangeTag) => void;
}

/**
 * SmartPanel — Premium flip-card container.
 *
 * Upgrades:
 *   - Gradient border effect on the front face
 *   - Deeper shadow with color matching
 *   - Inner light highlight
 *   - Tag system integration on back face
 */
export default function SmartPanel({
  isRangeSelected,
  dynamicTheme,
  notes,
  onNotesChange,
  daysInCurrentMonth,
  todayDate,
  calendarDays,
  monthIndex,
  selectionStats,
  rangeNote,
  onRangeNoteChange,
  rangeTags,
  onToggleTag,
}: SmartPanelProps) {
  const p = dynamicTheme.palette;

  return (
    <div className="w-full md:w-[44%] md:flex-shrink-0 perspective-1000">
      <div
        className={`
          w-full relative preserve-3d transition-transform duration-700
          ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isRangeSelected ? "rotate-y-180" : ""}
        `}
        style={{ minHeight: "clamp(420px, 55vh, 480px)" }}
      >
        {/* FRONT FACE: Monthly Notes — with gradient border */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl flex flex-col overflow-hidden"
          style={{
            boxShadow: `
              0 4px 24px -6px ${p.primary}18,
              0 0 0 1px ${p.outlineVariant}60,
              inset 0 1px 0 rgba(255,255,255,0.7)
            `,
          }}
        >
          {/* Gradient top border accent */}
          <div
            className="w-full h-[2px] shrink-0"
            style={{
              background: `linear-gradient(90deg, ${p.primary}, ${p.secondary || p.primary}, ${p.primary})`,
            }}
          />
          <div
            className="flex-1 p-4 sm:p-5 flex flex-col"
            style={{ backgroundColor: p.surface }}
          >
            <MonthlyNotes
              notes={notes}
              onNotesChange={onNotesChange}
              dynamicTheme={dynamicTheme}
              daysInCurrentMonth={daysInCurrentMonth}
              todayDate={todayDate}
              calendarDays={calendarDays}
              monthIndex={monthIndex}
            />
          </div>
        </div>

        {/* BACK FACE: Selection Intel + Tags */}
        <SelectionIntel
          selectionStats={selectionStats}
          dynamicTheme={dynamicTheme}
          rangeNote={rangeNote}
          onRangeNoteChange={onRangeNoteChange}
          rangeTags={rangeTags}
          onToggleTag={onToggleTag}
        />
      </div>
    </div>
  );
}
