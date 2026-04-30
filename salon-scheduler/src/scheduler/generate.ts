import type {
  AppState,
  Employee,
  Salon,
  Schedule,
  ScheduleWarning,
  Shift,
  TimeOfDayPreference,
  Weekday,
} from "../types";
import { uid } from "../storage";
import {
  daysInMonth,
  minutesToTime,
  monthKey,
  shiftHours,
  timeToMinutes,
  weekdayOf,
  ymd,
} from "../utils/date";

// ---------- Public API ----------

export interface GenerateOptions {
  year: number;
  month: number; // 1-12
  attempts?: number; // default 25
}

export interface GenerateResult {
  schedule: Schedule;
  score: number;
}

export function generateSchedule(
  state: AppState,
  opts: GenerateOptions
): GenerateResult {
  const attempts = opts.attempts ?? 25;
  let best: GenerateResult | null = null;
  for (let i = 0; i < attempts; i++) {
    const result = runAttempt(state, opts, i);
    if (!best || result.score > best.score) best = result;
  }
  return best!;
}

// ---------- Internal types ----------

interface DayPlan {
  salonId: string;
  year: number;
  month: number;
  day: number; // 1-31
  weekday: Weekday;
  openMin: number; // minutes-of-day
  closeMin: number;
  /** Demand by hour-of-day index (length = (closeMin-openMin)/60). */
  demand: number[];
  /** Hours (0-23) that ended up uncovered. */
  uncovered: number[];
}

interface Candidate {
  empId: string;
  salonId: string;
  date: string;
  startMin: number;
  endMin: number;
  hours: number;
  score: number;
}

// ---------- Attempt loop ----------

function runAttempt(
  state: AppState,
  opts: GenerateOptions,
  seed: number
): GenerateResult {
  const { year, month } = opts;
  const mKey = monthKey(year, month);

  const dayPlans = buildDayPlans(state.salons, year, month);

  const empHours = new Map<string, number>();
  const empShiftsByDate = new Map<string, Map<string, Shift[]>>();
  for (const e of state.employees) {
    empHours.set(e.id, 0);
    empShiftsByDate.set(e.id, new Map());
  }

  const allShifts: Shift[] = [];
  const warnings: ScheduleWarning[] = [];

  // Visit (salon, day) plans in a shuffled order so multi-restart explores different solutions.
  const planOrder = shuffle([...dayPlans.values()], seed);

  for (const plan of planOrder) {
    let safety = 100;
    while (safety-- > 0) {
      const need = findUncoveredRange(plan);
      if (!need) break;
      const [needStartH, needEndH] = need;

      const candidates: Candidate[] = [];
      for (const emp of state.employees) {
        const cand = buildBestCandidateForEmployee(
          emp,
          plan,
          needStartH,
          needEndH,
          empHours,
          empShiftsByDate,
          mKey
        );
        if (cand) candidates.push(cand);
      }

      if (candidates.length === 0) {
        // Cannot cover; mark this hour uncovered and decrement demand so loop progresses.
        for (let h = needStartH; h < needEndH; h++) {
          plan.uncovered.push(h);
          const idx = h - plan.openMin / 60;
          if (idx >= 0 && idx < plan.demand.length) plan.demand[idx]--;
        }
        continue;
      }

      candidates.sort((a, b) => b.score - a.score);
      const chosen = candidates[0];
      const shift: Shift = {
        id: uid("sh-"),
        employeeId: chosen.empId,
        salonId: chosen.salonId,
        date: chosen.date,
        start: minutesToTime(chosen.startMin),
        end: minutesToTime(chosen.endMin),
      };
      allShifts.push(shift);
      empHours.set(
        chosen.empId,
        (empHours.get(chosen.empId) ?? 0) + chosen.hours
      );
      const byDate = empShiftsByDate.get(chosen.empId)!;
      const list = byDate.get(chosen.date) ?? [];
      list.push(shift);
      byDate.set(chosen.date, list);

      // Decrement demand on covered hours.
      const startH = chosen.startMin / 60;
      const endH = chosen.endMin / 60;
      for (let h = startH; h < endH; h++) {
        const idx = h - plan.openMin / 60;
        if (idx >= 0 && idx < plan.demand.length && plan.demand[idx] > 0) {
          plan.demand[idx]--;
        }
      }
    }
  }

  // Build warnings.
  for (const plan of dayPlans.values()) {
    if (plan.uncovered.length > 0) {
      const dateStr = ymd(plan.year, plan.month, plan.day);
      const salonName =
        state.salons.find((s) => s.id === plan.salonId)?.name ?? plan.salonId;
      const hours = [...new Set(plan.uncovered)]
        .sort((a, b) => a - b)
        .map((h) => `${pad(h)}:00`)
        .join(", ");
      warnings.push({
        level: "error",
        message: `Katmata tunnid: ${salonName}, ${dateStr} (${hours})`,
      });
    }
  }
  for (const e of state.employees) {
    const h = empHours.get(e.id) ?? 0;
    if (h < e.monthlyMinHours) {
      warnings.push({
        level: "warning",
        message: `${e.name}: alla minimaalsete tundide (${h}h < ${e.monthlyMinHours}h)`,
      });
    }
    if (h > e.monthlyMaxHours) {
      warnings.push({
        level: "error",
        message: `${e.name}: üle maksimaalsete tundide (${h}h > ${e.monthlyMaxHours}h)`,
      });
    }
    const consec = maxConsecutiveDays(empShiftsByDate.get(e.id)!);
    if (consec > 5) {
      warnings.push({
        level: "warning",
        message: `${e.name}: ${consec} järjestikust tööpäeva`,
      });
    }
  }

  const score = scoreSchedule(state, dayPlans, empHours, empShiftsByDate);

  const schedule: Schedule = {
    id: uid("sch-"),
    year,
    month,
    shifts: allShifts,
    generatedAt: new Date().toISOString(),
    warnings,
  };
  return { schedule, score };
}

