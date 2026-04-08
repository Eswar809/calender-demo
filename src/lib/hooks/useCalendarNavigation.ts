/**
 * @fileoverview useCalendarNavigation — Month/Year Navigation Hook
 *
 * Encapsulates all navigation state and transitions for the calendar:
 *   - Current month/year tracking
 *   - Animated month transitions (slide-out → pop-in sequence)
 *   - Year selector overlay toggle
 *   - "Jump to today" shortcut
 *
 * Animation Sequence:
 *   1. User clicks ◀ or ▶
 *   2. `animating` → "prev" or "next" (triggers CSS slide-out)
 *   3. After SLIDE_DURATION_MS, `currentDate` updates & `animating` → "entering" (triggers pop-in)
 *   4. After POP_IN_DURATION_MS, `animating` → "" (idle)
 *
 * This two-phase approach prevents layout jumps — the old grid slides away
 * before the new grid measurements are applied.
 */

"use client";

import { useState, useCallback } from "react";
import type { AnimationDirection } from "@/lib/types";
import { SLIDE_DURATION_MS, POP_IN_DURATION_MS } from "@/lib/constants";

/** Return type for the useCalendarNavigation hook */
export interface CalendarNavigationState {
  /** Currently displayed date (1st of the month) */
  currentDate: Date;
  /** Full year of the currently displayed month */
  year: number;
  /** Zero-based month index (0=January) */
  monthIndex: number;
  /** Current animation phase */
  animating: AnimationDirection;
  /** Whether the year selector overlay is visible */
  showYearSelector: boolean;

  /** Navigate to the previous or next month with animation */
  changeMonthWithAnimation: (direction: "next" | "prev") => void;
  /** Jump directly to today's month and highlight today's date */
  jumpToToday: () => Date;
  /** Set a specific year while keeping the current month */
  setYear: (y: number) => void;
  /** Toggle the year selector overlay */
  setShowYearSelector: (show: boolean) => void;
}

/**
 * Custom hook for calendar month/year navigation with animated transitions.
 *
 * @param realToday — The actual current date (injected for testability)
 * @returns Navigation state and action functions
 *
 * @example
 * ```tsx
 * const { year, monthIndex, changeMonthWithAnimation } = useCalendarNavigation(new Date());
 * ```
 */
export function useCalendarNavigation(realToday: Date): CalendarNavigationState {
  const [currentDate, setCurrentDate] = useState(
    () => new Date(realToday.getFullYear(), realToday.getMonth(), 1)
  );
  const [animating, setAnimating] = useState<AnimationDirection>("");
  const [showYearSelector, setShowYearSelector] = useState(false);

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();

  /**
   * Trigger a two-phase month change animation.
   *
   * Phase 1: Set animation direction → CSS plays slide-out
   * Phase 2: After slide completes, update data & trigger pop-in
   *
   * Guards against rapid-fire clicks by checking `animating` state.
   */
  const changeMonthWithAnimation = useCallback(
    (direction: "next" | "prev") => {
      if (animating) return; // Prevent overlapping animations

      setAnimating(direction);

      setTimeout(() => {
        // Update the actual month data
        setCurrentDate((prev) => {
          const offset = direction === "next" ? 1 : -1;
          return new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
        });

        // Trigger the pop-in phase
        setAnimating("entering");

        setTimeout(() => {
          setAnimating(""); // Return to idle
        }, POP_IN_DURATION_MS);
      }, SLIDE_DURATION_MS);
    },
    [animating]
  );

  /**
   * Jump to today's month and return today's epoch timestamp
   * so the caller can set it as the selected start date.
   */
  const jumpToToday = useCallback((): Date => {
    setCurrentDate(
      new Date(realToday.getFullYear(), realToday.getMonth(), 1)
    );
    return realToday;
  }, [realToday]);

  /**
   * Change the year while preserving the current month.
   * Also closes the year selector overlay.
   */
  const setYear = useCallback(
    (y: number) => {
      setCurrentDate(prev => new Date(y, prev.getMonth(), 1));
      setShowYearSelector(false);
    },
    []
  );

  return {
    currentDate,
    year,
    monthIndex,
    animating,
    showYearSelector,
    changeMonthWithAnimation,
    jumpToToday,
    setYear,
    setShowYearSelector,
  };
}
