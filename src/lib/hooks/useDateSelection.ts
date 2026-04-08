/**
 * @fileoverview useDateSelection — Date Range Selection Hook
 *
 * Implements a two-click date range selection pattern:
 *   1. First click → sets the start date
 *   2. Second click → sets the end date (if after start) or resets start (if before)
 *   3. Third click → clears range and starts a new selection
 *
 * Also manages:
 *   - Hover state for tentative range preview
 *   - Memoized selection statistics (total/work/weekend days)
 *   - Clear/reset action
 *
 * The hook uses epoch timestamps (number) as date identifiers,
 * which allows simple comparison operators and stable React keys.
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import type { SelectionStats } from "@/lib/types";

/** Return type for the useDateSelection hook */
export interface DateSelectionState {
  /** Epoch timestamp of the range start (null if no selection) */
  startDate: number | null;
  /** Epoch timestamp of the range end (null if incomplete selection) */
  endDate: number | null;
  /** Epoch timestamp of the currently hovered date (null if idle) */
  hoverDate: number | null;
  /** Whether a complete range (start + end) is selected */
  isRangeSelected: boolean;
  /** Computed statistics for the selected range (null if incomplete) */
  selectionStats: SelectionStats | null;

  /** Handle a click on a date cell */
  handleDateClick: (dateKey: number) => void;
  /** Handle mouse enter on a date cell (for range preview) */
  handleDateHover: (dateKey: number) => void;
  /** Handle mouse leave from a date cell */
  clearHover: () => void;
  /** Reset the entire selection */
  clearSelection: () => void;
  /** Directly set the start date (used by jumpToToday) */
  setStartDate: (date: number | null) => void;
}

/**
 * Custom hook for interactive date range selection.
 *
 * @returns Selection state and interaction handlers
 *
 * @example
 * ```tsx
 * const { startDate, endDate, handleDateClick } = useDateSelection();
 * // First click: startDate = clicked timestamp, endDate = null
 * // Second click: endDate = clicked timestamp (if valid)
 * ```
 */
export function useDateSelection(): DateSelectionState {
  const [startDate, setStartDate] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<number | null>(null);
  const [hoverDate, setHoverDate] = useState<number | null>(null);

  /**
   * Date click handler implementing the three-state selection machine:
   *
   *   State A (no selection)      → click sets startDate
   *   State B (start only)        → click sets endDate (if after start)
   *                                  or resets startDate (if before start)
   *   State C (start + end)       → click clears range and sets new startDate
   */
  const handleDateClick = useCallback(
    (dateKey: number) => {
      if (!startDate || (startDate && endDate)) {
        // State A or C: begin new selection
        setStartDate(dateKey);
        setEndDate(null);
      } else if (startDate && !endDate) {
        // State B: complete or adjust the range
        if (dateKey <= startDate) {
          // Clicked on or before start → reset start, clear end
          setStartDate(dateKey);
          setEndDate(null);
        } else {
          // Clicked after start → finalize end
          setEndDate(dateKey);
        }
      }
    },
    [startDate, endDate]
  );

  /**
   * Hover handler — only active during State B (start selected, no end).
   * Creates a tentative range preview from start to hovered date.
   */
  const handleDateHover = useCallback(
    (dateKey: number) => {
      if (startDate && !endDate) {
        setHoverDate(dateKey);
      }
    },
    [startDate, endDate]
  );

  /** Clear the hover state (mouse leaves a date cell) */
  const clearHover = useCallback(() => {
    setHoverDate(null);
  }, []);

  /** Reset all selection state to initial */
  const clearSelection = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setHoverDate(null);
  }, []);

  const isRangeSelected = !!(startDate && endDate);

  /**
   * Memoized statistics for the selected range.
   *
   * Calculation:
   *   - Normalize start/end (user may click end before start)
   *   - Walk each day and check if it's a weekday (Mon–Fri)
   *   - Weekend count = total - work days
   *
   * Returns null if the range is incomplete.
   */
  const selectionStats = useMemo((): SelectionStats | null => {
    if (!startDate || !endDate) return null;

    const start = Math.min(startDate, endDate);
    const end = Math.max(startDate, endDate);
    const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

    let workDays = 0;
    const cursor = new Date(start);
    while (cursor.getTime() <= end) {
      const d = cursor.getDay();
      if (d !== 0 && d !== 6) workDays++;
      cursor.setDate(cursor.getDate() + 1);
    }

    const weekendDays = totalDays - workDays;
    const weeks = Math.floor(totalDays / 7);
    const workRatio = Math.round((workDays / totalDays) * 100);

    const fmt = (ts: number) => {
      const d = new Date(ts);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    return {
      total: totalDays,
      work: workDays,
      weekend: weekendDays,
      weeks,
      workRatio,
      startLabel: fmt(start),
      endLabel: fmt(end),
    };
  }, [startDate, endDate]);

  return {
    startDate,
    endDate,
    hoverDate,
    isRangeSelected,
    selectionStats,
    handleDateClick,
    handleDateHover,
    clearHover,
    clearSelection,
    setStartDate,
  };
}
