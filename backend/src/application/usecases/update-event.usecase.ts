import { Event } from "../../domain/entities/event.entity";
import { EventRepositoryInterface } from "../../domain/interfaces/event-repository.interface";

export type UpdateEventInput = {
  title: string;
  description?: string;
  startDate: Date;
  venueId: string;
  capacity: number;
  price?: number;
  categoryId: string;
  imageUrl?: string;
};

export class UpdateEventUseCase {
  constructor(private readonly eventRepository: EventRepositoryInterface) {}

  async execute(
    eventId: string,
    input: UpdateEventInput,
    requesterId: string
  ): Promise<Event> {
    const existing = await this.eventRepository.findById(eventId);

    if (!existing) {
      const err: any = new Error("Event not found");
      err.statusCode = 404;
      throw err;
    }

    if (existing.organizerId !== requesterId) {
      const err: any = new Error("Forbidden");
      err.statusCode = 403;
      throw err;
    }

    const updatedEvent = new Event({
      id: existing.id,
      organizerId: existing.organizerId,
      createdAt: existing.createdAt,
      updatedAt: new Date(),

      title: input.title,
      description: input.description,
      startDate: input.startDate,
      venueId: input.venueId,
      capacity: input.capacity,
      price: input.price,
      categoryId: input.categoryId,
      imageUrl: input.imageUrl,
    });

    return this.eventRepository.update(updatedEvent);
  }
}
