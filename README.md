# Nelala Calendar

A premium interactive wall calendar built with **Next.js 16**, **React 19**, and **TypeScript**. Features dynamic color theming extracted from hero images, date range selection with analytics, and persistent notes — all wrapped in a cinematic glassmorphic UI.

## ✨ Features

- **Dynamic Color Theming** — Each month's hero image is analyzed via canvas to extract the dominant color. A full Material Design 3 palette is generated on-the-fly, ensuring every UI element harmonizes with the current photo.
- **Date Range Selection** — Two-click range picker with hover preview, animated endpoint circles, and a bridge fill between selected dates.
- **Range Intel Panel** — Flip-card that reveals work/weekend analytics, an animated donut chart, and breakdown stats for the selected range.
- **Tag System** — Categorize date ranges with Work, Vacation, Event, or Focus tags. Tags persist in localStorage and show as indicator dots on the calendar grid.
- **Monthly Notes** — Freeform textarea per month with auto-save. Range-specific notes are also supported.
- **Custom Image Overlay** — Upload a personal photo displayed over the hero section in one of five mask shapes (heart, hexagon, star, gum, rectangle), with configurable position and rotation animation.
- **Year Selector** — Glassmorphic overlay grid for fast year navigation (±5 years).
- **Swipe Navigation** — Swipe left/right on the hero image to change months on touch devices.
- **Animated Transitions** — Two-phase month transitions (slide-out → pop-in), staggered cell animations, aurora glow orbs, shimmer effects, and micro-interactions throughout.
- **Indian Holidays** — Preset holiday markers (Republic Day, Diwali, Holi, etc.) with sparkle dots and glassmorphic tooltips.

## 🏗 Architecture

### Technology Choices

| Choice | Rationale |
|--------|-----------|
| **Next.js 16 (App Router)** | Server Components for the page shell; only the interactive calendar ships to the client bundle. |
| **React 19** | Latest concurrent features, improved rendering performance. |
| **Tailwind CSS v4** | Utility-first styling with the new `@theme` directive for design tokens and CSS-first configuration. |
| **No external UI library** | Every component is hand-crafted for full design control — no Material UI, shadcn, or Radix dependency. |
| **localStorage persistence** | Zero-backend approach — notes, tags, and custom overlays persist locally without any API. |
| **Canvas color extraction** | Client-side image analysis avoids external color API calls. Saturation-weighted averaging produces vibrant, representative colors. |

### Component Hierarchy

```
page.tsx (Server Component — thin wrapper)
└── NelalaCalendar (Client Component — root orchestrator)
    ├── HeroSection — Hero image, month name, progress bar, navigation
    │   ├── YearSelector — Year fast-travel overlay
    │   └── CustomOverlay — User image overlay with shape masks
    ├── CalendarGrid — 7×6 date grid with selection states
    │   └── DateCell — Individual date cell with rich visual states
    └── SmartPanel — Flip-card container
        ├── MonthlyNotes (front) — Notes textarea + month stats
        └── SelectionIntel (back) — Range analytics + tag system
```

### State Management (Custom Hooks)

| Hook | Responsibility |
|------|---------------|
| `useCalendarNavigation` | Month/year state, animated transitions, year selector toggle |
| `useDateSelection` | Two-click range selection, hover preview, computed statistics |
| `useCalendarDays` | Memoized 42-cell grid computation |
| `useImageColorExtraction` | Canvas-based dominant color extraction → M3 palette generation |
| `useRangeNotes` | Notes and tags CRUD with localStorage sync |

### Theming Engine (`m3Theme.ts`)

A single hex color is transformed into a 17-property semantic palette inspired by Material Design 3:

- **Tonal generation** — HSL-based tone function with saturation clamping at extremes
- **WCAG contrast safety** — Iterative lightness adjustment ensures text passes 4.5:1 contrast against its background
- **Warm surfaces** — Surface colors carry a subtle hue tint from the source for visual cohesion

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Server Component entry point
│   ├── layout.tsx            # Root layout (font, metadata)
│   ├── globals.css           # Tailwind base + animation keyframes
│   └── components/calendar/
│       ├── NelalaCalendar.tsx # Root client component
│       ├── HeroSection.tsx   # Hero image + navigation
│       ├── CalendarGrid.tsx  # Date grid
│       ├── DateCell.tsx      # Individual date cell
│       ├── SmartPanel.tsx    # Flip-card container
│       ├── MonthlyNotes.tsx  # Monthly notes (front face)
│       ├── SelectionIntel.tsx# Range analytics (back face)
│       ├── YearSelector.tsx  # Year picker overlay
│       └── CustomOverlay.tsx # Custom image overlay
└── lib/
    ├── constants.ts          # Month data, holidays, animation timing
    ├── types.ts              # All TypeScript interfaces & types
    ├── utils.ts              # Pure utility functions (color, grid, selection)
    ├── m3Theme.ts            # M3 palette generator
    └── hooks/
        ├── useCalendarDays.ts
        ├── useCalendarNavigation.ts
        ├── useDateSelection.ts
        ├── useImageColorExtraction.ts
        └── useRangeNotes.ts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.18
- **pnpm** (recommended) or npm

### Install & Run

```bash
# Clone the repository
git clone <repo-url>
cd calender

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
pnpm build
pnpm start
```

## 📄 License

Private project — all rights reserved.
