// ---------- Core data model ----------

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = pühapäev (Sunday)

export interface OpeningHours {
  open: string; // "HH:MM"
  close: string; // "HH:MM"
}

export interface CoverageRequirement {
  /** Default required headcount throughout opening hours. */
  defaultCount: number;
  /** Optional per-hour overrides. `hour` is the hour-of-day the block starts (0-23). */
  hourly?: { hour: number; count: number }[];
}

export interface Salon {
  id: string;
  name: string;
  address?: string;
  /** Opening hours per weekday. Missing entry = closed that day. */
  openingHours: Partial<Record<Weekday, OpeningHours>>;
  /** Required coverage per weekday. Missing entry inherits defaultCount = 1. */
  requiredCoverage: Partial<Record<Weekday, CoverageRequirement>>;
}

export type TimeOfDayPreference = "morning" | "evening" | "any";

export interface MonthPreferences {
  /** Days of month (1-31) when employee cannot work. */
  unavailableDays: number[];
  /** Days of month employee prefers off (soft). */
  preferredDaysOff: number[];
  /** Days of month employee prefers to work (soft). */
  preferredWorkdays: number[];
}

export interface Employee {
  id: string;
  name: string;
  /** Salon ids the employee is allowed to work in. */
  allowedSalons: string[];
  /** Preferred salon (soft). */
  preferredSalon?: string;
  /** Target hours per month (used for fairness). */
  monthlyTargetHours: number;
  monthlyMinHours: number;
  monthlyMaxHours: number;
  preferredTimeOfDay: TimeOfDayPreference;
  canWorkSaturdays: boolean;
  notes?: string;
  /** Per-month preferences keyed by "YYYY-MM". */
  monthlyPreferences: Record<string, MonthPreferences>;
}

export interface Shift {
  id: string;
  employeeId: string;
  salonId: string;
  date: string; // "YYYY-MM-DD"
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  notes?: string;
  /** True if user manually overrode shift length constraints. */
  manualOverride?: boolean;
}

export interface ScheduleWarning {
  level: "error" | "warning" | "info";
  message: string;
}

export interface Schedule {
  id: string;
  year: number;
  month: number; // 1-12
  shifts: Shift[];
  generatedAt: string; // ISO
  warnings: ScheduleWarning[];
}

export interface AppState {
  salons: Salon[];
  employees: Employee[];
  schedules: Schedule[];
  /** Time block size in minutes. Default 60. */
  blockMinutes: number;
}

// ---------- Helpers ----------

export const WEEKDAY_NAMES_ET: Record<Weekday, string> = {
  0: "Pühapäev",
  1: "Esmaspäev",
  2: "Teisipäev",
  3: "Kolmapäev",
  4: "Neljapäev",
  5: "Reede",
  6: "Laupäev",
};

export const WEEKDAY_NAMES_ET_SHORT: Record<Weekday, string> = {
  0: "P",
  1: "E",
  2: "T",
  3: "K",
  4: "N",
  5: "R",
  6: "L",
};

export const MONTH_NAMES_ET: string[] = [
  "Jaanuar",
  "Veebruar",
  "Märts",
  "Aprill",
  "Mai",
  "Juuni",
  "Juuli",
  "August",
  "September",
  "Oktoober",
  "November",
  "Detsember",
];
