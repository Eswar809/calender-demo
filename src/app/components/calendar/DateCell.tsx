"use client";

import React from "react";
import type { CalendarDay, DynamicTheme, AnimationDirection, RangeTag } from "@/lib/types";
import { HOLIDAYS } from "@/lib/constants";
import { TAG_CONFIGS } from "@/lib/types";
import { getRangeBorderRadius } from "@/lib/utils";

interface DateCellProps {
  day: CalendarDay;
  index: number;
  monthIndex: number;
  dynamicTheme: DynamicTheme;
  animating: AnimationDirection;
  isStart: boolean;
  isEnd: boolean;
  isHoverEnd: boolean;
  isBetween: boolean;
  /** Whether this date belongs to a range with saved notes */
  hasNote: boolean;
  /** Tags associated with this date */
  dateTags: RangeTag[];
  onClick: (dateKey: number) => void;
  onMouseEnter: (dateKey: number) => void;
  onMouseLeave: () => void;
}

/**
 * DateCell — Premium date cell with rich visual states.
 *
 * Key visual improvements:
 *   - Endpoint circles with gradient fill + dramatic glow
 *   - Range bridge with visible, saturated container color
 *   - Hover: scale + ring + font weight boost
 *   - Today: glowing underline with pulse
 *   - Holiday: sparkle dot + glassmorphic tooltip
 */
