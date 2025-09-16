// /lib/activity.ts
export type ActivityLogEntry = {
  id: string;                // unik
  timestamp: string;         // ISO time
  page: string;              // contoh: "/qea-calculator" atau "/jobs"
  action: string;            // contoh: "next_step", "submit_preferences"
  payload?: Record<string, any>; // data yang mau dicatat
};

const KEY = "fgcg_logs";

function readAll(): ActivityLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(rows: ActivityLogEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(rows));
}

export function appendLog(entry: Omit<ActivityLogEntry, "id" | "timestamp">) {
  const rows = readAll();
  rows.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  });
  writeAll(rows);
}

export function getLogs(): ActivityLogEntry[] {
  return readAll();
}

export function clearLogs() {
  writeAll([]);
}
