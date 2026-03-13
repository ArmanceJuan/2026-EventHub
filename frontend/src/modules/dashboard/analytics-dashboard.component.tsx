import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useDashboardData } from "./use-dashboard-data.hook";
import type { Event } from "../events/event.model";
import { fetchEvents } from "../events/events.api";

export function AnalyticsDashboard() {
  const { data, status, error } = useDashboardData();

  const [events, setEvents] = useState<Event[]>([]);
  const [eventsError, setEventsError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await fetchEvents();
        setEvents(result.data);
      } catch (e: any) {
        setEventsError(e?.message ?? "Impossible de charger les événements.");
      }
    })();
  }, []);

  if (status === "idle" || status === "loading") {
    return <div>Chargement des statistiques...</div>;
  }

  if (status === "error") {
    return <div className="error">Erreur : {error}</div>;
  }

  if (eventsError) {
    return <div className="error">{eventsError}</div>;
  }

  const chartData = data.map((row) => {
    const slug = row._id.split("/").filter(Boolean).pop();
    const matchingEvent = slug
      ? events.find((evt) => evt.id === slug)
      : undefined;
    return { ...row, label: matchingEvent?.title ?? row._id };
  });

  if (!data.length) {
    return (
      <div className="card">
        <h2 className="title">Dashboard Analytics</h2>
        <p className="subtitle">
          Aucune donnée analytics pour le moment. Navigue sur les pages
          événement pour générer des statistiques.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="title">Dashboard Analytics</h2>
      <p className="subtitle">Pages événement les plus consultées</p>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0" }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Bar dataKey="count" fill="#319795" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