// ---------- Day plan builder ----------

function buildDayPlans(
  salons: Salon[],
  year: number,
  month: number
): Map<string, DayPlan> {
  const days = daysInMonth(year, month);
  const out = new Map<string, DayPlan>();
  for (const salon of salons) {
    for (let d = 1; d <= days; d++) {
      const wd = weekdayOf(year, month, d);
      const oh = salon.openingHours[wd];
      if (!oh) continue;
      const openMin = timeToMinutes(oh.open);
      const closeMin = timeToMinutes(oh.close);
      if (closeMin <= openMin) continue;
      const blockCount = Math.round((closeMin - openMin) / 60);
      const cov = salon.requiredCoverage[wd];
      const def = cov?.defaultCount ?? 1;
      const demand: number[] = new Array(blockCount).fill(def);
      if (cov?.hourly) {
        for (const o of cov.hourly) {
          const idx = o.hour - openMin / 60;
          if (idx >= 0 && idx < blockCount) demand[idx] = o.count;
        }
      }
      const key = `${salon.id}|${ymd(year, month, d)}`;
      out.set(key, {
        salonId: salon.id,
        year,
        month,
        day: d,
        weekday: wd,
        openMin,
        closeMin,
        demand,
        uncovered: [],
      });
    }
  }
  return out;
}

function findUncoveredRange(plan: DayPlan): [number, number] | null {
  const baseHour = plan.openMin / 60;
  let start = -1;
  for (let i = 0; i < plan.demand.length; i++) {
    if (plan.demand[i] > 0) {
      if (start < 0) start = i;
    } else if (start >= 0) {
      return [baseHour + start, baseHour + i];
    }
  }
  if (start >= 0) return [baseHour + start, baseHour + plan.demand.length];
  return null;
}

// ---------- Candidate building ----------

