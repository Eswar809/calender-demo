/**
 * @fileoverview M3ThemeEngine — Material Design 3 Tonal Palette Generator
 *
 * Generates a full semantic color system from a single source color,
 * inspired by the Material Design 3 color system.
 *
 * PREMIUM EDITION — Tuned for maximum visual impact:
 *   - Ultra-vibrant primary tones with boosted chroma
 *   - High-contrast containers that are clearly visible
 *   - Rich secondary palette with wider hue shift
 *   - Warm-tinted surfaces with delicate color infusion
 */

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────

export interface M3Palette {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  surface: string;
  surfaceVariant: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  tint10: string;
  tint20: string;
  tint40: string;
  source: string;
}

// ─────────────────────────────────────────────────────────
// COLOR SPACE UTILITIES
// ─────────────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "").slice(0, 6);
  return {
    r: parseInt(clean.slice(0, 2), 16) || 0,
    g: parseInt(clean.slice(2, 4), 16) || 0,
    b: parseInt(clean.slice(4, 6), 16) || 0,
  };
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, color)))
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// ─────────────────────────────────────────────────────────
// WCAG CONTRAST UTILITIES
// ─────────────────────────────────────────────────────────

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ─────────────────────────────────────────────────────────
// TONAL GENERATION
// ─────────────────────────────────────────────────────────

function tone(h: number, s: number, lightness: number): string {
  // Keep more saturation at mid-tones for vibrant containers
  let clampedS = s;
  if (lightness < 10 || lightness > 92) {
    clampedS = Math.min(s, 25);
  } else if (lightness > 80) {
    // Keep decent saturation for container backgrounds — this is key for visibility
    clampedS = Math.min(s, Math.max(40, s * 0.6));
  }
  return hslToHex(h, clampedS, lightness);
}

function contrastSafeTone(
  h: number,
  s: number,
  initialL: number,
  bgHex: string,
  minRatio: number = 4.5
): string {
  let l = initialL;
  const bgLum = relativeLuminance(bgHex);
  const direction = bgLum > 0.5 ? -1 : 1;

  for (let i = 0; i < 30; i++) {
    const candidate = tone(h, s, l);
    if (contrastRatio(candidate, bgHex) >= minRatio) return candidate;
    l += direction * 2;
    l = Math.max(0, Math.min(100, l));
  }
  return tone(h, s, l);
}

// ─────────────────────────────────────────────────────────
// MAIN PALETTE GENERATOR — PREMIUM EDITION
// ─────────────────────────────────────────────────────────

export function generateM3Palette(sourceHex: string): M3Palette {
  const { r, g, b } = hexToRgb(sourceHex);
  const [h, s] = rgbToHsl(r, g, b);

  // Ultra-vibrant: Aggressively boost chroma for maximum visual pop
  const boostedS = Math.min(s + 45, 100);

  // Wider hue shift for secondary (+40°) — more visual contrast
  const secH = (h + 40) % 360;
  const secS = Math.max(Math.floor(boostedS * 0.6), 30);

  // ── Surface colors — slight warm tint from source hue ──
  const surface = tone(h, 8, 99);
  const surfaceVariant = tone(h, 14, 94);

  // ── CRITICAL: Container colors with VISIBLE saturation ──
  // Previous issue: containers were too close to surface (nearly white)
  // Fix: Keep saturation higher (min 35%) and lightness at 85-88% for clear visibility
  const containerS = Math.max(boostedS * 0.7, 35);
  const primaryContainer = tone(h, containerS, 86);
  const secondaryContainer = tone(secH, Math.max(secS * 0.5, 20), 88);

  // ── Primary with contrast awareness ──
  const primary = contrastSafeTone(h, boostedS, 34, surface, 3.0);

  return {
    source: sourceHex,

    // ── Primary roles — deep, vibrant ──
    primary,
    onPrimary: "#ffffff",
    primaryContainer,
    onPrimaryContainer: contrastSafeTone(h, boostedS, 14, primaryContainer, 4.5),

    // ── Secondary roles — hue-shifted for visual depth ──
    secondary: contrastSafeTone(secH, secS, 38, surface, 3.0),
    onSecondary: "#ffffff",
    secondaryContainer,
    onSecondaryContainer: contrastSafeTone(secH, secS, 14, secondaryContainer, 4.5),

    // ── Surface roles — warm-tinted neutrals ──
    surface,
    surfaceVariant,
    onSurface: contrastSafeTone(h, 10, 10, surface, 7.0),
    onSurfaceVariant: contrastSafeTone(h, 10, 32, surface, 4.5),

    // ── Outline roles ──
    outline: tone(h, 12, 48),
    outlineVariant: tone(h, 18, 78),

    // ── Raw tints — richer color infusion ──
    tint10: tone(h, boostedS * 0.4, 96),
    tint20: tone(h, boostedS * 0.55, 91),
    tint40: tone(h, boostedS * 0.65, 75),
  };
}
