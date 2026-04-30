import type { Employee, Salon, Schedule } from "../types";
import {
  WEEKDAY_NAMES_ET,
  type Weekday,
} from "../types";
import { shiftHours, weekdayOf } from "./date";

function escapeCsv(v: string): string {
  if (/[",\n;]/.test(v)) {
    return '"' + v.replace(/"/g, '""') + '"';
  }
  return v;
}

export function scheduleToCsv(
  schedule: Schedule,
  salons: Salon[],
  employees: Employee[]
): string {
  const salonName = (id: string) =>
    salons.find((s) => s.id === id)?.name ?? id;
  const empName = (id: string) =>
    employees.find((e) => e.id === id)?.name ?? id;

  const header = [
    "date",
    "weekday",
    "salon",
    "employee",
    "start_time",
    "end_time",
    "hours",
    "notes",
  ].join(",");

  const sorted = [...schedule.shifts].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    if (a.salonId !== b.salonId) return a.salonId.localeCompare(b.salonId);
    return a.start.localeCompare(b.start);
  });

  const rows = sorted.map((s) => {
    const [y, m, d] = s.date.split("-").map(Number);
    const wd = weekdayOf(y, m, d) as Weekday;
    const cols = [
      s.date,
      WEEKDAY_NAMES_ET[wd],
      salonName(s.salonId),
      empName(s.employeeId),
      s.start,
      s.end,
      shiftHours(s.start, s.end).toFixed(2),
      s.notes ?? "",
    ].map((c) => escapeCsv(String(c)));
    return cols.join(",");
  });

  return [header, ...rows].join("\n");
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
