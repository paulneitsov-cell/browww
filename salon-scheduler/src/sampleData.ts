import type { AppState, Employee, Salon } from "./types";

function salonA(): Salon {
  return {
    id: "salon-a",
    name: "Salong A",
    address: "Tartu mnt 1, Tallinn",
    openingHours: {
      1: { open: "10:00", close: "20:00" },
      2: { open: "10:00", close: "20:00" },
      3: { open: "10:00", close: "20:00" },
      4: { open: "10:00", close: "20:00" },
      5: { open: "10:00", close: "20:00" },
      6: { open: "10:00", close: "18:00" },
    },
    requiredCoverage: {
      1: { defaultCount: 1 },
      2: { defaultCount: 1 },
      3: { defaultCount: 1 },
      4: { defaultCount: 1 },
      5: { defaultCount: 1 },
      6: { defaultCount: 1 },
    },
  };
}

function salonB(): Salon {
  return {
    id: "salon-b",
    name: "Salong B",
    address: "Pärnu mnt 10, Tallinn",
    openingHours: {
      1: { open: "09:00", close: "19:00" },
      2: { open: "09:00", close: "19:00" },
      3: { open: "09:00", close: "19:00" },
      4: { open: "09:00", close: "19:00" },
      5: { open: "09:00", close: "19:00" },
      6: { open: "10:00", close: "16:00" },
    },
    requiredCoverage: {
      1: { defaultCount: 1 },
      2: { defaultCount: 1 },
      3: { defaultCount: 1 },
      4: { defaultCount: 1 },
      5: { defaultCount: 1 },
      6: { defaultCount: 1 },
    },
  };
}

function sampleEmployees(): Employee[] {
  return [
    {
      id: "emp-1",
      name: "Anna Tamm",
      allowedSalons: ["salon-a", "salon-b"],
      preferredSalon: "salon-a",
      monthlyTargetHours: 160,
      monthlyMinHours: 140,
      monthlyMaxHours: 180,
      preferredTimeOfDay: "any",
      canWorkSaturdays: true,
      notes: "",
      monthlyPreferences: {},
    },
    {
      id: "emp-2",
      name: "Mari Kask",
      allowedSalons: ["salon-a"],
      preferredSalon: "salon-a",
      monthlyTargetHours: 120,
      monthlyMinHours: 100,
      monthlyMaxHours: 140,
      preferredTimeOfDay: "morning",
      canWorkSaturdays: false,
      notes: "Eelistab varahommikuid.",
      monthlyPreferences: {},
    },
    {
      id: "emp-3",
      name: "Liis Mets",
      allowedSalons: ["salon-b"],
      preferredSalon: "salon-b",
      monthlyTargetHours: 160,
      monthlyMinHours: 140,
      monthlyMaxHours: 180,
      preferredTimeOfDay: "evening",
      canWorkSaturdays: true,
      notes: "",
      monthlyPreferences: {},
    },
    {
      id: "emp-4",
      name: "Kristi Saar",
      allowedSalons: ["salon-a", "salon-b"],
      preferredSalon: "salon-b",
      monthlyTargetHours: 80,
      monthlyMinHours: 60,
      monthlyMaxHours: 100,
      preferredTimeOfDay: "any",
      canWorkSaturdays: true,
      notes: "Osalise koormusega.",
      monthlyPreferences: {},
    },
  ];
}

export function defaultAppState(): AppState {
  return {
    salons: [salonA(), salonB()],
    employees: sampleEmployees(),
    schedules: [],
    blockMinutes: 60,
  };
}
