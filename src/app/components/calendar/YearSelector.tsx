/**
 * @fileoverview YearSelector — Year Fast-Travel Glass Overlay
 *
 * A glassmorphic fullscreen overlay that appears over the hero image,
 * displaying a 4×3 grid of years centered around the current year.
 * The active year is highlighted with a white pill for instant recognition.
 *
 * Visual Design:
 *   - Backdrop blur (16px) + dark overlay creates a frosted-glass effect
 *   - Pop-in animation on mount for premium feel
 *   - Each year button has a subtle hover glow
 *   - Active year gets a white background with shadow lift
 *
 * Accessibility:
 *   - All buttons are focusable
 *   - Close button at the bottom for keyboard navigation
 */

import React from "react";

// ─────────────────────────────────────────────────────────
// COMPONENT PROPS
// ─────────────────────────────────────────────────────────

interface YearSelectorProps {
  /** The currently displayed year (highlighted in the grid) */
  currentYear: number;
  /** The current month index — preserved when switching years */
  monthIndex: number;
  /** The real "today" year — used to center the year range */
  todayYear: number;
  /** Callback to set a new year */
  onSelectYear: (year: number) => void;
  /** Callback to close the overlay */
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────

/**
 * Year fast-travel overlay with glassmorphic styling.
 *
 * Renders a 4×3 grid of 12 years (±5 from the current real year),
 * allowing users to quickly jump between years without scrolling
 * month-by-month.
 */
export default function YearSelector({
  currentYear,
  monthIndex,
  todayYear,
  onSelectYear,
  onClose,
}: YearSelectorProps) {
  // Generate a range of 12 years centered roughly around today's year
  const yearRange = Array.from({ length: 12 }, (_, i) => todayYear - 5 + i);

  return (
    <div
      className="absolute inset-0 z-50 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-6 pop-in-wave"
      role="dialog"
      aria-label="Year selector"
    >
      {/* Section Title */}
      <h3 className="text-white text-lg font-bold tracking-widest uppercase mb-6 drop-shadow-md">
        Jump to Year
      </h3>

      {/* Year Grid — 4 columns × 3 rows */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-sm">
        {yearRange.map((y) => {
          const isActive = y === currentYear;

          return (
            <button
              key={y}
              onClick={() => onSelectYear(y)}
              className={`
                py-2 rounded-xl text-sm font-bold transition-all duration-300
                ${
                  isActive
                    ? "bg-white text-slate-900 shadow-lg scale-105"
                    : "bg-white/10 text-white hover:bg-white/20"
                }
              `}
              aria-current={isActive ? "true" : undefined}
            >
              {y}
            </button>
          );
        })}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="mt-8 px-6 py-2 rounded-full border border-white/30 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
      >
        Close
      </button>
    </div>
  );
}
