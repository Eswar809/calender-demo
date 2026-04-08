"use client";

import React from "react";
import type { DynamicTheme, CalendarDay } from "@/lib/types";
import { HOLIDAYS } from "@/lib/constants";

interface MonthlyNotesProps {
  notes: string;
  onNotesChange: (text: string) => void;
  dynamicTheme: DynamicTheme;
  daysInCurrentMonth: number;
  todayDate: number;
  calendarDays: CalendarDay[];
  monthIndex: number;
}

/**
 * MonthlyNotes — Premium front face of SmartPanel.
 *
 * Upgrades:
 *   - Gradient progress bar with shimmer
 *   - Stat cards with colored left border accent
 *   - Focus glow on textarea with scaling icon
 *   - Gradient accent decorations
 */
export default function MonthlyNotes({
  notes,
  onNotesChange,
  dynamicTheme,
  daysInCurrentMonth,
  todayDate,
  calendarDays,
  monthIndex,
}: MonthlyNotesProps) {
  const p = dynamicTheme.palette;
  const holidayCount = calendarDays.filter(
    (d) => d.type === "curr" && HOLIDAYS[`${monthIndex}-${d.val}`]
  ).length;
  const daysLeft = Math.max(0, daysInCurrentMonth - todayDate);
  const progressPct = Math.round((todayDate / daysInCurrentMonth) * 100);

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-2.5 sm:mb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight" style={{ color: p.onSurface }}>
            Monthly Focus
          </h2>
          <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold mt-0.5" style={{ color: p.onSurfaceVariant }}>
            {daysLeft} days remaining
          </p>
        </div>
        {/* Live indicator */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[0.5rem] sm:text-[0.6rem] font-black tracking-widest uppercase border"
          style={{
            backgroundColor: p.primaryContainer,
            color: p.onPrimaryContainer,
            borderColor: `${p.primary}15`,
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ backgroundColor: p.primary }} />
            <span className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: p.primary }} />
          </span>
          Live
        </div>
      </div>

      {/* ── Gradient progress bar ── */}
      <div className="mb-3 sm:mb-4 relative">
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${p.primary}10` }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden shine-sweep"
            style={{
              width: `${progressPct}%`,
              background: `linear-gradient(90deg, ${p.primary}, ${p.secondary || p.primary})`,
              boxShadow: `0 2px 8px -1px ${p.primary}40`,
            }}
          />
        </div>
        {/* Progress label */}
        <div className="flex justify-between mt-1">
          <span className="text-[0.5rem] font-bold uppercase tracking-wider" style={{ color: p.onSurfaceVariant }}>{progressPct}% complete</span>
          <span className="text-[0.5rem] font-bold uppercase tracking-wider" style={{ color: p.onSurfaceVariant }}>{daysLeft}d left</span>
        </div>
      </div>

      {/* ── Textarea ── */}
      <div
        className="relative flex-grow rounded-2xl p-3 sm:p-4 border transition-all duration-500 group focus-within:shadow-lg"
        style={{
          backgroundColor: p.surfaceVariant,
          borderColor: p.outlineVariant,
        }}
      >
        <svg
          className="absolute top-3 right-3 opacity-20 group-hover:opacity-40 group-focus-within:opacity-60 transition-all duration-300 group-focus-within:scale-110 group-focus-within:rotate-[-5deg]"
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={p.primary} strokeWidth="2.5" strokeLinecap="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Goals, events, or thoughts for this month..."
          className="w-full h-full resize-none outline-none bg-transparent border-none text-[0.8rem] sm:text-sm placeholder:opacity-30 focus:ring-0 no-scrollbar"
          style={{ color: p.onSurface, lineHeight: "1.75", fontFamily: "inherit" }}
          aria-label="Monthly notes"
        />
      </div>

      {/* ── Stat cards with left accent border ── */}
      <div className="mt-2.5 sm:mt-3 flex gap-2 sm:gap-2.5">
        {/* Days Left */}
        <div
          className="flex-1 rounded-xl p-2.5 sm:p-3 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default overflow-hidden relative"
          style={{
            backgroundColor: p.surfaceVariant,
            borderLeft: `3px solid ${p.primary}`,
          }}
        >
          <span className="text-[0.5rem] sm:text-[0.55rem] font-black tracking-wider uppercase" style={{ color: p.onSurfaceVariant }}>
            Days Left
          </span>
          <span className="text-lg sm:text-xl font-black tabular-nums" style={{ color: p.primary }}>{daysLeft}</span>
        </div>
        {/* Holidays */}
        <div
          className="flex-1 rounded-xl p-2.5 sm:p-3 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default overflow-hidden relative"
          style={{
            backgroundColor: p.surfaceVariant,
            borderLeft: `3px solid #e67e22`,
          }}
        >
          <span className="text-[0.5rem] sm:text-[0.55rem] font-black tracking-wider uppercase" style={{ color: p.onSurfaceVariant }}>
            Holidays
          </span>
          <span className="text-lg sm:text-xl font-black tabular-nums" style={{ color: "#e67e22" }}>{holidayCount}</span>
        </div>
        {/* Done */}
        <div
          className="flex-1 rounded-xl p-2.5 sm:p-3 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default overflow-hidden relative"
          style={{
            backgroundColor: p.surfaceVariant,
            borderLeft: `3px solid ${p.secondary}`,
          }}
        >
          <span className="text-[0.5rem] sm:text-[0.55rem] font-black tracking-wider uppercase" style={{ color: p.onSurfaceVariant }}>
            Done
          </span>
          <span className="text-lg sm:text-xl font-black tabular-nums" style={{ color: p.secondary }}>{progressPct}%</span>
        </div>
      </div>
    </div>
  );
}
