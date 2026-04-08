"use client";

import React, { useRef, useCallback } from "react";
import Image from "next/image";
import type { MonthData, DynamicTheme } from "@/lib/types";
import YearSelector from "./YearSelector";
import CustomOverlay from "./CustomOverlay";

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover/btn:-translate-x-0.5 transition-transform">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function ImageEditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

interface HeroSectionProps {
  currentTheme: MonthData;
  dynamicTheme: DynamicTheme;
  imageLoaded: boolean;
  year: number;
  monthIndex: number;
  progressPercentage: number;
  showYearSelector: boolean;
  todayYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpToToday: () => void;
  onSelectYear: (year: number) => void;
  onToggleYearSelector: (show: boolean) => void;
}

/**
 * HeroSection — Cinematic full-width banner.
 *
 * Visual upgrades:
 *   - Month name with CSS gradient text + subtle shimmer
 *   - Color-tinted image overlay for theme cohesion
 *   - Dual-glow progress bar with leading dot
 *   - Glassmorphic navigation with depth
 *   - Floating aurora orb for ambient light
 *   - Decorative corner accent
 */
export default function HeroSection({
  currentTheme,
  dynamicTheme,
  imageLoaded,
  year,
  monthIndex,
  progressPercentage,
  showYearSelector,
  todayYear,
  onPrevMonth,
  onNextMonth,
  onJumpToToday,
  onSelectYear,
  onToggleYearSelector,
}: HeroSectionProps) {
  const p = dynamicTheme.palette;

  /* ── Swipe gesture for mobile month navigation ── */
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal swipe is dominant and > 50px
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) onNextMonth();
      else onPrevMonth();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }, [onNextMonth, onPrevMonth]);

  return (
    <div
      className="relative h-[180px] sm:h-[220px] md:h-[260px] w-full overflow-hidden shrink-0 group"
      style={{ backgroundColor: p.tint20 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div id="hero-custom-overlay-root" className="absolute inset-0 z-15 pointer-events-none" />
      {/* Hero Image with Ken Burns */}
      <div className={`absolute inset-0 transition-all duration-[1.5s] ease-in-out ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}>
        <Image
          src={currentTheme.img}
          alt={`${currentTheme.name} — ${currentTheme.sub}`}
          fill
          sizes="(max-width: 1000px) 100vw, 1000px"
          className="object-cover object-center transform transition-transform duration-[30s] ease-out group-hover:scale-110"
          priority
          unoptimized
        />
      </div>

      {/* ── Cinematic gradient overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.4)_100%)]" />
      {/* Theme color wash for cohesion */}
      <div className="absolute inset-0 mix-blend-overlay opacity-20" style={{ backgroundColor: p.primary }} />

      {/* Year Selector */}
      {showYearSelector && (
        <YearSelector currentYear={year} monthIndex={monthIndex} todayYear={todayYear} onSelectYear={onSelectYear} onClose={() => onToggleYearSelector(false)} />
      )}

      {/* ── Top Navigation ── */}
      <div className="absolute top-3 sm:top-5 left-4 right-4 sm:left-5 sm:right-5 flex justify-between items-center z-30">
        <button
          onClick={onJumpToToday}
          className="h-8 sm:h-9 px-4 sm:px-5 bg-white/10 hover:bg-white/25 backdrop-blur-2xl border border-white/20 hover:border-white/35 text-white text-[0.6rem] sm:text-[0.65rem] font-black tracking-[0.2em] uppercase rounded-full transition-all duration-300 active:scale-95 hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
          aria-label="Jump to today"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            Today
          </span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <CustomOverlay primaryColor={p.primary} monthKey={`${year}-${monthIndex}`} renderTrigger={(openEditor, hasImage) => (
            <button
              onClick={openEditor}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-2xl border active:scale-90 group/btn ${
                hasImage
                  ? 'bg-white/20 border-white/35 text-white shadow-[0_2px_12px_rgba(255,255,255,0.12)]'
                  : 'bg-white/8 border-white/15 text-white/40 hover:bg-white/22 hover:border-white/30 hover:text-white hover:shadow-[0_4px_20px_rgba(255,255,255,0.12)]'
              }`}
              aria-label="Custom overlay image"
              title="Custom overlay image"
            >
              <ImageEditIcon />
            </button>
          )} />
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-px h-5 bg-white/10 rounded-full" />
            <button onClick={onPrevMonth} className="bg-white/8 hover:bg-white/22 backdrop-blur-2xl border border-white/15 hover:border-white/30 text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-300 active:scale-90 group/btn flex items-center justify-center hover:shadow-[0_4px_20px_rgba(255,255,255,0.12)]" aria-label="Previous month">
              <ChevronLeftIcon />
            </button>
            <button onClick={onNextMonth} className="bg-white/8 hover:bg-white/22 backdrop-blur-2xl border border-white/15 hover:border-white/30 text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-300 active:scale-90 group/btn flex items-center justify-center hover:shadow-[0_4px_20px_rgba(255,255,255,0.12)]" aria-label="Next month">
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ── Progress bar with dual glow ── */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5 z-40">
        <div
          className="h-full transition-all duration-1000 ease-out relative"
          style={{
            width: `${progressPercentage}%`,
            background: `linear-gradient(90deg, ${p.primary}, ${p.secondary || p.primary})`,
            boxShadow: `0 0 12px ${p.primary}60, 0 0 4px ${p.primary}90`,
          }}
        >
          {/* Leading bright dot */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </div>
      </div>

      {/* ── Typography ── */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-4 sm:left-5 md:left-8 text-left z-20 w-full pr-8">
        {/* Month Name — bold white with dramatic text shadow */}
        <h1
          className="text-[2.2rem] min-[400px]:text-5xl sm:text-[4.2rem] font-black tracking-[-0.03em] leading-[0.9] text-white"
          style={{
            textShadow: `
              0 2px 8px rgba(0,0,0,0.5),
              0 8px 40px rgba(0,0,0,0.3),
              0 0 60px ${p.primary}30
            `,
          }}
        >
          {currentTheme.name}
        </h1>
        {/* Year + subtitle */}
        <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2.5">
          <button
            onClick={() => onToggleYearSelector(true)}
            className="text-lg sm:text-xl md:text-2xl font-light text-white/50 tracking-wider hover:text-white/90 transition-all duration-300 flex items-center gap-1.5 cursor-pointer bg-transparent border-none hover:tracking-widest"
            aria-label={`Change year, currently ${year}`}
          >
            {year}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-40">
              <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className="h-4 w-px bg-white/15 rounded-full" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className="h-[3px] w-6 sm:w-7 rounded-full transition-all duration-1000"
              style={{
                background: `linear-gradient(90deg, ${p.primary}, ${p.secondary || p.primary})`,
                boxShadow: `0 0 10px ${p.primary}60`,
              }}
            />
            <p className="text-[0.55rem] sm:text-[0.65rem] font-bold tracking-[0.22em] text-white/60 uppercase">
              {currentTheme.sub}
            </p>
          </div>
        </div>
      </div>

      {/* ── Decorative aurora orb ── */}
      <div
        className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full aurora-glow z-10"
        style={{ backgroundColor: p.primary, opacity: 0.25 }}
      />
      {/* Corner decorative accent */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full aurora-glow opacity-15"
        style={{ backgroundColor: p.secondary || p.primary, animationDelay: "7s" }}
      />
      
    </div>
  );
}
