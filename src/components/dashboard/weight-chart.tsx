"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { formatShortDate } from "@/lib/utils";

interface WeightEntry {
  date: string | Date;
  weight: number;
  height?: number | null;
}

export function WeightChart({ data }: { data: WeightEntry[] }) {
  const chartData = data.map((d) => ({
    date: formatShortDate(d.date),
    peso: d.weight,
    altezza: d.height ?? undefined,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5d6bb" />
          <XAxis dataKey="date" stroke="#a9824f" fontSize={12} />
          <YAxis stroke="#a9824f" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5d6bb", borderRadius: 8 }}
          />
          <Legend />
          <Line type="monotone" dataKey="peso" name="Peso (kg)" stroke="#e2436c" strokeWidth={2} />
          <Line type="monotone" dataKey="altezza" name="Altezza (cm)" stroke="#2f7ea8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
