"use client";

import React, { useState, useEffect } from "react";
import type { DynamicTheme, SelectionStats, RangeTag } from "@/lib/types";
import { TAG_CONFIGS } from "@/lib/types";

interface SelectionIntelProps {
  selectionStats: SelectionStats | null;
  dynamicTheme: DynamicTheme;
  rangeNote: string;
  onRangeNoteChange: (text: string) => void;
  /** Currently active tags for the selected range */
  rangeTags: RangeTag[];
  /** Toggle a tag on/off for the selected range */
  onToggleTag: (tag: RangeTag) => void;
}

// ── Animated progress bar with gradient fill ──
function StatBar({ value, color, secondaryColor, bg }: { value: number; color: string; secondaryColor?: string; bg: string }) {
  return (
    <div className="w-full h-1.5 sm:h-2 rounded-full overflow-hidden" style={{ backgroundColor: bg }}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
        style={{
          width: `${Math.min(value, 100)}%`,
          background: secondaryColor
            ? `linear-gradient(90deg, ${color}, ${secondaryColor})`
            : color,
        }}
      >
        {/* Shimmer trail */}
        <div className="absolute right-0 top-0 w-4 h-full bg-white/30 blur-[2px] rounded-full" />
      </div>
    </div>
  );
}

// ── Metric card with hover lift ──
function MetricCard({
  label,
  value,
  suffix = "",
  accent,
  bg,
  borderColor,
  bar,
  secondaryAccent,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  accent: string;
  bg: string;
  borderColor: string;
  bar?: number;
  secondaryAccent?: string;
}) {
  return (
    <div
      className="flex-1 rounded-2xl p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2 transition-all duration-300 border hover:shadow-md hover:-translate-y-0.5 cursor-default"
      style={{ backgroundColor: bg, borderColor }}
    >
      <span className="text-[0.55rem] sm:text-[0.6rem] font-black tracking-[0.18em] uppercase" style={{ color: accent }}>
        {label}
      </span>
      <span className="text-xl sm:text-3xl font-black leading-none tabular-nums" style={{ color: accent }}>
        {value}
        {suffix && <span className="text-xs sm:text-sm font-bold ml-1 opacity-60">{suffix}</span>}
      </span>
      {bar !== undefined && (
        <StatBar value={bar} color={accent} secondaryColor={secondaryAccent} bg={`${accent}15`} />
      )}
    </div>
  );
}

