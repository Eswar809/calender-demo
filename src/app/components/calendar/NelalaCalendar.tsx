"use client";

import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import { useCalendarNavigation } from "@/lib/hooks/useCalendarNavigation";
import { useDateSelection } from "@/lib/hooks/useDateSelection";
import { useImageColorExtraction } from "@/lib/hooks/useImageColorExtraction";
import { useCalendarDays } from "@/lib/hooks/useCalendarDays";
import { useRangeNotes } from "@/lib/hooks/useRangeNotes";
import { MONTHS_DATA } from "@/lib/constants";
import { calculateMonthProgress } from "@/lib/utils";
import HeroSection from "./HeroSection";
import CalendarGrid from "./CalendarGrid";
import SmartPanel from "./SmartPanel";

/**
 * NelalaCalendar — Root calendar component.
 *
 * Premium enhancements:
 *   - Mesh gradient background with theme-reactive coloring
 *   - Three floating aurora orbs for ambient depth
 *   - Card with color-matched glow shadow
 *   - Inner light on content area
 *   - Range notes indicator dots on calendar grid
 *   - Interactive tag system for date ranges
 */
export default function NelalaCalendar() {
  const realToday = useMemo(() => new Date(), []);

  const navigation = useCalendarNavigation(realToday);
  const selection = useDateSelection();
  const currentTheme = MONTHS_DATA[navigation.monthIndex];
  const { dynamicTheme, imageLoaded } = useImageColorExtraction(currentTheme);
  const calendarDays = useCalendarDays(navigation.year, navigation.monthIndex, realToday);

  // ── Notes & Tags via centralized hook ──
  const rangeNotes = useRangeNotes();

  const monthKey = `${navigation.year}-${navigation.monthIndex}`;
  const notes = rangeNotes.getMonthNote(navigation.year, navigation.monthIndex);

  const handleNotesChange = useCallback((text: string) => {
    rangeNotes.setMonthNote(navigation.year, navigation.monthIndex, text);
  }, [rangeNotes, navigation.year, navigation.monthIndex]);

  // ── Range-specific notes ──
  const rangeNote = rangeNotes.getRangeNote(selection.startDate, selection.endDate);

  const handleRangeNoteChange = useCallback((text: string) => {
    rangeNotes.setRangeNote(selection.startDate, selection.endDate, text);
  }, [rangeNotes, selection.startDate, selection.endDate]);

  // ── Range tags ──
  const rangeTags = rangeNotes.getRangeTags(selection.startDate, selection.endDate);

  const handleToggleTag = useCallback((tag: import("@/lib/types").RangeTag) => {
    rangeNotes.toggleRangeTag(selection.startDate, selection.endDate, tag);
  }, [rangeNotes, selection.startDate, selection.endDate]);

  const daysInCurrentMonth = new Date(navigation.year, navigation.monthIndex + 1, 0).getDate();
  const progressPercentage = calculateMonthProgress(realToday, navigation.year, navigation.monthIndex);

  const handleJumpToToday = useCallback(() => {
    const today = navigation.jumpToToday();
    selection.setStartDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime());
  }, [navigation, selection]);

  const p = dynamicTheme.palette;

  return (
    <div
      className="h-[100dvh] flex items-center justify-center overflow-hidden relative transition-all duration-1000"
      style={{
        /* Rich mesh gradient background instead of plain dots */
        background: `
          radial-gradient(ellipse at 20% 20%, ${p.tint20} 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, ${p.tint20} 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, ${p.tint10} 0%, ${p.tint10} 100%)
        `,
      }}
    >
      {/* Dot pattern overlay for texture */}
      <div
        className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000"
        style={{
          backgroundImage: `radial-gradient(${p.tint40}30 0.8px, transparent 0.8px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Preload all month images so there is no delay when switching */}
      <div className="hidden" aria-hidden="true">
        {MONTHS_DATA.map((month) => (
          <Image key={month.name} src={month.img} alt="" width={1} height={1} priority unoptimized />
        ))}
      </div>

      {/* ── Floating aurora orbs ── */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full aurora-glow -top-40 -left-40 z-0"
        style={{ backgroundColor: p.primary, opacity: 0.12 }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full aurora-glow -bottom-32 -right-32 z-0"
        style={{ backgroundColor: p.secondary, opacity: 0.1, animationDelay: "5s" }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full aurora-glow top-1/3 right-1/4 z-0"
        style={{ backgroundColor: p.tint40, opacity: 0.08, animationDelay: "10s" }}
      />

      {/* ── Main Card ── */}
      <div
        className="
          relative w-full h-full flex flex-col overflow-hidden z-10
          md:max-w-[980px] md:max-h-[calc(100dvh-48px)]
          md:rounded-[2rem]
          transition-all duration-700
        "
        style={{
          backgroundColor: p.surface,
          boxShadow: `
            0 40px 100px -20px rgba(0,0,0,0.2),
            0 0 0 1px ${p.outlineVariant}40,
            0 0 80px -10px ${p.primary}12
          `,
        }}
      >
        {/* Hero */}
        <HeroSection
          currentTheme={currentTheme}
          dynamicTheme={dynamicTheme}
          imageLoaded={imageLoaded}
          year={navigation.year}
          monthIndex={navigation.monthIndex}
          progressPercentage={progressPercentage}
          showYearSelector={navigation.showYearSelector}
          todayYear={realToday.getFullYear()}
          onPrevMonth={() => navigation.changeMonthWithAnimation("prev")}
          onNextMonth={() => navigation.changeMonthWithAnimation("next")}
          onJumpToToday={handleJumpToToday}
          onSelectYear={navigation.setYear}
          onToggleYearSelector={navigation.setShowYearSelector}
        />

        {/* Content area */}
        <div
          className="
            relative z-40 flex-1 min-h-0 flex flex-col md:flex-row
            overflow-y-auto md:overflow-hidden
            px-3 sm:px-5 md:px-8
            py-4 sm:py-5 md:py-6
            gap-4 sm:gap-5 md:gap-8
            custom-scrollbar
            rounded-t-3xl sm:rounded-t-[2rem] md:rounded-t-[2.5rem]
            -mt-5 sm:-mt-6 md:-mt-8
          "
          style={{
            backgroundColor: p.surface,
            boxShadow: `0 -16px 50px -10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.5)`,
          }}
        >
          <CalendarGrid
            calendarDays={calendarDays}
            monthIndex={navigation.monthIndex}
            dynamicTheme={dynamicTheme}
            animating={navigation.animating}
            startDate={selection.startDate}
            endDate={selection.endDate}
            hoverDate={selection.hoverDate}
            onDateClick={selection.handleDateClick}
            onDateHover={selection.handleDateHover}
            onDateLeave={selection.clearHover}
            onClearSelection={selection.clearSelection}
            notedDateKeys={rangeNotes.notedDateKeys}
            dateTagsMap={rangeNotes.dateTagsMap}
          />

          <SmartPanel
            isRangeSelected={selection.isRangeSelected}
            dynamicTheme={dynamicTheme}
            notes={notes}
            onNotesChange={handleNotesChange}
            daysInCurrentMonth={daysInCurrentMonth}
            todayDate={realToday.getDate()}
            calendarDays={calendarDays}
            monthIndex={navigation.monthIndex}
            selectionStats={selection.selectionStats}
            rangeNote={rangeNote}
            onRangeNoteChange={handleRangeNoteChange}
            rangeTags={rangeTags}
            onToggleTag={handleToggleTag}
          />
        </div>
      </div>
    </div>
  );
}
