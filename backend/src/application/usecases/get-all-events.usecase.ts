import { Event } from "../../domain/entities/event.entity";
import { EventRepositoryInterface } from "../../domain/interfaces/event-repository.interface";

export class GetAllEventsUseCase {
  constructor(private readonly repository: EventRepositoryInterface) {}

  async execute(): Promise<Event[]> {
    return this.repository.findAll();
  }
}
