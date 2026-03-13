import { axiosWithoutAuthApi } from "../../services/axios-instance-api.service";
import type { Event } from "./event.model";

export async function fetchEvents(
  lastId?: string,
): Promise<{ data: Event[]; hasMore: boolean }> {
  const params = lastId ? `?lastId=${lastId}` : "";
  const res = await axiosWithoutAuthApi.get(`/api/events${params}`);
  return res.data.data as { data: Event[]; hasMore: boolean };
}

export async function fetchEventById(id: string): Promise<Event> {
  const res = await axiosWithoutAuthApi.get(`/api/events/${id}`);
  return res.data.data as Event;
}
