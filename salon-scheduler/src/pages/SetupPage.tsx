import { useState } from "react";
import type {
  AppState,
  Employee,
  OpeningHours,
  Salon,
  TimeOfDayPreference,
  Weekday,
} from "../types";
import { WEEKDAY_NAMES_ET } from "../types";
import { uid } from "../storage";

type Props = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
};

const WEEKDAYS: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export default function SetupPage({ state, setState }: Props) {
  return (
    <div className="page">
      <section className="card">
        <h2>Salongid</h2>
        <SalonsEditor state={state} setState={setState} />
      </section>

      <section className="card">
        <h2>Töötajad</h2>
        <EmployeesEditor state={state} setState={setState} />
      </section>
    </div>
  );
}

// ---------- Salons ----------

function SalonsEditor({ state, setState }: Props) {
  const updateSalon = (id: string, patch: Partial<Salon>) => {
    setState((s) => ({
      ...s,
      salons: s.salons.map((sa) => (sa.id === id ? { ...sa, ...patch } : sa)),
    }));
  };
  const addSalon = () => {
    setState((s) => ({
      ...s,
      salons: [
        ...s.salons,
        {
          id: uid("sal-"),
          name: "Uus salong",
          address: "",
          openingHours: {
            1: { open: "10:00", close: "18:00" },
            2: { open: "10:00", close: "18:00" },
            3: { open: "10:00", close: "18:00" },
            4: { open: "10:00", close: "18:00" },
            5: { open: "10:00", close: "18:00" },
          },
          requiredCoverage: {
            1: { defaultCount: 1 },
            2: { defaultCount: 1 },
            3: { defaultCount: 1 },
            4: { defaultCount: 1 },
            5: { defaultCount: 1 },
          },
        },
      ],
    }));
  };
  const deleteSalon = (id: string) => {
    if (!confirm("Kustuta see salong?")) return;
    setState((s) => ({
      ...s,
      salons: s.salons.filter((sa) => sa.id !== id),
      employees: s.employees.map((e) => ({
        ...e,
        allowedSalons: e.allowedSalons.filter((aid) => aid !== id),
        preferredSalon: e.preferredSalon === id ? undefined : e.preferredSalon,
      })),
    }));
  };

  return (
    <div className="stack">
      {state.salons.map((salon) => (
        <div key={salon.id} className="subcard">
          <div className="row">
            <label className="field">
              <span>Nimi</span>
              <input
                value={salon.name}
                onChange={(e) => updateSalon(salon.id, { name: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Aadress</span>
              <input
                value={salon.address ?? ""}
                onChange={(e) =>
                  updateSalon(salon.id, { address: e.target.value })
                }
              />
            </label>
            <button
              className="btn-danger"
              onClick={() => deleteSalon(salon.id)}
            >
              Kustuta
            </button>
          </div>

          <h3 className="subhead">Lahtiolekuajad ja kaetus</h3>
          <table className="hours-table">
            <thead>
              <tr>
                <th>Päev</th>
                <th>Avatud</th>
                <th>Algus</th>
                <th>Lõpp</th>
                <th>Vajalik töötajaid</th>
              </tr>
            </thead>
            <tbody>
              {WEEKDAYS.map((wd) => {
                const oh = salon.openingHours[wd];
                const cov = salon.requiredCoverage[wd];
                const isOpen = !!oh;
                return (
                  <tr key={wd}>
                    <td>{WEEKDAY_NAMES_ET[wd]}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={isOpen}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const next = { ...salon.openingHours };
                          const nextCov = { ...salon.requiredCoverage };
                          if (checked) {
                            next[wd] = { open: "10:00", close: "18:00" };
                            nextCov[wd] = nextCov[wd] ?? { defaultCount: 1 };
                          } else {
                            delete next[wd];
                            delete nextCov[wd];
                          }
                          updateSalon(salon.id, {
                            openingHours: next,
                            requiredCoverage: nextCov,
                          });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        disabled={!isOpen}
                        value={oh?.open ?? ""}
                        onChange={(e) => {
                          const next = { ...salon.openingHours };
                          next[wd] = {
                            ...(oh as OpeningHours),
                            open: e.target.value,
                          };
                          updateSalon(salon.id, { openingHours: next });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        disabled={!isOpen}
                        value={oh?.close ?? ""}
                        onChange={(e) => {
                          const next = { ...salon.openingHours };
                          next[wd] = {
                            ...(oh as OpeningHours),
                            close: e.target.value,
                          };
                          updateSalon(salon.id, { openingHours: next });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        disabled={!isOpen}
                        value={cov?.defaultCount ?? 1}
                        onChange={(e) => {
                          const v = Math.max(
                            0,
                            parseInt(e.target.value || "0", 10)
                          );
                          const next = { ...salon.requiredCoverage };
                          next[wd] = { ...(cov ?? {}), defaultCount: v };
                          updateSalon(salon.id, { requiredCoverage: next });
                        }}
                        style={{ width: "5rem" }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      <button className="btn-primary" onClick={addSalon}>
        + Lisa salong
      </button>
    </div>
  );
}

// ---------- Employees ----------

function EmployeesEditor({ state, setState }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<Employee>) => {
    setState((s) => ({
      ...s,
      employees: s.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  };
  const add = () => {
    const id = uid("emp-");
    setState((s) => ({
      ...s,
      employees: [
        ...s.employees,
        {
          id,
          name: "Uus töötaja",
          allowedSalons: s.salons.map((sa) => sa.id),
          preferredSalon: s.salons[0]?.id,
          monthlyTargetHours: 160,
          monthlyMinHours: 140,
          monthlyMaxHours: 180,
          preferredTimeOfDay: "any",
          canWorkSaturdays: true,
          notes: "",
          monthlyPreferences: {},
        },
      ],
    }));
    setOpenId(id);
  };
  const remove = (id: string) => {
    if (!confirm("Kustuta töötaja?")) return;
    setState((s) => ({
      ...s,
      employees: s.employees.filter((e) => e.id !== id),
    }));
  };

  return (
    <div className="stack">
      <table className="employees-table">
        <thead>
          <tr>
            <th>Nimi</th>
            <th>Lubatud salongid</th>
            <th>Eelistatud</th>
            <th>Kuu sihttunnid</th>
            <th>Min</th>
            <th>Max</th>
            <th>Laupäevad</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {state.employees.map((emp) => (
            <tr key={emp.id}>
              <td>
                <input
                  value={emp.name}
                  onChange={(e) => update(emp.id, { name: e.target.value })}
                />
              </td>
              <td>
                <div className="checkbox-row">
                  {state.salons.map((s) => (
                    <label key={s.id} className="inline">
                      <input
                        type="checkbox"
                        checked={emp.allowedSalons.includes(s.id)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...emp.allowedSalons, s.id]
                            : emp.allowedSalons.filter((x) => x !== s.id);
                          update(emp.id, { allowedSalons: next });
                        }}
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
              </td>
              <td>
                <select
                  value={emp.preferredSalon ?? ""}
                  onChange={(e) =>
                    update(emp.id, {
                      preferredSalon: e.target.value || undefined,
                    })
                  }
                >
                  <option value="">—</option>
                  {state.salons.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  value={emp.monthlyTargetHours}
                  onChange={(e) =>
                    update(emp.id, {
                      monthlyTargetHours: parseInt(e.target.value || "0", 10),
                    })
                  }
                  style={{ width: "5rem" }}
                />
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  value={emp.monthlyMinHours}
                  onChange={(e) =>
                    update(emp.id, {
                      monthlyMinHours: parseInt(e.target.value || "0", 10),
                    })
                  }
                  style={{ width: "4rem" }}
                />
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  value={emp.monthlyMaxHours}
                  onChange={(e) =>
                    update(emp.id, {
                      monthlyMaxHours: parseInt(e.target.value || "0", 10),
                    })
                  }
                  style={{ width: "4rem" }}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={emp.canWorkSaturdays}
                  onChange={(e) =>
                    update(emp.id, { canWorkSaturdays: e.target.checked })
                  }
                />
              </td>
              <td>
                <button
                  className="btn-link"
                  onClick={() =>
                    setOpenId(openId === emp.id ? null : emp.id)
                  }
                >
                  {openId === emp.id ? "Sulge" : "Detailid"}
                </button>
                <button
                  className="btn-link danger"
                  onClick={() => remove(emp.id)}
                >
                  Kustuta
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openId &&
        (() => {
          const emp = state.employees.find((e) => e.id === openId);
          if (!emp) return null;
          const setTod = (v: TimeOfDayPreference) =>
            update(emp.id, { preferredTimeOfDay: v });
          return (
            <div className="subcard">
              <h3 className="subhead">{emp.name} — detailid</h3>
              <div className="row">
                <label className="field">
                  <span>Eelistatud aeg</span>
                  <select
                    value={emp.preferredTimeOfDay}
                    onChange={(e) =>
                      setTod(e.target.value as TimeOfDayPreference)
                    }
                  >
                    <option value="any">Pole eelistust</option>
                    <option value="morning">Hommikupool</option>
                    <option value="evening">Õhtupool</option>
                  </select>
                </label>
                <label className="field grow">
                  <span>Märkused</span>
                  <input
                    value={emp.notes ?? ""}
                    onChange={(e) => update(emp.id, { notes: e.target.value })}
                  />
                </label>
              </div>
            </div>
          );
        })()}

      <button className="btn-primary" onClick={add}>
        + Lisa töötaja
      </button>
    </div>
  );
}
