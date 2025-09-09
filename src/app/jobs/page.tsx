// app/jobs/page.tsx
import { Suspense } from "react";
import JobsPageClient from "./JobsPageClient";

// bikin dinamis biar gak diprerender (opsional tapi aman untuk halaman berbasis query)
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground">Memuat halaman pekerjaan…</div>}>
      <JobsPageClient />
    </Suspense>
  );
}