function buildBestCandidateForEmployee(
  emp: Employee,
  plan: DayPlan,
  needStartH: number,
  needEndH: number,
  empHours: Map<string, number>,
  empShiftsByDate: Map<string, Map<string, Shift[]>>,
  mKey: string
): Candidate | null {
  // Hard constraint: salon allowed
  if (!emp.allowedSalons.includes(plan.salonId)) return null;

  // Hard constraint: not Saturday if can't
  if (plan.weekday === 6 && !emp.canWorkSaturdays) return null;

  const date = ymd(plan.year, plan.month, plan.day);
  const day = plan.day;

  // Hard constraint: unavailable days
  const prefs = emp.monthlyPreferences[mKey];
  if (prefs?.unavailableDays.includes(day)) return null;

  // Hard constraint: not already in another salon at overlapping time today.
  const existingToday = empShiftsByDate.get(emp.id)?.get(date) ?? [];

  // Hard constraint: max monthly hours
  const currentHours = empHours.get(emp.id) ?? 0;
  if (currentHours >= emp.monthlyMaxHours) return null;

  // Try candidate shift lengths around the needed range. Length 4..10, step 1h.
  // Start aligned at hour boundary, must fit in opening hours.
  const openH = plan.openMin / 60;
  const closeH = plan.closeMin / 60;
  const minLen = 4;
  const maxLen = 10;

  let best: Candidate | null = null;

  for (let len = minLen; len <= maxLen; len++) {
    if (currentHours + len > emp.monthlyMaxHours) continue;

    // Candidate must include at least one needed hour.
    const earliestStart = Math.max(openH, needEndH - len);
    const latestStart = Math.min(closeH - len, needStartH);
    if (latestStart < earliestStart) continue;

    for (let s = earliestStart; s <= latestStart; s++) {
      const e = s + len;
      const startMin = s * 60;
      const endMin = e * 60;

      // Check overlap with existing shifts today.
      const overlap = existingToday.some(
        (sh) =>
          timeToMinutes(sh.start) < endMin &&
          timeToMinutes(sh.end) > startMin
      );
      if (overlap) continue;

      const score = scoreCandidate(
        emp,
        plan,
        startMin,
        endMin,
        currentHours,
        empShiftsByDate,
        mKey
      );

      if (!best || score > best.score) {
        best = {
          empId: emp.id,
          salonId: plan.salonId,
          date,
          startMin,
          endMin,
          hours: len,
          score,
        };
      }
    }
  }
  return best;
}

// ---------- Scoring ----------

function scoreCandidate(
  emp: Employee,
  plan: DayPlan,
  startMin: number,
  endMin: number,
  currentHours: number,
  empShiftsByDate: Map<string, Map<string, Shift[]>>,
  mKey: string
): number {
  const len = (endMin - startMin) / 60;
  let score = 0;

  // Coverage: count how many demanded hours this shift will cover.
  const baseHour = plan.openMin / 60;
  const startH = startMin / 60;
  const endH = endMin / 60;
  let coverGain = 0;
  for (let h = startH; h < endH; h++) {
    const idx = h - baseHour;
    if (idx >= 0 && idx < plan.demand.length && plan.demand[idx] > 0) {
      coverGain++;
    }
  }
  score += coverGain * 10;

  // Preferred salon bonus.
  if (emp.preferredSalon && emp.preferredSalon === plan.salonId) {
    score += len * 2;
  } else if (emp.preferredSalon && emp.preferredSalon !== plan.salonId) {
    score -= len * 1;
  }

  // Time of day preference.
  score += timeOfDayBonus(emp.preferredTimeOfDay, startMin, endMin);

  // Per-month preferences.
  const prefs = emp.monthlyPreferences[mKey];
  if (prefs) {
    if (prefs.preferredDaysOff.includes(plan.day)) score -= 8;
    if (prefs.preferredWorkdays.includes(plan.day)) score += 6;
  }

  // Hour fairness: the closer to target the better.
  const projected = currentHours + len;
  const target = emp.monthlyTargetHours;
  const distAfter = Math.abs(projected - target);
  const distBefore = Math.abs(currentHours - target);
  // Reward shifts that move us toward the target; penalize moving away.
  score += (distBefore - distAfter) * 0.6;

  // Penalize going past max.
  if (projected > emp.monthlyMaxHours) score -= 50;
  // Reward filling toward minimum.
  if (currentHours < emp.monthlyMinHours) score += 4;

  // Short shift penalty (4h ok, but encourage 6-8h).
  if (len < 5) score -= 2;

  // Consecutive days check.
  const consec = consecutiveDaysIfAdded(
    empShiftsByDate.get(emp.id)!,
    plan.year,
    plan.month,
    plan.day
  );
  if (consec >= 6) score -= 12;
  if (consec >= 8) score -= 50;

  return score;
}

