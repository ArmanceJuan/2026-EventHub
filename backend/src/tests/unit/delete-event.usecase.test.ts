import { DeleteEventUseCase } from "../../application/usecases/delete-event.usecase";
import { InMemoryEventRepository } from "../../infrastructure/repositories/in-memory-event.repository";
import { Event } from "../../domain/entities/event.entity";

describe("DeleteEventUseCase", () => {
  let repository: InMemoryEventRepository;
  let useCase: DeleteEventUseCase;

  const futureDate = () => new Date(Date.now() + 86400000);

  beforeEach(() => {
    repository = new InMemoryEventRepository();
    useCase = new DeleteEventUseCase(repository);
  });

  it("supprime un event existant", async () => {
    const event = new Event({
      id: "evt-1",
      title: "To delete",
      description: "desc",
      startDate: futureDate(),
      venueId: "venue-1",
      capacity: 10,
      price: 0,
      organizerId: "user-1",
      categoryId: "cat-1",
      imageUrl: "x",
    });

    await repository.save(event);

    await expect(useCase.execute("evt-1")).resolves.toBeUndefined();

    const found = await repository.findById("evt-1");
    expect(found).toBeNull();
  });

  it("échoue si l'id est vide", async () => {
    await expect(useCase.execute("")).rejects.toThrow("Event id is required");
  });

  it("échoue si l'event n'existe pas", async () => {
    await expect(useCase.execute("unknown")).rejects.toThrow("Event not found");
  });

  it("échoue si l'utilisateur n'est pas l'organisateur (forbidden)", async () => {
    const repo = new InMemoryEventRepository();
    const usecase = new DeleteEventUseCase(repo);

    await repo.save(
      new Event({
        id: "event-1",
        title: "Coldplay",
        startDate: new Date(Date.now() + 86400000),
        venueId: "venue-1",
        capacity: 10,
        organizerId: "owner-1",
        categoryId: "cat-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    await expect(
      usecase.execute("event-1", "intruder-1")
    ).rejects.toMatchObject({
      message: "Forbidden",
      statusCode: 403,
    });
  });
});
