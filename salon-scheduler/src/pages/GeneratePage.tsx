import { useState } from "react";
import type { AppState } from "../types";
import { MONTH_NAMES_ET } from "../types";
import { generateSchedule } from "../scheduler/generate";

type Props = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onGenerated: (scheduleId: string) => void;
};

export default function GeneratePage({ state, setState, onGenerated }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [attempts, setAttempts] = useState(25);
  const [busy, setBusy] = useState(false);
  const [lastWarnings, setLastWarnings] = useState<string[] | null>(null);

  const generate = () => {
    if (state.salons.length === 0 || state.employees.length === 0) {
      alert("Lisa kõigepealt salongid ja töötajad.");
      return;
    }
    setBusy(true);
    // Defer to next tick so the busy flag renders.
    setTimeout(() => {
      const result = generateSchedule(state, { year, month, attempts });
      // Replace any existing schedule for the same month, otherwise append.
      setState((s) => {
        const without = s.schedules.filter(
          (sc) => !(sc.year === year && sc.month === month)
        );
        return { ...s, schedules: [...without, result.schedule] };
      });
      setLastWarnings(result.schedule.warnings.map((w) => `[${w.level}] ${w.message}`));
      setBusy(false);
      onGenerated(result.schedule.id);
    }, 30);
  };

  return (
    <div className="page">
      <section className="card">
        <h2>Genereeri kuugraafik</h2>
        <div className="row">
          <label className="field">
            <span>Aasta</span>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value || "0", 10))}
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
          <label className="field">
            <span>Katsete arv</span>
            <input
              type="number"
              value={attempts}
              min={1}
              max={200}
              onChange={(e) =>
                setAttempts(parseInt(e.target.value || "1", 10))
              }
              style={{ width: "5rem" }}
            />
          </label>
          <button
            className="btn-primary"
            onClick={generate}
            disabled={busy}
          >
            {busy ? "Genereerin…" : "Genereeri graafik"}
          </button>
        </div>

        {lastWarnings !== null && (
          <div className="warnings">
            <h3>Tulemus</h3>
            {lastWarnings.length === 0 ? (
              <p className="ok">Graafik genereeritud edukalt, hoiatusi pole.</p>
            ) : (
              <ul>
                {lastWarnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <p className="hint">
          Algoritm proovib mitut juhuslikku varianti ja valib parima.
          Kui täiuslikku graafikut ei leita, näidatakse parim osaline lahendus
          ja allpool olevad hoiatused selgitavad, mis nõuded jäid täitmata.
        </p>
      </section>
    </div>
  );
}
