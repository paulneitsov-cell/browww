import { useMemo, useState } from "react";
import type {
  AppState,
  Schedule,
  Shift,
  Weekday,
} from "../types";
import {
  MONTH_NAMES_ET,
  WEEKDAY_NAMES_ET_SHORT,
} from "../types";
import {
  daysInMonth,
  shiftHours,
  weekdayOf,
  ymd,
} from "../utils/date";
import { downloadCsv, scheduleToCsv } from "../utils/csv";

type Props = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  scheduleId: string | null;
  setScheduleId: (id: string | null) => void;
  schedule: Schedule | null;
};

type View = "calendar" | "byEmployee" | "bySalon";

const VIEW_LABEL: Record<View, string> = {
  calendar: "Kalender",
  byEmployee: "Töötaja vaade",
  bySalon: "Salongi vaade",
};

export default function SchedulePage({
  state,
  setState,
  scheduleId,
  setScheduleId,
  schedule,
}: Props) {
  const [view, setView] = useState<View>("calendar");

  if (state.schedules.length === 0) {
    return (
      <div className="page">
        <section className="card">
          <h2>Graafik puudub</h2>
          <p>Mine "Genereeri graafik" lehele ja loo uus kuugraafik.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="card">
        <div className="row between">
          <div className="row">
            <label className="field">
              <span>Salvestatud graafikud</span>
              <select
                value={scheduleId ?? ""}
                onChange={(e) => setScheduleId(e.target.value)}
              >
                {state.schedules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {MONTH_NAMES_ET[s.month - 1]} {s.year}
                  </option>
                ))}
              </select>
            </label>
            <div className="field">
              <span>Vaade</span>
              <div className="mode-row">
                {(Object.keys(VIEW_LABEL) as View[]).map((v) => (
                  <button
                    key={v}
                    className={"mode-btn" + (view === v ? " active" : "")}
                    onClick={() => setView(v)}
                  >
                    {VIEW_LABEL[v]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="row">
            {schedule && (
              <>
                <button
                  className="btn-primary"
                  onClick={() => {
                    const csv = scheduleToCsv(
                      schedule,
                      state.salons,
                      state.employees
                    );
                    downloadCsv(
                      `graafik-${schedule.year}-${String(schedule.month).padStart(
                        2,
                        "0"
                      )}.csv`,
                      csv
                    );
                  }}
                >
                  Ekspordi CSV
                </button>
                <button
                  className="btn-link danger"
                  onClick={() => {
                    if (!confirm("Kustuta see graafik?")) return;
                    setState((s) => ({
                      ...s,
                      schedules: s.schedules.filter(
                        (sc) => sc.id !== schedule.id
                      ),
                    }));
                    setScheduleId(null);
                  }}
                >
                  Kustuta graafik
                </button>
              </>
            )}
          </div>
        </div>

        {schedule && (
          <>
            {schedule.warnings.length > 0 && (
              <div className="warnings">
                <h3>Hoiatused</h3>
                <ul>
                  {schedule.warnings.map((w, i) => (
                    <li key={i} className={`warn-${w.level}`}>
                      {w.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <EmployeeTotals state={state} schedule={schedule} />
            {view === "calendar" && (
              <CalendarView state={state} schedule={schedule} />
            )}
            {view === "byEmployee" && (
              <ByEmployeeView state={state} schedule={schedule} />
            )}
            {view === "bySalon" && (
              <BySalonView state={state} schedule={schedule} />
            )}
          </>
        )}
      </section>
    </div>
  );
}

// ---------- Totals ----------

function EmployeeTotals({
  state,
  schedule,
}: {
  state: AppState;
  schedule: Schedule;
}) {
  const totals = useMemo(() => {
    const m = new Map<string, number>();
    for (const sh of schedule.shifts) {
      m.set(sh.employeeId, (m.get(sh.employeeId) ?? 0) + shiftHours(sh.start, sh.end));
    }
    return m;
  }, [schedule]);

  return (
    <div className="totals">
      <h3>Töötajate kogutunnid</h3>
      <table className="totals-table">
        <thead>
          <tr>
            <th>Töötaja</th>
            <th>Tunnid</th>
            <th>Sihttunnid</th>
            <th>Min</th>
            <th>Max</th>
            <th>Olek</th>
          </tr>
        </thead>
        <tbody>
          {state.employees.map((e) => {
            const h = totals.get(e.id) ?? 0;
            const status =
              h < e.monthlyMinHours
                ? { label: "Alla min", cls: "warn" }
                : h > e.monthlyMaxHours
                ? { label: "Üle max", cls: "err" }
                : Math.abs(h - e.monthlyTargetHours) <= 8
                ? { label: "OK", cls: "ok" }
                : { label: "Erineb sihist", cls: "warn" };
            return (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>{h.toFixed(1)}</td>
                <td>{e.monthlyTargetHours}</td>
                <td>{e.monthlyMinHours}</td>
                <td>{e.monthlyMaxHours}</td>
                <td className={status.cls}>{status.label}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ---------- Calendar view ----------

function CalendarView({
  state,
  schedule,
}: {
  state: AppState;
  schedule: Schedule;
}) {
  const days = daysInMonth(schedule.year, schedule.month);
  const firstWd = weekdayOf(schedule.year, schedule.month, 1);
  const pad = (firstWd + 6) % 7; // start Monday
  const cells: (number | null)[] = [];
  for (let i = 0; i < pad; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const byDate = useMemo(() => {
    const m = new Map<string, Shift[]>();
    for (const s of schedule.shifts) {
      const list = m.get(s.date) ?? [];
      list.push(s);
      m.set(s.date, list);
    }
    return m;
  }, [schedule]);

  const empName = (id: string) =>
    state.employees.find((e) => e.id === id)?.name ?? id;
  const salonName = (id: string) =>
    state.salons.find((s) => s.id === id)?.name ?? id;

  const weekHeaders: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="calendar big">
      {weekHeaders.map((w) => (
        <div key={w} className="cal-head">
          {WEEKDAY_NAMES_ET_SHORT[w]}
        </div>
      ))}
      {cells.map((d, i) => {
        if (d === null) return <div key={i} className="cal-cell empty" />;
        const dateStr = ymd(schedule.year, schedule.month, d);
        const shifts = (byDate.get(dateStr) ?? []).sort((a, b) =>
          a.start.localeCompare(b.start)
        );
        return (
          <div key={i} className="cal-cell day">
            <div className="cal-num">{d}</div>
            <div className="cal-shifts">
              {shifts.map((s) => (
                <div key={s.id} className="cal-shift" title={salonName(s.salonId)}>
                  <span className="time">
                    {s.start}–{s.end}
                  </span>
                  <span className="who">{empName(s.employeeId)}</span>
                  <span className="salon">{salonName(s.salonId)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Employee view ----------

function ByEmployeeView({
  state,
  schedule,
}: {
  state: AppState;
  schedule: Schedule;
}) {
  const days = daysInMonth(schedule.year, schedule.month);
  const salonName = (id: string) =>
    state.salons.find((s) => s.id === id)?.name ?? id;

  return (
    <div className="grid-table-wrap">
      <table className="grid-table">
        <thead>
          <tr>
            <th>Töötaja</th>
            {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
              const wd = weekdayOf(schedule.year, schedule.month, d);
              return (
                <th key={d} className={wd === 0 || wd === 6 ? "weekend" : ""}>
                  <div>{d}</div>
                  <small>{WEEKDAY_NAMES_ET_SHORT[wd as Weekday]}</small>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {state.employees.map((e) => (
            <tr key={e.id}>
              <td className="rowhead">{e.name}</td>
              {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
                const dateStr = ymd(schedule.year, schedule.month, d);
                const shifts = schedule.shifts.filter(
                  (s) => s.employeeId === e.id && s.date === dateStr
                );
                if (shifts.length === 0) return <td key={d} />;
                return (
                  <td key={d} className="cell-shift">
                    {shifts.map((s) => (
                      <div key={s.id} title={salonName(s.salonId)}>
                        {s.start}–{s.end}
                        <br />
                        <small>{salonName(s.salonId)}</small>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- Salon view ----------

function BySalonView({
  state,
  schedule,
}: {
  state: AppState;
  schedule: Schedule;
}) {
  const days = daysInMonth(schedule.year, schedule.month);
  const empName = (id: string) =>
    state.employees.find((e) => e.id === id)?.name ?? id;

  return (
    <div className="grid-table-wrap">
      {state.salons.map((salon) => (
        <div key={salon.id}>
          <h3 className="subhead">{salon.name}</h3>
          <table className="grid-table">
            <thead>
              <tr>
                <th>Päev</th>
                <th>Päev</th>
                <th>Vahetused</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
                const wd = weekdayOf(schedule.year, schedule.month, d);
                const dateStr = ymd(schedule.year, schedule.month, d);
                const shifts = schedule.shifts
                  .filter((s) => s.salonId === salon.id && s.date === dateStr)
                  .sort((a, b) => a.start.localeCompare(b.start));
                return (
                  <tr key={d} className={wd === 0 || wd === 6 ? "weekend" : ""}>
                    <td>{d}</td>
                    <td>{WEEKDAY_NAMES_ET_SHORT[wd as Weekday]}</td>
                    <td>
                      {shifts.length === 0
                        ? "—"
                        : shifts.map((s) => (
                            <div key={s.id}>
                              {s.start}–{s.end} {empName(s.employeeId)}
                            </div>
                          ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
