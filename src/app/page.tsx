/**
 * @fileoverview Nelala Calendar — Page Entry Point
 *
 * This is a Server Component that serves as the thin wrapper
 * for the NelalaCalendar client component. Keeping the page
 * as a Server Component means only the interactive calendar
 * code is shipped to the client bundle.
 *
 * The actual calendar logic lives entirely in NelalaCalendar
 * (marked with 'use client') and its child components.
 */

import NelalaCalendar from "./components/calendar/NelalaCalendar";

export default function Home() {
  return <NelalaCalendar />;
}
