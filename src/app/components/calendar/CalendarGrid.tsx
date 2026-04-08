"use client";

import React from "react";
import type { CalendarDay, DynamicTheme, AnimationDirection } from "@/lib/types";
import { DAYS_OF_WEEK } from "@/lib/constants";
import DateCell from "./DateCell";

interface CalendarGridProps {
  calendarDays: CalendarDay[];
  monthIndex: number;
  dynamicTheme: DynamicTheme;
  animating: AnimationDirection;
  startDate: number | null;
  endDate: number | null;
  hoverDate: number | null;
  onDateClick: (dateKey: number) => void;
  onDateHover: (dateKey: number) => void;
  onDateLeave: () => void;
  onClearSelection: () => void;
  /** Set of dateKey timestamps that belong to ranges with saved notes */
  notedDateKeys: Set<number>;
  /** Map of dateKey timestamps to array of active tags */
  dateTagsMap: Map<number, import("@/lib/types").RangeTag[]>;
}

/**
 * CalendarGrid — Premium 7-column date grid with selection header.
 *
 * Visual enhancements:
 *   - Gradient accent line below "Select Dates" header
 *   - Weekend day-labels colored with primary
 *   - Animated reset chip with hover glow
 *   - Staggered wave animation on month transitions
 */
export default function CalendarGrid({
  calendarDays,
  monthIndex,
  dynamicTheme,
  animating,
  startDate,
  endDate,
  hoverDate,
  onDateClick,
  onDateHover,
  onDateLeave,
  onClearSelection,
  notedDateKeys,
  dateTagsMap,
}: CalendarGridProps) {
  const hasSelection = !!(startDate || endDate);
  const p = dynamicTheme.palette;

  return (
    <div className="w-full md:w-[56%] select-none">
      {/* Section header with gradient accent */}
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-black tracking-tight" style={{ color: p.onSurface }}>
            Select Dates
          </h2>
          <p className="text-[0.65rem] sm:text-[0.7rem] font-medium mt-0.5" style={{ color: p.onSurfaceVariant }}>
            Tap to set a range
          </p>
          {/* Gradient accent line */}
          <div
            className="h-[2px] w-10 mt-1.5 rounded-full transition-all duration-1000"
            style={{
              background: `linear-gradient(90deg, ${p.primary}, ${p.secondary})`,
              boxShadow: `0 0 8px ${p.primary}40`,
            }}
          />
        </div>

        {/* Reset chip with hover glow */}
        <div className={`transition-all duration-300 ${hasSelection ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}>
          <button
            onClick={onClearSelection}
            className="h-7 sm:h-8 px-3 sm:px-4 text-[0.55rem] sm:text-[0.6rem] font-black uppercase tracking-[0.15em] rounded-full border transition-all duration-300 hover:shadow-lg active:scale-95"
            style={{
              color: p.primary,
              borderColor: p.outlineVariant,
              backgroundColor: p.primaryContainer,
              boxShadow: hasSelection ? `0 2px 12px -2px ${p.primary}20` : 'none',
            }}
            aria-label="Reset date selection"
          >
            ✕ Reset
          </button>
        </div>
      </div>

      {/* Grid container */}
      <div className={animating ? "overflow-hidden" : ""}>
        <div
          className={`
            grid grid-cols-7 gap-y-0.5 text-center relative z-10
            ${animating === "next" ? "anim-slide-next" : ""}
            ${animating === "prev" ? "anim-slide-prev" : ""}
          `}
          role="grid"
          aria-label="Calendar dates"
        >
          {/* Day-of-week labels — premium styling */}
          {DAYS_OF_WEEK.map((day) => {
            const isWkd = day === "SAT" || day === "SUN";
            return (
              <div
                key={day}
                className="text-[0.55rem] sm:text-[0.6rem] font-black tracking-[0.15em] sm:tracking-[0.18em] py-1.5 sm:py-2 transition-colors duration-1000 uppercase relative"
                style={{ color: isWkd ? p.primary : p.onSurfaceVariant }}
                role="columnheader"
              >
                {day}
                {/* Subtle dot under weekend labels */}
                {isWkd && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-40"
                    style={{ backgroundColor: p.primary }}
                  />
                )}
              </div>
            );
          })}

          {/* Date cells */}
          {calendarDays.map((dayObj, idx) => {
            const { dateKey } = dayObj;
            const isStart = startDate === dateKey;
            const isEnd = endDate === dateKey;
            const isHoverEnd = hoverDate === dateKey && startDate !== null && !endDate && dateKey > startDate;
            const lo = startDate !== null && endDate !== null
              ? Math.min(startDate, endDate)
              : null;
            const hi = startDate !== null && endDate !== null
              ? Math.max(startDate, endDate)
              : null;

            const isBetween =
              (lo !== null && hi !== null && dateKey > lo && dateKey < hi) ||
              (startDate !== null && hoverDate !== null && !endDate &&
               dateKey > startDate && dateKey < hoverDate);

            return (
              <DateCell
                key={idx}
                day={dayObj}
                index={idx}
                monthIndex={monthIndex}
                dynamicTheme={dynamicTheme}
                animating={animating}
                isStart={isStart}
                isEnd={isEnd}
                isHoverEnd={isHoverEnd}
                isBetween={isBetween}
                hasNote={notedDateKeys.has(dateKey)}
                dateTags={dateTagsMap.get(dateKey) || []}
                onClick={onDateClick}
                onMouseEnter={onDateHover}
                onMouseLeave={onDateLeave}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
