// /app/admin/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { jsonToCSV, downloadCSV } from "@/lib/csv";
import { getLogs, clearLogs, ActivityLogEntry } from "@/lib/activity";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  workLifeBalanceRating?: number;
  [key: string]: any;
};

export default function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load jobs & logs saat halaman admin dibuka
  useEffect(() => {
    Promise.resolve()
      .then(async () => {
        const res = await fetch("/data/jobs.json");
        const json = await res.json();
        // Support { jobs: [...] } atau langsung [...]
        const arr: Job[] = Array.isArray(json) ? json : json.jobs ?? [];
        setJobs(arr);
      })
      .finally(() => setLoading(false));

    // Log diambil dari localStorage
    setLogs(getLogs());
  }, []);

  const total = useMemo(
    () => ({ jobs: jobs.length, logs: logs.length }),
    [jobs, logs]
  );

  const onExportJobs = () => {
    const csv = jsonToCSV(jobs);
    downloadCSV("jobs.csv", csv);
  };

  const onExportLogs = () => {
    const csv = jsonToCSV(logs);
    downloadCSV("activity_logs.csv", csv);
  };

  const onRefreshLogs = () => {
    setLogs(getLogs());
  };

  const onClearLogs = () => {
    clearLogs();
    setLogs([]);
  };

  if (loading) return <div className="p-6">Memuat data…</div>;

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header + aksi ekspor */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin · Data & Log</h1>
        <div className="flex gap-3">
          <Button onClick={onExportJobs}>Export Jobs (CSV)</Button>
          <Button variant="secondary" onClick={onExportLogs}>
            Export Activity Logs (CSV)
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Total Jobs: <b>{total.jobs}</b> · Total Logs: <b>{total.logs}</b>
      </p>

      {/* Tabel Jobs */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Tidak ada data jobs. Pastikan file <code>/public/data/jobs.json</code> tersedia dan valid.
          </p>
        ) : (
          <div className="border rounded-md overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Company</th>
                  <th className="p-2 text-left">Location</th>
                  <th className="p-2 text-left">WLB</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id} className="border-t">
                    <td className="p-2">{j.id}</td>
                    <td className="p-2">{j.title}</td>
                    <td className="p-2">{j.company}</td>
                    <td className="p-2">{j.location}</td>
                    <td className="p-2">{j.workLifeBalanceRating ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Tombol <b>Export Jobs (CSV)</b> akan mengunduh isi <code>/public/data/jobs.json</code> ke file CSV yang bisa dibuka di Excel/Google Sheets.
        </p>
      </section>

      {/* Tabel Activity Logs */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Activity Logs</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onRefreshLogs}>
              Refresh
            </Button>
            <Button variant="destructive" onClick={onClearLogs}>
              Clear
            </Button>
          </div>
        </div>

        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada log. Lakukan aksi di aplikasi (isi form, submit, buka /jobs), lalu klik <b>Refresh</b>.
          </p>
        ) : (
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-2 text-left">Waktu</th>
                  <th className="p-2 text-left">Halaman</th>
                  <th className="p-2 text-left">Aksi</th>
                  <th className="p-2 text-left">Payload</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-t align-top">
                    <td className="p-2">{l.timestamp}</td>
                    <td className="p-2">{l.page}</td>
                    <td className="p-2">{l.action}</td>
                    <td className="p-2">
                      <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(l.payload ?? {}, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Log disimpan di <code>localStorage</code> per-origin (domain/port). Jika pindah domain/port, log-nya tidak ikut.
        </p>
      </section>
    </div>
  );
}
