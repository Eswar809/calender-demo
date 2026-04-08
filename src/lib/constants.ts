import type { MonthData, HolidayMap } from "./types";

export const MONTHS_DATA: readonly MonthData[] = Object.freeze([
  {
    name: "JANUARY",
    sub: "New Beginnings",
    img: "/months/january.png",
    color: "#3b82f6",
    lightColor: "#eff6ff",
  },
  {
    name: "FEBRUARY",
    sub: "Season of Love",
    img: "/months/february.png",
    color: "#00ffb7ff",
    lightColor: "#fe34a3ff",
  },
  {
    name: "MARCH",
    sub: "Spring Awakens",
    img: "/months/march.png",
    color: "#10b981",
    lightColor: "#ecfdf5",
  },
  {
    name: "APRIL",
    sub: "Blossom & Bloom",
    img: "/months/april.png",
    color: "#8b5cf6",
    lightColor: "#f5f3ff",
  },
  {
    name: "MAY",
    sub: "Golden Sunshine",
    img: "/months/may.png",
    color: "#f59e0b",
    lightColor: "#fffbeb",
  },
  {
    name: "JUNE",
    sub: "Summer Solstice",
    img: "/months/june.png",
    color: "#06b6d4",
    lightColor: "#ecfeff",
  },
  {
    name: "JULY",
    sub: "Midsummer Dreams",
    img: "/months/july.png",
    color: "#f97316",
    lightColor: "#fff7ed",
  },
  {
    name: "AUGUST",
    sub: "Harvest Moon",
    img: "/months/aug.png",
    color: "#84cc16",
    lightColor: "#f7fee7",
  },
  {
    name: "SEPTEMBER",
    sub: "Autumn's Canvas",
    img: "/months/sep.png",
    color: "#d97706",
    lightColor: "#fffbeb",
  },
  {
    name: "OCTOBER",
    sub: "Spooky Season",
    img: "/months/oct.png",
    color: "#8b5cf6",
    lightColor: "#f5f3ff",
  },
  {
    name: "NOVEMBER",
    sub: "Cozy Moments",
    img: "/months/nov.png",
    color: "#e11d48",
    lightColor: "#fff1f2",
  },
  {
    name: "DECEMBER",
    sub: "Winter Wonderland",
    img: "/months/dec.png",
    color: "#f43f5e",
    lightColor: "#fff1f2",
  },
]);

export const DAYS_OF_WEEK: readonly string[] = Object.freeze([
  "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN",
]);

export const HOLIDAYS: HolidayMap = Object.freeze({
  "0-1": "New Year's Day",
  "0-14": "Makar Sankranti",
  "0-26": "Republic Day",
  "1-14": "Valentine's Day",
  "2-8": "Maha Shivaratri",
  "2-25": "Holi",
  "3-9": "Ugadi",
  "4-1": "May Day",
  "7-15": "Independence Day",
  "8-5": "Teacher's Day",
  "9-2": "Gandhi Jayanti",
  "9-31": "Halloween",
  "10-1": "Diwali",
  "11-25": "Christmas",
  "11-31": "New Year's Eve",
});

export const SLIDE_DURATION_MS = 250;
export const POP_IN_DURATION_MS = 500;
export const STAGGER_DELAY_MS = 20;