function scoreSchedule(
  state: AppState,
  dayPlans: Map<string, DayPlan>,
  empHours: Map<string, number>,
  empShiftsByDate: Map<string, Map<string, Shift[]>>
): number {
  let score = 0;
  // Heavily reward covered hours / penalize uncovered.
  for (const plan of dayPlans.values()) {
    score -= plan.uncovered.length * 100;
  }
  for (const e of state.employees) {
    const h = empHours.get(e.id) ?? 0;
    if (h < e.monthlyMinHours) score -= (e.monthlyMinHours - h) * 4;
    if (h > e.monthlyMaxHours) score -= (h - e.monthlyMaxHours) * 8;
    score -= Math.abs(h - e.monthlyTargetHours) * 0.5;
    const consec = maxConsecutiveDays(empShiftsByDate.get(e.id)!);
    if (consec > 5) score -= (consec - 5) * 5;
  }
  return score;
}

function timeOfDayBonus(
  pref: TimeOfDayPreference,
  startMin: number,
  endMin: number
): number {
  if (pref === "any") return 0;
  const mid = (startMin + endMin) / 2;
  const noon = 13 * 60;
  if (pref === "morning") return mid <= noon ? 3 : -3;
  if (pref === "evening") return mid >= noon ? 3 : -3;
  return 0;
}

// ---------- Date helpers for scheduler ----------

function consecutiveDaysIfAdded(
  byDate: Map<string, Shift[]>,
  year: number,
  month: number,
  day: number
): number {
  const has = (d: number) => {
    if (d < 1) return false;
    const days = daysInMonth(year, month);
    if (d > days) return false;
    const list = byDate.get(ymd(year, month, d));
    return !!list && list.length > 0;
  };
  let run = 1;
  for (let d = day - 1; has(d); d--) run++;
  for (let d = day + 1; has(d); d++) run++;
  return run;
}

function maxConsecutiveDays(byDate: Map<string, Shift[]>): number {
  if (byDate.size === 0) return 0;
  const dates = [...byDate.keys()].sort();
  let max = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + "T00:00:00");
    const cur = new Date(dates[i] + "T00:00:00");
    const diffDays = Math.round(
      (cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      run++;
      if (run > max) max = run;
    } else {
      run = 1;
    }
  }
  return max;
}

// ---------- Misc helpers ----------

function pad(n: number) {
  return n < 10 ? "0" + n : String(n);
}

/** Deterministic shuffle by seed for multi-restart reproducibility within a session. */
function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = (seed * 9301 + 49297) % 233280;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const r = Math.floor((s / 233280) * (i + 1));
    [a[i], a[r]] = [a[r], a[i]];
  }
  return a;
}

// ---------- Analysis helpers used by UI ----------

export function totalsByEmployee(
  schedule: Schedule
): Map<string, number> {
  const out = new Map<string, number>();
  for (const s of schedule.shifts) {
    out.set(s.employeeId, (out.get(s.employeeId) ?? 0) + shiftHours(s.start, s.end));
  }
  return out;
}