export default function DateCell({
  day, index, monthIndex, dynamicTheme, animating,
  isStart, isEnd, isHoverEnd, isBetween, hasNote, dateTags,
  onClick, onMouseEnter, onMouseLeave,
}: DateCellProps) {
  const { val, type, weekend, isToday, hasEvent, dateKey } = day;
  const p = dynamicTheme.palette;

  const isSelected = isStart || isEnd || isBetween || isHoverEnd;
  const isEndpoint = isStart || isEnd || isHoverEnd;
  const holidayName = type === "curr" ? HOLIDAYS[`${monthIndex}-${val}`] : null;

  // Text color hierarchy
  let textColor = type === "curr" ? p.onSurface : `${p.onSurfaceVariant}40`;
  if (type === "curr" && weekend && !isSelected) textColor = p.primary;
  if (holidayName && type === "curr" && !isSelected) textColor = "#e67e22";
  if (isBetween) textColor = p.onPrimaryContainer;
  if (isEndpoint) textColor = p.onPrimary;

  const rangeClass = getRangeBorderRadius(isStart, isEnd, isHoverEnd);
  const animationDelay = `${(index % 7) * 18 + Math.floor(index / 7) * 22}ms`;

  // Tooltip edge-awareness
  const colIndex = index % 7;
  let ttAlign = "left-1/2 -translate-x-1/2";
  let ttArrow = "left-1/2 -translate-x-1/2";
  if (colIndex === 0) { ttAlign = "left-0"; ttArrow = "left-4"; }
  else if (colIndex === 6) { ttAlign = "right-0"; ttArrow = "right-4"; }

  return (
    <div
      className={`
        relative cursor-pointer h-9 sm:h-10 flex items-center justify-center group
        hover:z-50
        ${animating === "entering" || animating === "" ? "pop-in-wave" : ""}
      `}
      style={{ animationDelay }}
      onClick={() => onClick(dateKey)}
      onMouseEnter={() => onMouseEnter(dateKey)}
      onMouseLeave={onMouseLeave}
      role="gridcell"
      aria-label={`${val}${holidayName ? ` — ${holidayName}` : ""}`}
      aria-selected={isSelected}
    >
      {/* ── Range fill ── visible, saturated background */}
      {isSelected && !(isStart && isEnd) && (
        <div
          className={`absolute inset-y-0 z-0 transition-all duration-200 ease-out ${rangeClass}`}
          style={{
            left: isStart ? "50%" : "0",
            right: isEnd || isHoverEnd ? "50%" : "0",
            backgroundColor: p.primaryContainer,
            opacity: 0.85,
          }}
        />
      )}

      {/* ── Hover ring ── */}
      {!isSelected && type === "curr" && (
        <div
          className="absolute w-8 h-8 sm:w-9 sm:h-9 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-105 group-active:scale-90 transition-all duration-200 z-0"
          style={{ backgroundColor: p.surfaceVariant, boxShadow: `0 0 0 2px ${p.outlineVariant}` }}
        />
      )}

      {/* ── Endpoint circle ── gradient fill + dramatic glow */}
      <div
        className={`
          absolute w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center
          transition-all duration-200 z-10
          ${isEndpoint ? "scale-100" : "scale-95"}
        `}
        style={{
          background: isEndpoint
            ? `linear-gradient(135deg, ${p.primary}, ${p.secondary || p.primary})`
            : "transparent",
          boxShadow: isEndpoint
            ? `0 4px 16px -2px ${p.primary}80, 0 0 24px -4px ${p.primary}50, 0 0 0 2px ${p.primary}30`
            : "none",
        }}
      >
        {/* Date number */}
        <span
          className={`
            relative text-[0.8rem] sm:text-[0.9rem] z-20 transition-all duration-200 tabular-nums
            ${isEndpoint ? "font-black" : isSelected || (type === "curr" && (weekend || holidayName)) ? "font-bold" : "font-semibold"}
            ${!isSelected && type === "curr" ? "group-hover:font-bold" : ""}
          `}
          style={{ color: textColor }}
        >
          {val}
        </span>

        {/* Event dot */}
        {hasEvent && !isEndpoint && type === "curr" && !isToday && !holidayName && (
          <span className="absolute bottom-0.5 w-1 h-1 rounded-full opacity-50 transition-colors duration-1000" style={{ backgroundColor: p.primary }} />
        )}

        {/* Today: glowing underline */}
        {isToday && !isEndpoint && (
          <span
            className="absolute -bottom-0.5 sm:bottom-0 w-4 h-[2.5px] rounded-full today-pulse"
            style={{
              background: `linear-gradient(90deg, ${p.primary}, ${p.secondary || p.primary})`,
              boxShadow: `0 0 8px ${p.primary}80`,
            }}
          />
        )}

        {/* Holiday sparkle */}
        {holidayName && !isEndpoint && type === "curr" && (
          <span className="absolute top-0 right-0.5 sm:top-0.5 sm:right-1 w-1.5 h-1.5 rounded-full holiday-sparkle" style={{ backgroundColor: "#e67e22" }} />
        )}

        {/* Note indicator dot — gradient dot with breathe animation */}
        {hasNote && !isEndpoint && !holidayName && type === "curr" && (
          <span
            className="absolute -top-0.5 right-0 sm:top-0 sm:right-0.5 w-[5px] h-[5px] rounded-full note-breath z-30"
            style={{
              background: `linear-gradient(135deg, ${p.primary}, ${p.secondary || p.primary})`,
              boxShadow: `0 0 4px ${p.primary}60`,
            }}
          />
        )}
      </div>

      {/* ── Glassmorphic holiday tooltip ── */}
      {holidayName && type === "curr" && (
        <div className={`absolute bottom-[110%] ${ttAlign} mb-2 px-4 py-2 flex items-center gap-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-[60] transform translate-y-2 group-hover:translate-y-0 backdrop-blur-xl border ring-1 ring-black/5`}
          style={{
            background: `linear-gradient(135deg, ${p.primary}e8, ${p.secondary || p.primary}d0)`,
            color: p.onPrimary,
            borderColor: `${p.onPrimary}25`,
            boxShadow: `0 12px 30px -5px ${p.primary}60, 0 8px 12px -6px ${p.primary}40, 0 0 0 1px ${p.primary}30`
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse shadow-sm" style={{ backgroundColor: p.onPrimary }} />
          <span className="text-[0.65rem] font-black tracking-widest uppercase drop-shadow-sm">{holidayName}</span>
          <div className={`absolute top-full ${ttArrow} border-4 border-transparent`} style={{ borderTopColor: `${p.primary}e8` }} />
        </div>
      )}

      {/* ── Glassmorphic tags tooltip (bottom side) ── */}
      {dateTags && dateTags.length > 0 && type === "curr" && (
        <div
          className={`absolute top-[110%] ${ttAlign} mt-2 px-3.5 py-2.5 flex flex-col gap-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-[60] transform -translate-y-2 group-hover:translate-y-0`}
          style={{
            background: "rgba(248, 250, 252, 1)",
            backdropFilter: "blur(24px) saturate(200%) brightness(1.1)",
            WebkitBackdropFilter: "blur(24px) saturate(200%) brightness(1.1)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "0 4px 24px -2px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)",
          }}
        >
          {dateTags.map(tagId => {
            const config = TAG_CONFIGS.find(c => c.id === tagId);
            if (!config) return null;
            return (
              <div key={tagId} className="flex items-center gap-2 text-[0.62rem] font-black tracking-widest uppercase">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[0.6rem]"
                  style={{ backgroundColor: `${config.color}18` }}
                >
                  {config.icon}
                </span>
                <span style={{ color: config.color }}>{config.label}</span>
              </div>
            );
          })}
          {/* Arrow */}
          <div
            className={`absolute bottom-full ${ttArrow} border-[5px] border-transparent`}
            style={{ borderBottomColor: "rgba(248,250,252,0.96)" }}
          />
        </div>
      )}
    </div>
  );
}
