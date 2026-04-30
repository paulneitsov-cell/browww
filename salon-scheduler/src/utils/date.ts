import type { Weekday } from "../types";

export function pad2(n: number): string {
  return n < 10 ? "0" + n : "" + n;
}

export function ymd(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function monthKey(year: number, month: number): string {
  return `${year}-${pad2(month)}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function weekdayOf(year: number, month: number, day: number): Weekday {
  return new Date(year, month - 1, day).getDay() as Weekday;
}

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(m: number): string {
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${pad2(hh)}:${pad2(mm)}`;
}

export function shiftHours(start: string, end: string): number {
  return (timeToMinutes(end) - timeToMinutes(start)) / 60;
}

export function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): boolean {
  return aStart < bEnd && bStart < aEnd;
}
