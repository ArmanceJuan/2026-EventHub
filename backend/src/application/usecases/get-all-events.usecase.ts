import { Event } from "../../domain/entities/event.entity";
import { EventRepositoryInterface } from "../../domain/interfaces/event-repository.interface";

export class GetAllEventsUseCase {
  constructor(private readonly repository: EventRepositoryInterface) {}

  async execute(
    lastId?: string,
    limit = 5,
  ): Promise<{ data: Event[]; hasMore: boolean }> {
    return this.repository.findAll(lastId, limit);
  }
}
