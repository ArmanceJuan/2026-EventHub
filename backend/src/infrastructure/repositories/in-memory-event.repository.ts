import { Event } from "../../domain/entities/event.entity";
import { EventRepositoryInterface } from "../../domain/interfaces/event-repository.interface";

export class InMemoryEventRepository implements EventRepositoryInterface {
  private events: Event[] = [];

  async save(event: Event): Promise<Event> {
    this.events.push(event);
    return event;
  }

  async findAll(
    lastId?: string,
    limit = 5
  ): Promise<{ data: Event[]; hasMore: boolean }> {
    const sorted = [...this.events].sort((a, b) => a.id.localeCompare(b.id));

    let startIndex = 0;
    if (lastId) {
      const cursorIndex = sorted.findIndex((event) => event.id === lastId);
      startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    }

    const sliced = sorted.slice(startIndex, startIndex + limit + 1);
    const hasMore = sliced.length > limit;

    return {
      data: hasMore ? sliced.slice(0, limit) : sliced,
      hasMore,
    };
  }

  async findById(id: string): Promise<Event | null> {
    return this.events.find((e) => e.id === id) ?? null;
  }

  async update(event: Event): Promise<Event> {
    const index = this.events.findIndex((e) => e.id === event.id);
    if (index === -1) throw new Error("Event not found");
    this.events[index] = event;
    return event;
  }

  async delete(id: string): Promise<void> {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Event not found");
    this.events.splice(index, 1);
  }
}
