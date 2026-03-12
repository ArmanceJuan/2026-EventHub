import { Event } from "../../domain/entities/event.entity";
import { EventRepositoryInterface } from "../../domain/interfaces/event-repository.interface";

export class GetEventByIdUseCase {
  constructor(private readonly repository: EventRepositoryInterface) {}

  async execute(id: string): Promise<Event | null> {
    if (!id || id.trim() === "") {
      throw new Error("Event id is required");
    }
    return this.repository.findById(id);
  }
}
