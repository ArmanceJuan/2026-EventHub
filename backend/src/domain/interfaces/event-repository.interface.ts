import { Event } from "../entities/event.entity";

export interface EventRepositoryInterface {
  save(event: Event): Promise<Event>;
  findAll(
    lastId?: string,
    limit?: number,
  ): Promise<{ data: Event[]; hasMore: boolean }>;
  findById(id: string): Promise<Event | null>;
  update(event: Event): Promise<Event>;
  delete(id: string): Promise<void>;
}
