import { axiosWithoutAuthApi } from "../../services/axios-instance-api.service";
import type { Event } from "./event.model";

export async function fetchEvents(): Promise<Event[]> {
  const res = await axiosWithoutAuthApi.get("/api/events");
  return res.data.data as Event[];
}

export async function fetchEventById(id: string): Promise<Event> {
  const res = await axiosWithoutAuthApi.get(`/api/events/${id}`);
  return res.data.data as Event;
}
