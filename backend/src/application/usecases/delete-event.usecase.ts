// src/application/usecases/DeleteEventUseCase.ts
import { EventRepositoryInterface } from "../../domain/interfaces/event-repository.interface";

export class DeleteEventUseCase {
  constructor(private readonly eventRepository: EventRepositoryInterface) {}

  async execute(eventId: string, requesterId: string): Promise<void> {
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

    await this.eventRepository.delete(eventId);
  }
}
