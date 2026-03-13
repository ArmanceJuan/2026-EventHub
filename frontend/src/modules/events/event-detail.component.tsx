import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Event } from "./event.model";
import { fetchEventById } from "./events.api";
import { useTrackPageView } from "../analytics/use-track-page-view.hook";
import { useAppDispatch, type AppState } from "../store/store";
import { useSelector } from "react-redux";
import { sendAnalyticsAction } from "../analytics/send-analytics.action";

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: AppState) => state.auth);

  // Track page view
  useTrackPageView(id ? `/events/${id}` : "events/unknown");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (e: any) {
        setError(e?.message ?? "Impossible de charger l'événement.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error || !event)
    return <div className="error">{error ?? "Événement introuvable."}</div>;

  const onBuyTicket = () => {
    if (!id) return;

    dispatch(
      sendAnalyticsAction({
        eventName: "buy-ticket",
        userId: user?.id ?? "",
        page: `/events/${id}`,
        timestamp: new Date().toISOString(),
      }),
    );

    alert("Achat de billet simulé !");
  };

  return (
    <div className="card">
      <h2 className="title">{event.title}</h2>
      <p className="subtitle">{event.description}</p>

      <div className="form">
        <div className="field">
          <label>Date</label>
          <input value={new Date(event.startDate).toLocaleString()} readOnly />
        </div>

        <div className="field">
          <label>Lieu</label>
          <input value={event.venueId} readOnly />
        </div>

        <div className="field">
          <label>Prix</label>
          <input
            value={event.price != null ? `${event.price} €` : "Gratuit"}
            readOnly
          />
        </div>

        <div className="actions">
          <button
            className="btn btnPrimary"
            type="button"
            onClick={onBuyTicket}
          >
            Acheter un billet
          </button>
        </div>
      </div>
    </div>
  );
}
