/**
 * @fileoverview Nelala Calendar — TypeScript Type Definitions
 *
 * Centralized type system for the entire calendar application.
 * All interfaces and type aliases live here to enforce a single
 * source of truth and enable type-safe component communication.
 *
 * Naming Convention:
 *   - Interfaces use PascalCase (e.g., `MonthData`)
 *   - Type aliases use PascalCase (e.g., `HolidayMap`)
 *   - Enum-like unions use UPPER_SNAKE for values
 */

// ─────────────────────────────────────────────────────────
// DATA MODEL TYPES
// ─────────────────────────────────────────────────────────

/**
 * Configuration for a single calendar month.
 *
 * Each month carries its own visual identity — a hero image,
 * a primary accent color, and a light tint for backgrounds.
 * These values drive the dynamic theming system.
 */
export interface MonthData {
  /** Full uppercase month name (e.g., "JANUARY") */
  readonly name: string;

  /** Subtitle / tagline displayed beneath the month name */
  readonly sub: string;

  /** Path to the local hero image (e.g., "/months/january.png") */
  readonly img: string;

  /** Primary accent color in hex (e.g., "#3b82f6") — used for selections, highlights */
  readonly color: string;

  /** Light tint color in hex (e.g., "#eff6ff") — used for backgrounds, range fills */
  readonly lightColor: string;
}

import type { M3Palette } from "./m3Theme";

/**
 * Dynamic theme extracted from the hero image via canvas color analysis.
 * Includes the full M3 semantic palette derived from the dominant color.
 */
export interface DynamicTheme {
  /** Primary accent color derived from image analysis */
  color: string;
  /** Light tint derived by blending the accent heavily toward white */
  lightColor: string;
  /** Full M3-style semantic palette derived from the dominant color */
  palette: M3Palette;
}

/**
 * Represents a single cell in the 42-cell (6×7) calendar grid.
 *
 * The grid always renders exactly 42 cells to maintain a consistent
 * layout. Cells from adjacent months are included but visually dimmed.
 */
export interface CalendarDay {
  /** Day number (1-31) */
  readonly val: number;

  /**
   * Which month this cell belongs to:
   *   - "prev"  → trailing days from the previous month
   *   - "curr"  → days in the currently displayed month
   *   - "next"  → leading days from the next month
   */
  readonly type: "prev" | "curr" | "next";

  /** Whether this day falls on Saturday or Sunday */
  readonly weekend?: boolean;

  /** Whether this day is today's date */
  readonly isToday?: boolean;

  /** Whether this day belongs to a range that has saved notes */
  readonly hasNote?: boolean;

  /**
   * Whether this day has a synthetic "event" indicator.
   * Generated algorithmically: non-weekend days where
   * `(dayNumber × (monthIndex + 1)) % 11 === 0` or day is 15th.
   */
  readonly hasEvent?: boolean;

  /** Epoch timestamp (ms) — used as a stable identity key for selection logic */
  readonly dateKey: number;
}

/**
 * Statistics computed from a selected date range.
 * Displayed in the "Selection Intel" flip panel.
 */
export interface SelectionStats {
  /** Total calendar days in the range (inclusive) */
  total: number;
  /** Number of weekdays (Mon–Fri) in the range */
  work: number;
  /** Number of weekend days (Sat–Sun) in the range */
  weekend: number;
  /** Number of complete weeks spanned */
  weeks: number;
  /** Work efficiency as a 0–100 percentage */
  workRatio: number;
  /** Formatted start date string e.g. "Apr 8" */
  startLabel: string;
  /** Formatted end date string e.g. "Apr 22" */
  endLabel: string;
}

// ─────────────────────────────────────────────────────────
// RANGE TAGS
// ─────────────────────────────────────────────────────────

/** Available tag categories for date ranges */
export type RangeTag = "work" | "vacation" | "event" | "focus";

/** Configuration for a single tag type — icon, label, and color */
export interface TagConfig {
  readonly id: RangeTag;
  readonly label: string;
  readonly icon: string;
  readonly color: string;
  readonly bgColor: string;
}

/** All available tags with their visual configuration */
export const TAG_CONFIGS: readonly TagConfig[] = [
  { id: "work",     label: "Work",     icon: "💼", color: "#3b82f6", bgColor: "#3b82f615" },
  { id: "vacation", label: "Vacation", icon: "🏖️", color: "#10b981", bgColor: "#10b98115" },
  { id: "event",    label: "Event",    icon: "🎉", color: "#f59e0b", bgColor: "#f59e0b15" },
  { id: "focus",    label: "Focus",    icon: "🎯", color: "#8b5cf6", bgColor: "#8b5cf615" },
] as const;

// ─────────────────────────────────────────────────────────
// TYPE ALIASES
// ─────────────────────────────────────────────────────────

/**
 * Maps "monthIndex-dayNumber" strings to holiday names.
 *
 * Key format: `"${monthIndex}-${dayOfMonth}"` where monthIndex is 0-based.
 * Example: `"0-26"` → "Republic Day" (January 26th)
 */
export type HolidayMap = Record<string, string>;

/**
 * Animation direction for month transition slides.
 *   - "next" → slide left (moving forward)
 *   - "prev" → slide right (moving backward)
 *   - "entering" → pop-in animation after slide
 *   - "" → idle / no animation
 */
export type AnimationDirection = "next" | "prev" | "entering" | "";
