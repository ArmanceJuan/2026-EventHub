import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Event } from "./event.model";
import { fetchEvents } from "./events.api";

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (e: any) {
        setError(e?.message ?? "Impossible de charger les événements.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Chargement des événements...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="card">
      <h2 className="title">Événements à venir</h2>
      <ul className="event-list">
        {events.map((ev) => (
          <li key={ev.id} className="event-list__item">
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>
            <p>
              <b>Date :</b> {new Date(ev.startDate).toLocaleString()}
            </p>
            <Link to={`/events/${ev.id}`} className="btn btnPrimary">
              Voir le détail
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
