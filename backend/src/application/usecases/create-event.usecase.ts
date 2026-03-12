import { Event } from "../../domain/entities/event.entity";
import { EventRepositoryInterface } from "../../domain/interfaces/event-repository.interface";
import { randomUUID } from "crypto";

export interface CreateEventInput {
  title: string;
  description?: string;
  startDate: Date;
  venueId: string;
  capacity: number;
  price?: number;
  organizerId: string;
  categoryId: string;
  imageUrl?: string;
}

export class CreateEventUseCase {
  constructor(private readonly eventRepository: EventRepositoryInterface) {}

  async execute(input: CreateEventInput): Promise<Event> {
    const event = new Event({
      id: randomUUID(),
      title: input.title,
      description: input.description,
      startDate: input.startDate,
      venueId: input.venueId,
      capacity: input.capacity,
      price: input.price,
      organizerId: input.organizerId,
      categoryId: input.categoryId,
      imageUrl: input.imageUrl,
    });

    return this.eventRepository.save(event);
  }
}
