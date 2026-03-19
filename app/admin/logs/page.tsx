"use client";

import { LogsPanel } from "@/src/components/admin/LogsPanel";

export default function AdminLogsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Logs del Sistema</h1>
      <LogsPanel />
    </div>
  );
}
