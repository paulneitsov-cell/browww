import { useEffect, useMemo, useState } from "react";
import type { AppState } from "./types";
import { loadState, resetState, saveState } from "./storage";
import SetupPage from "./pages/SetupPage";
import PreferencesPage from "./pages/PreferencesPage";
import GeneratePage from "./pages/GeneratePage";
import SchedulePage from "./pages/SchedulePage";

type Tab = "setup" | "preferences" | "generate" | "schedule";

const TAB_LABELS: Record<Tab, string> = {
  setup: "Seadistus",
  preferences: "Eelistused",
  generate: "Genereeri graafik",
  schedule: "Graafik",
};

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [tab, setTab] = useState<Tab>("setup");
  const [activeScheduleId, setActiveScheduleId] = useState<string | null>(
    null
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  // If there's already a saved schedule, default to showing it.
  useEffect(() => {
    if (state.schedules.length > 0 && !activeScheduleId) {
      setActiveScheduleId(state.schedules[state.schedules.length - 1].id);
    }
  }, [state.schedules, activeScheduleId]);

  const activeSchedule = useMemo(
    () => state.schedules.find((s) => s.id === activeScheduleId) ?? null,
    [state.schedules, activeScheduleId]
  );

  const tabs: Tab[] = ["setup", "preferences", "generate", "schedule"];

  return (
    <div className="app">
      <header className="topbar">
        <h1>Salongi graafik</h1>
        <nav className="tabs">
          {tabs.map((t) => (
            <button
              key={t}
              className={t === tab ? "tab active" : "tab"}
              onClick={() => setTab(t)}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </nav>
        <div className="topbar-actions">
          <button
            className="btn-link"
            onClick={() => {
              if (
                confirm(
                  "Lähtesta kõik andmed näidisandmetele? Kogu sisestatud info kustutatakse."
                )
              ) {
                setState(resetState());
              }
            }}
          >
            Lähtesta
          </button>
        </div>
      </header>

      <main className="main">
        {tab === "setup" && <SetupPage state={state} setState={setState} />}
        {tab === "preferences" && (
          <PreferencesPage state={state} setState={setState} />
        )}
        {tab === "generate" && (
          <GeneratePage
            state={state}
            setState={setState}
            onGenerated={(id) => {
              setActiveScheduleId(id);
              setTab("schedule");
            }}
          />
        )}
        {tab === "schedule" && (
          <SchedulePage
            state={state}
            setState={setState}
            scheduleId={activeScheduleId}
            setScheduleId={setActiveScheduleId}
            schedule={activeSchedule}
          />
        )}
      </main>

      <footer className="footer">
        <span>Andmed salvestatakse selles brauseris (localStorage).</span>
      </footer>
    </div>
  );
}
