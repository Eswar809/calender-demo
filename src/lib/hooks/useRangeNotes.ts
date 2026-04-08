/**
 * @fileoverview useRangeNotes — Range Notes & Tags Management Hook
 *
 * Provides:
 *   1. A set of dateKeys that belong to ranges with saved notes (for dot indicators)
 *   2. Tag management (read/write/toggle) for date ranges
 *   3. Notes management (read/write) for date ranges
 *
 * All data persists to localStorage under "nelala_notes" (notes) and "nelala_tags" (tags).
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { RangeTag } from "@/lib/types";

/** Shape of the notes cache: key → value string */
type NotesCache = Record<string, string>;

/** Shape of the tags cache: rangeKey → array of tags */
type TagsCache = Record<string, RangeTag[]>;

export interface RangeNotesState {
  /** Set of dateKey timestamps that belong to a range with notes */
  notedDateKeys: Set<number>;
  /** Map of dateKey timestamps to an array of tags (handles overlapping ranges) */
  dateTagsMap: Map<number, RangeTag[]>;
  /** Notes cache for all range/month notes */
  localNotesCache: NotesCache;
  /** Get the note for a specific range */
  getRangeNote: (startDate: number | null, endDate: number | null) => string;
  /** Set the note for a specific range */
  setRangeNote: (startDate: number | null, endDate: number | null, text: string) => void;
  /** Get monthly note */
  getMonthNote: (year: number, monthIndex: number) => string;
  /** Set monthly note */
  setMonthNote: (year: number, monthIndex: number, text: string) => void;
  /** Get tags for a specific range */
  getRangeTags: (startDate: number | null, endDate: number | null) => RangeTag[];
  /** Toggle a tag on/off for a range */
  toggleRangeTag: (startDate: number | null, endDate: number | null, tag: RangeTag) => void;
}

/**
 * Hook that manages range notes and tags with localStorage persistence.
 *
 * Scans all stored range notes to build a Set<number> of dateKeys
 * that fall within any noted range — used for calendar dot indicators.
 */
export function useRangeNotes(): RangeNotesState {
  const [localNotesCache, setLocalNotesCache] = useState<NotesCache>({});
  const [tagsCache, setTagsCache] = useState<TagsCache>({});

  // ── Hydrate from localStorage on mount ──
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("nelala_notes");
      if (savedNotes) setLocalNotesCache(JSON.parse(savedNotes));
    } catch { /* silently ignore */ }

    try {
      const savedTags = localStorage.getItem("nelala_tags");
      if (savedTags) setTagsCache(JSON.parse(savedTags));
    } catch { /* silently ignore */ }
  }, []);

  // ── Compute the set of dateKeys that have notes ──
  const notedDateKeys = useMemo(() => {
    const keys = new Set<number>();

    for (const [key, value] of Object.entries(localNotesCache)) {
      // Only process range notes (format: "range_{start}_{end}")
      if (!key.startsWith("range_") || !value || value.trim() === "") continue;

      const parts = key.split("_");
      if (parts.length !== 3) continue;

      const start = parseInt(parts[1], 10);
      const end = parseInt(parts[2], 10);
      if (isNaN(start) || isNaN(end)) continue;

      // Walk every day in the range and add its dateKey
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      const cursor = new Date(lo);
      const endDate = new Date(hi);

      while (cursor <= endDate) {
        // Normalize to midnight to match CalendarDay dateKeys
        const normalized = new Date(
          cursor.getFullYear(),
          cursor.getMonth(),
          cursor.getDate()
        ).getTime();
        keys.add(normalized);
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    return keys;
  }, [localNotesCache]);

  // ── Compute the map of dateKeys to their tags ──
  const dateTagsMap = useMemo(() => {
    const map = new Map<number, RangeTag[]>();

    for (const [key, tags] of Object.entries(tagsCache)) {
      if (!key.startsWith("range_") || !tags || tags.length === 0) continue;

      const parts = key.split("_");
      if (parts.length !== 3) continue;

      const start = parseInt(parts[1], 10);
      const end = parseInt(parts[2], 10);
      if (isNaN(start) || isNaN(end)) continue;

      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      const cursor = new Date(lo);
      const endDate = new Date(hi);

      while (cursor <= endDate) {
        const normalized = new Date(
          cursor.getFullYear(),
          cursor.getMonth(),
          cursor.getDate()
        ).getTime();
        
        const existing = map.get(normalized) || [];
        const merged = Array.from(new Set([...existing, ...tags]));
        map.set(normalized, merged);
        
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    return map;
  }, [tagsCache]);

  // ── Range note helpers ──
  const makeRangeKey = (start: number, end: number) =>
    `range_${Math.min(start, end)}_${Math.max(start, end)}`;

  const getRangeNote = useCallback(
    (startDate: number | null, endDate: number | null): string => {
      if (!startDate || !endDate) return "";
      return localNotesCache[makeRangeKey(startDate, endDate)] || "";
    },
    [localNotesCache]
  );

  const setRangeNote = useCallback(
    (startDate: number | null, endDate: number | null, text: string) => {
      if (!startDate || !endDate) return;
      const key = makeRangeKey(startDate, endDate);
      setLocalNotesCache((prev) => {
        const next = { ...prev, [key]: text };
        try { localStorage.setItem("nelala_notes", JSON.stringify(next)); } catch {}
        return next;
      });
    },
    []
  );

  // ── Monthly note helpers ──
  const getMonthNote = useCallback(
    (year: number, monthIndex: number): string => {
      return localNotesCache[`${year}-${monthIndex}`] || "";
    },
    [localNotesCache]
  );

  const setMonthNote = useCallback(
    (year: number, monthIndex: number, text: string) => {
      const key = `${year}-${monthIndex}`;
      setLocalNotesCache((prev) => {
        const next = { ...prev, [key]: text };
        try { localStorage.setItem("nelala_notes", JSON.stringify(next)); } catch {}
        return next;
      });
    },
    []
  );

  // ── Tag helpers ──
  const makeTagKey = (start: number, end: number) =>
    `range_${Math.min(start, end)}_${Math.max(start, end)}`;

  const getRangeTags = useCallback(
    (startDate: number | null, endDate: number | null): RangeTag[] => {
      if (!startDate || !endDate) return [];
      return tagsCache[makeTagKey(startDate, endDate)] || [];
    },
    [tagsCache]
  );

  const toggleRangeTag = useCallback(
    (startDate: number | null, endDate: number | null, tag: RangeTag) => {
      if (!startDate || !endDate) return;
      const key = makeTagKey(startDate, endDate);
      setTagsCache((prev) => {
        const current = prev[key] || [];
        const next = current.includes(tag)
          ? current.filter((t) => t !== tag)
          : [...current, tag];
        const updated = { ...prev, [key]: next };
        try { localStorage.setItem("nelala_tags", JSON.stringify(updated)); } catch {}
        return updated;
      });
    },
    []
  );

  return {
    notedDateKeys,
    dateTagsMap,
    localNotesCache,
    getRangeNote,
    setRangeNote,
    getMonthNote,
    setMonthNote,
    getRangeTags,
    toggleRangeTag,
  };
}