// ── Tag Chip — Interactive pill with spring animation ──
function TagChip({
  config,
  isActive,
  onToggle,
  dynamicTheme,
}: {
  config: (typeof TAG_CONFIGS)[number];
  isActive: boolean;
  onToggle: () => void;
  dynamicTheme: DynamicTheme;
}) {
  const [bouncing, setBouncing] = useState(false);

  const handleClick = () => {
    setBouncing(true);
    onToggle();
    setTimeout(() => setBouncing(false), 450);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5
        rounded-xl border transition-all duration-300 cursor-pointer select-none
        hover:shadow-md active:scale-95
        ${bouncing ? "tag-bounce" : ""}
        ${isActive ? "tag-glow" : ""}
      `}
      style={{
        backgroundColor: isActive ? `${config.color}18` : dynamicTheme.palette.surfaceVariant,
        borderColor: isActive ? `${config.color}50` : dynamicTheme.palette.outlineVariant,
        // CSS custom property for glow animation
        ["--tag-color" as string]: config.color,
      }}
      aria-pressed={isActive}
      aria-label={`Tag: ${config.label}`}
    >
      {/* Active indicator stripe */}
      {isActive && (
        <div
          className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-full"
          style={{
            background: `linear-gradient(180deg, ${config.color}, ${config.color}80)`,
            boxShadow: `0 0 8px ${config.color}60`,
          }}
        />
      )}

      {/* Icon */}
      <span
        className={`text-sm sm:text-base transition-all duration-300 ${isActive ? "scale-110" : "scale-100 opacity-50 grayscale"}`}
      >
        {config.icon}
      </span>

      {/* Label */}
      <span
        className={`text-[0.6rem] sm:text-[0.7rem] tracking-wider uppercase transition-all duration-300 ${isActive ? "font-black" : "font-bold opacity-50"}`}
        style={{ color: isActive ? config.color : dynamicTheme.palette.onSurfaceVariant }}
      >
        {config.label}
      </span>

      {/* Active checkmark badge */}
      {isActive && (
        <span
          className="ml-auto w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[0.5rem] font-black text-white transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
            boxShadow: `0 2px 8px -1px ${config.color}60`,
          }}
        >
          ✓
        </span>
      )}
    </button>
  );
}

// ── Active Tags Badge Strip ──
function ActiveTagsBadges({ tags, palette }: { tags: RangeTag[]; palette: DynamicTheme["palette"] }) {
  if (tags.length === 0) return null;

  const activeTags = TAG_CONFIGS.filter((tc) => tags.includes(tc.id));

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
      {activeTags.map((tc) => (
        <span
          key={tc.id}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.45rem] sm:text-[0.5rem] font-black tracking-widest uppercase border"
          style={{
            backgroundColor: `${tc.color}12`,
            color: tc.color,
            borderColor: `${tc.color}30`,
          }}
        >
          <span className="text-[0.55rem]">{tc.icon}</span>
          {tc.label}
        </span>
      ))}
    </div>
  );
}

/**
 * SelectionIntel — Back face of the SmartPanel flip card.
 *
 * Premium features:
 *   - Gradient-filled donut ring
 *   - Hover-lift metric cards
 *   - Shimmer-trail stat bars
 *   - Interactive tag system replacing Productivity Ratio
 *   - Focus-glow textarea
 *   - Accent line decorations
 */
export default function SelectionIntel({
  selectionStats,
  dynamicTheme,
  rangeNote,
  onRangeNoteChange,
  rangeTags,
  onToggleTag,
}: SelectionIntelProps) {
  const p = dynamicTheme.palette;

  return (
    <div
      className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col rounded-2xl p-3.5 sm:p-5 border overflow-y-auto no-scrollbar"
      style={{
        backgroundColor: p.surface,
        borderColor: p.outlineVariant,
        boxShadow: `0 2px 16px -4px ${p.primary}18`,
      }}
    >
      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-3 sm:mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight" style={{ color: p.onSurface }}>
            Range Intel
          </h2>
          {selectionStats && (
            <p className="text-[0.65rem] sm:text-xs mt-0.5 font-semibold" style={{ color: p.onSurfaceVariant }}>
              {selectionStats.startLabel} → {selectionStats.endLabel}
            </p>
          )}
          {/* Gradient accent line */}
          <div
            className="h-[2px] w-8 mt-1 rounded-full transition-all duration-1000"
            style={{
              background: `linear-gradient(90deg, ${p.primary}, ${p.secondary})`,
              boxShadow: `0 0 6px ${p.primary}30`,
            }}
          />
          {/* Active tags badges below header */}
          {rangeTags.length > 0 && (
            <div className="mt-2">
              <ActiveTagsBadges tags={rangeTags} palette={p} />
            </div>
          )}
        </div>
        {/* M3 accent chip */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[0.5rem] sm:text-[0.6rem] font-black tracking-widest uppercase border"
          style={{
            backgroundColor: p.primaryContainer,
            color: p.onPrimaryContainer,
            borderColor: `${p.primary}20`,
          }}
        >
          <span
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
            style={{ backgroundColor: p.primary }}
          />
          Smart Analysis
        </div>
      </div>

      {/* ── Empty state ── */}
      {!selectionStats && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-40">
          <div className="relative">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={p.primary} strokeWidth="1.2" className="gentle-float">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
              <circle cx="8" cy="15" r="1" fill={p.primary} />
              <circle cx="12" cy="15" r="1" fill={p.primary} />
              <circle cx="16" cy="15" r="1" fill={p.primary} />
            </svg>
            {/* Ambient glow behind icon */}
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-20"
              style={{ backgroundColor: p.primary }}
            />
          </div>
          <p className="text-xs font-bold text-center leading-relaxed" style={{ color: p.onSurfaceVariant }}>
            Select a date range<br/>to see analytics
          </p>
        </div>
      )}

      {selectionStats && (
        <div className="flex flex-col gap-2.5 sm:gap-3 flex-1">
          {/* ── Hero stat: total duration ── */}
          <div
            className="rounded-2xl p-3 sm:p-4 flex items-center justify-between border relative overflow-hidden"
            style={{ backgroundColor: p.primaryContainer, borderColor: p.outlineVariant }}
          >
            {/* Subtle background gradient sweep */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                background: `linear-gradient(135deg, ${p.primary} 0%, transparent 60%)`,
              }}
            />
            <div className="relative z-10">
              <p className="text-[0.55rem] sm:text-[0.6rem] font-black tracking-widest uppercase mb-0.5 sm:mb-1" style={{ color: p.onPrimaryContainer }}>
                Total Duration
              </p>
              <p className="text-3xl sm:text-4xl font-black leading-none tabular-nums" style={{ color: p.primary }}>
                {selectionStats.total}
                <span className="text-xs sm:text-sm font-bold ml-1" style={{ color: p.onPrimaryContainer }}>
                  {selectionStats.total === 1 ? "day" : "days"}
                </span>
              </p>
              {selectionStats.weeks > 0 && (
                <p className="text-[0.65rem] sm:text-xs mt-0.5 sm:mt-1 font-semibold" style={{ color: p.onPrimaryContainer }}>
                  ≈ {selectionStats.weeks} week{selectionStats.weeks > 1 ? "s" : ""}
                  {selectionStats.total % 7 > 0 ? ` + ${selectionStats.total % 7}d` : ""}
                </p>
              )}
            </div>
            {/* Donut ring with gradient stroke */}
            <svg width="56" height="56" viewBox="0 0 60 60" className="shrink-0 relative z-10">
              <defs>
                <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={p.primary} />
                  <stop offset="100%" stopColor={p.secondary} />
                </linearGradient>
              </defs>
              <circle cx="30" cy="30" r="24" fill="none" stroke={`${p.primary}15`} strokeWidth="6" />
              <circle
                cx="30" cy="30" r="24"
                fill="none"
                stroke="url(#donutGrad)"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 24 * (selectionStats.workRatio / 100)} ${2 * Math.PI * 24}`}
                strokeLinecap="round"
                transform="rotate(-90 30 30)"
                className="transition-all duration-700"
              />
              <text x="30" y="30" textAnchor="middle" dominantBaseline="central"
                fontSize="11" fontWeight="900" fill={p.primary}>
                {selectionStats.workRatio}%
              </text>
            </svg>
          </div>

          {/* ── Work / Weekend split ── */}
          <div className="flex gap-2 sm:gap-3">
            <MetricCard
              label="Work Days"
              value={selectionStats.work}
              accent={p.primary}
              secondaryAccent={p.secondary}
              bg={p.surfaceVariant}
              borderColor={p.outlineVariant}
              bar={selectionStats.workRatio}
            />
            <MetricCard
              label="Weekends"
              value={selectionStats.weekend}
              accent={p.secondary}
              secondaryAccent={p.primary}
              bg={p.surfaceVariant}
              borderColor={p.outlineVariant}
              bar={100 - selectionStats.workRatio}
            />
          </div>

          {/* ── Range Tags — Interactive tag grid replacing Productivity Ratio ── */}
          <div
            className="rounded-xl p-2.5 sm:p-3 border relative overflow-hidden"
            style={{ backgroundColor: p.surfaceVariant, borderColor: p.outlineVariant }}
          >
            {/* Subtle gradient background */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                background: `linear-gradient(135deg, ${p.primary} 0%, ${p.secondary} 100%)`,
              }}
            />
            <div className="relative z-10">
              <span className="text-[0.5rem] sm:text-[0.55rem] font-black tracking-[0.18em] uppercase block mb-2" style={{ color: p.onSurfaceVariant }}>
                Categorize Range
              </span>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {TAG_CONFIGS.map((tc) => (
                  <TagChip
                    key={tc.id}
                    config={tc}
                    isActive={rangeTags.includes(tc.id)}
                    onToggle={() => onToggleTag(tc.id)}
                    dynamicTheme={dynamicTheme}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Range-specific notes ── */}
          <div
            className="rounded-xl p-3 border flex flex-col gap-1.5 transition-all duration-300 focus-within:shadow-lg"
            style={{
              backgroundColor: p.surfaceVariant,
              borderColor: p.outlineVariant,
              boxShadow: `0 1px 4px -1px ${p.primary}08`,
            }}
          >
            <span
              className="text-[0.55rem] sm:text-[0.6rem] font-black tracking-widest uppercase"
              style={{ color: p.onSurfaceVariant }}
            >
              Notes for this range
            </span>
            <textarea
              value={rangeNote}
              onChange={(e) => onRangeNoteChange(e.target.value)}
              placeholder="Add notes for this date range..."
              className="resize-none outline-none bg-transparent text-[0.75rem] placeholder:opacity-35 no-scrollbar"
              style={{
                color: p.onSurface,
                fontFamily: "inherit",
                minHeight: "56px",
                lineHeight: "1.6",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
