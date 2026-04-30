import type { AppState } from "./types";
import { defaultAppState } from "./sampleData";

const STORAGE_KEY = "salon-scheduler-state-v1";

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAppState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    // Soft migration: ensure required top-level keys exist.
    return {
      salons: parsed.salons ?? [],
      employees: parsed.employees ?? [],
      schedules: parsed.schedules ?? [],
      blockMinutes: parsed.blockMinutes ?? 60,
    };
  } catch (e) {
    console.warn("Failed to load state, falling back to defaults", e);
    return defaultAppState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
}

export function resetState(): AppState {
  const fresh = defaultAppState();
  saveState(fresh);
  return fresh;
}

export function uid(prefix = ""): string {
  return prefix + Math.random().toString(36).slice(2, 10);
}
