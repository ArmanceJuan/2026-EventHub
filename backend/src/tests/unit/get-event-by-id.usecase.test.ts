import { GetEventByIdUseCase } from "../../application/usecases/get-event-by-id.usecase";
import { InMemoryEventRepository } from "../../infrastructure/repositories/in-memory-event.repository";
import { Event } from "../../domain/entities/event.entity";

describe("GetEventByIdUseCase", () => {
  let repository: InMemoryEventRepository;
  let useCase: GetEventByIdUseCase;

  beforeEach(() => {
    repository = new InMemoryEventRepository();
    useCase = new GetEventByIdUseCase(repository);
  });

  it("retourne null si l'event n'existe pas", async () => {
    const result = await useCase.execute("unknown-id");
    expect(result).toBeNull();
  });

  it("échoue si l'id est vide", async () => {
    await expect(useCase.execute("")).rejects.toThrow("Event id is required");
  });

  it("retourne l'event si il existe", async () => {
    const event = new Event({
      id: "evt-1",
      title: "Test",
      description: "desc",
      startDate: new Date(Date.now() + 86400000),
      venueId: "venue-1",
      capacity: 10,
      price: 0,
      organizerId: "user-1",
      categoryId: "cat-1",
      imageUrl: undefined,
    });

    await repository.save(event);

    const result = await useCase.execute("evt-1");

    expect(result).not.toBeNull();
    expect(result!.id).toBe("evt-1");
    expect(result!.title).toBe("Test");
  });
});
