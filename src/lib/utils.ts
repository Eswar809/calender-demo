/**
 * @fileoverview Nelala Calendar — Pure Utility Functions
 *
 * All functions in this module are pure (no side effects, no state).
 * They can be safely called from any context — hooks, components,
 * or even server-side code.
 *
 * Categories:
 *   1. Color utilities  — hex conversion, light tint mixing
 *   2. Calendar math    — grid computation, progress calculation
 *   3. Selection UI     — border radius logic for range pills
 */

import type { CalendarDay } from "./types";

// ─────────────────────────────────────────────────────────
// COLOR UTILITIES
// ─────────────────────────────────────────────────────────

/**
 * Convert an RGB channel value (0–255) to a 2-character hex string.
 *
 * @param c — RGB channel value (clamped to 0–255 in practice)
 * @returns Two-character hex string, zero-padded if necessary
 *
 * @example
 *   toHex(15)  // → "0f"
 *   toHex(255) // → "ff"
 */
export function toHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

/**
 * Blend an RGB channel value heavily toward white to create a light tint.
 *
 * Formula: `(channel + 255 × 8) / 9`
 *
 * This produces a very light pastel — approximately 11% of the original
 * color mixed with 89% white. Used for date range backgrounds and
 * panel fills where we need the theme color to be barely perceptible.
 *
 * @param c — RGB channel value (0–255)
 * @returns Blended channel value (0–255), floored to integer
 */
export function mixLight(c: number): number {
  return Math.floor((c + 255 * 8) / 9);
}

/**
 * Build a full hex color string from RGB components.
 *
 * @param r — Red channel (0–255)
 * @param g — Green channel (0–255)
 * @param b — Blue channel (0–255)
 * @returns Hex color string (e.g., "#3b82f6")
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ─────────────────────────────────────────────────────────
// CALENDAR GRID COMPUTATION
// ─────────────────────────────────────────────────────────

/**
 * Build the 42-cell calendar grid for a given month.
 *
 * Why 42 cells? A calendar month can span up to 6 rows × 7 columns.
 * We pad with trailing days from the previous month and leading days
 * from the next month to always fill the complete grid.
 *
 * The grid uses ISO 8601 week ordering (Monday = first column).
 * JavaScript's `Date.getDay()` returns 0=Sunday, so we remap:
 *   Sunday(0)→6, Monday(1)→0, Tuesday(2)→1, etc.
 *
 * @param year — Full year (e.g., 2026)
 * @param monthIndex — Zero-based month index (0=January, 11=December)
 * @param today — The real "today" Date for marking `isToday`
 * @returns Array of exactly 42 CalendarDay objects
 */
export function computeCalendarDays(
  year: number,
  monthIndex: number,
  today: Date
): CalendarDay[] {
  // getDay() for the 1st of the month (0=Sun, 1=Mon, ..., 6=Sat)
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();

  // Convert to Monday-first index: Sun(0)→6, Mon(1)→0, Tue(2)→1, etc.
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const days: CalendarDay[] = [];

  // ── Previous month's trailing days ──
  // Fill the gap before the 1st falls. E.g., if the 1st is Wednesday (index 2),
  // we need 2 cells from the previous month (Monday, Tuesday).
  for (let i = startingDayIndex - 1; i >= 0; i--) {
    const dateVal = daysInPrevMonth - i;
    const dateKey = new Date(year, monthIndex - 1, dateVal).getTime();
    days.push({ val: dateVal, type: "prev", dateKey });
  }

  // ── Current month's days ──
  for (let i = 1; i <= daysInMonth; i++) {
    const dayOfWeek = new Date(year, monthIndex, i).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const isToday =
      today.getDate() === i &&
      today.getMonth() === monthIndex &&
      today.getFullYear() === year;

    // Synthetic event indicator — deterministic pattern based on date math.
    // In a real app, this would come from a database or API.
    const hasEvent =
      !isWeekend && ((i * (monthIndex + 1)) % 11 === 0 || i === 15);

    const dateKey = new Date(year, monthIndex, i).getTime();

    days.push({ val: i, type: "curr", weekend: isWeekend, isToday, hasEvent, dateKey });
  }

  // ── Next month's leading days ──
  // Fill remaining cells to reach exactly 42.
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const dateKey = new Date(year, monthIndex + 1, i).getTime();
    days.push({ val: i, type: "next", dateKey });
  }

  return days;
}

// ─────────────────────────────────────────────────────────
// SELECTION UI HELPERS
// ─────────────────────────────────────────────────────────

/**
 * Determine the Tailwind border-radius class for a date cell
 * within a selected range "pill" shape.
 *
 * The range pill has rounded ends:
 *   - Left-rounded for the start date
 *   - Right-rounded for the end date
 *   - Fully rounded if start === end
 *   - No rounding for middle cells (they're rectangular fill)
 *
 * @param isStart — Whether this cell is the range start
 * @param isEnd — Whether this cell is the confirmed range end
 * @param isHoverEnd — Whether this cell is the tentative hover end
 * @returns Tailwind border-radius utility class
 */
export function getRangeBorderRadius(
  isStart: boolean,
  isEnd: boolean,
  isHoverEnd: boolean
): string {
  if (isStart && (isEnd || isHoverEnd)) return "rounded-l-full";
  if (!isStart && (isEnd || isHoverEnd)) return "rounded-r-full";
  if (isStart && !isEnd && !isHoverEnd) return "rounded-full";
  return "";
}

// ─────────────────────────────────────────────────────────
// MONTH PROGRESS
// ─────────────────────────────────────────────────────────

/**
 * Calculate the month progress percentage for the progress bar.
 *
 * Rules:
 *   - If viewing the current month → percentage = today's date / total days
 *   - If viewing a past month → 100%
 *   - If viewing a future month → 0%
 *
 * @param today — The real "today" Date
 * @param year — Year being viewed
 * @param monthIndex — Month being viewed (0-based)
 * @returns Percentage value (0–100)
 */
export function calculateMonthProgress(
  today: Date,
  year: number,
  monthIndex: number
): number {
  const isCurrentMonth =
    today.getMonth() === monthIndex && today.getFullYear() === year;

  if (isCurrentMonth) {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return (today.getDate() / daysInMonth) * 100;
  }

  // Past month → fully complete
  const isPast =
    year < today.getFullYear() ||
    (year === today.getFullYear() && monthIndex < today.getMonth());

  return isPast ? 100 : 0;
}
