/**
 * @fileoverview useCalendarDays — Memoized Calendar Grid Computation Hook
 *
 * Thin hook wrapper around the pure `computeCalendarDays` utility function.
 * The hook provides React-friendly memoization so the 42-cell grid is only
 * recalculated when the year or month actually changes.
 *
 * Separation rationale:
 *   - Pure logic lives in `@/lib/utils` (testable without React)
 *   - This hook handles the React memoization layer
 */

"use client";

import { useMemo } from "react";
import type { CalendarDay } from "@/lib/types";
import { computeCalendarDays } from "@/lib/utils";

/**
 * Compute and memoize the 42-cell calendar grid for the given month.
 *
 * @param year — Full year (e.g., 2026)
 * @param monthIndex — Zero-based month index (0=January)
 * @param today — The real "today" Date (used to mark `isToday` on the correct cell)
 * @returns Memoized array of 42 CalendarDay objects
 *
 * @example
 * ```tsx
 * const days = useCalendarDays(2026, 3, new Date()); // April 2026
 * // days.length === 42
 * // days.filter(d => d.type === 'curr').length === 30 (April has 30 days)
 * ```
 */
export function useCalendarDays(
  year: number,
  monthIndex: number,
  today: Date
): CalendarDay[] {
  return useMemo(
    () => computeCalendarDays(year, monthIndex, today),
    [year, monthIndex, today]
  );
}
