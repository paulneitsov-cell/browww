import { useState } from "react";
import type {
  AppState,
  Employee,
  MonthPreferences,
  Weekday,
} from "../types";
import { MONTH_NAMES_ET, WEEKDAY_NAMES_ET_SHORT } from "../types";
import {
  daysInMonth,
  monthKey,
  weekdayOf,
} from "../utils/date";

type Props = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
};

type Mode = "unavailable" | "preferredOff" | "preferredWork";

const MODE_LABEL: Record<Mode, string> = {
  unavailable: "Pole saadaval",
  preferredOff: "Eelistab vaba",
  preferredWork: "Eelistab tööd",
};

const MODE_COLOR: Record<Mode, string> = {
  unavailable: "#e23a3a",
  preferredOff: "#e8a93a",
  preferredWork: "#3aa55b",
};

export default function PreferencesPage({ state, setState }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [empId, setEmpId] = useState<string>(state.employees[0]?.id ?? "");
  const [mode, setMode] = useState<Mode>("unavailable");

  const employee = state.employees.find((e) => e.id === empId) ?? null;
  const mKey = monthKey(year, month);

  const prefs: MonthPreferences = employee?.monthlyPreferences[mKey] ?? {
    unavailableDays: [],
    preferredDaysOff: [],
    preferredWorkdays: [],
  };

  const updatePrefs = (next: MonthPreferences) => {
    if (!employee) return;
    setState((s) => ({
      ...s,
      employees: s.employees.map((e) =>
        e.id === employee.id
          ? {
              ...e,
              monthlyPreferences: { ...e.monthlyPreferences, [mKey]: next },
            }
          : e
      ),
    }));
  };

  const toggleDay = (day: number) => {
    if (!employee) return;
    const lists: Record<Mode, number[]> = {
      unavailable: [...prefs.unavailableDays],
      preferredOff: [...prefs.preferredDaysOff],
      preferredWork: [...prefs.preferredWorkdays],
    };
    const arr = lists[mode];
    const idx = arr.indexOf(day);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(day);
    // A day shouldn't be both preferredOff and preferredWork; toggling one removes the other.
    if (mode === "preferredOff") {
      lists.preferredWork = lists.preferredWork.filter((d) => d !== day);
    }
    if (mode === "preferredWork") {
      lists.preferredOff = lists.preferredOff.filter((d) => d !== day);
    }
    updatePrefs({
      unavailableDays: lists.unavailable.sort((a, b) => a - b),
      preferredDaysOff: lists.preferredOff.sort((a, b) => a - b),
      preferredWorkdays: lists.preferredWork.sort((a, b) => a - b),
    });
  };

  return (
    <div className="page">
      <section className="card">
        <h2>Töötaja eelistused</h2>
        <div className="row">
          <label className="field">
            <span>Töötaja</span>
            <select value={empId} onChange={(e) => setEmpId(e.target.value)}>
              {state.employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Aasta</span>
            <input
              type="number"
              value={year}
              onChange={(e) =>
                setYear(parseInt(e.target.value || String(year), 10))
              }
              style={{ width: "5rem" }}
            />
          </label>
          <label className="field">
            <span>Kuu</span>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
            >
              {MONTH_NAMES_ET.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <div className="field">
            <span>Märkimise režiim</span>
            <div className="mode-row">
              {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
                <button
                  key={m}
                  className={"mode-btn" + (mode === m ? " active" : "")}
                  style={
                    mode === m
                      ? { background: MODE_COLOR[m], borderColor: MODE_COLOR[m] }
                      : { borderColor: MODE_COLOR[m], color: MODE_COLOR[m] }
                  }
                  onClick={() => setMode(m)}
                >
                  {MODE_LABEL[m]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {employee ? (
          <PreferenceCalendar
            year={year}
            month={month}
            prefs={prefs}
            employee={employee}
            onToggle={toggleDay}
          />
        ) : (
          <p>Lisa kõigepealt töötaja seadistuste lehel.</p>
        )}
      </section>
    </div>
  );
}

function PreferenceCalendar({
  year,
  month,
  prefs,
  employee,
  onToggle,
}: {
  year: number;
  month: number;
  prefs: MonthPreferences;
  employee: Employee;
  onToggle: (day: number) => void;
}) {
  const days = daysInMonth(year, month);
  // Build padding: start on Monday.
  const firstWd = weekdayOf(year, month, 1);
  // Shift so that Monday = 0, Sunday = 6.
  const pad = (firstWd + 6) % 7;

  const cells: (number | null)[] = [];
  for (let i = 0; i < pad; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const weekHeaders: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="calendar">
      {weekHeaders.map((w) => (
        <div key={w} className="cal-head">
          {WEEKDAY_NAMES_ET_SHORT[w]}
        </div>
      ))}
      {cells.map((d, i) => {
        if (d === null) return <div key={i} className="cal-cell empty" />;
        const status = dayStatus(prefs, d);
        const cls = ["cal-cell", status ?? ""].filter(Boolean).join(" ");
        return (
          <button key={i} className={cls} onClick={() => onToggle(d)}>
            <span className="cal-num">{d}</span>
            {status === "unavailable" && <span className="dot">⛔</span>}
            {status === "preferredOff" && <span className="dot">○</span>}
            {status === "preferredWork" && <span className="dot">✓</span>}
          </button>
        );
      })}
      <div className="cal-legend">
        <span>{employee.name}</span>
      </div>
    </div>
  );
}

function dayStatus(prefs: MonthPreferences, d: number): Mode | null {
  if (prefs.unavailableDays.includes(d)) return "unavailable";
  if (prefs.preferredDaysOff.includes(d)) return "preferredOff";
  if (prefs.preferredWorkdays.includes(d)) return "preferredWork";
  return null;
}
