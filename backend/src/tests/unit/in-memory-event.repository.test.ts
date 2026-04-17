import { Event } from "../../domain/entities/event.entity";
import { InMemoryEventRepository } from "../../infrastructure/repositories/in-memory-event.repository";

const buildEvent = (id: string): Event =>
  new Event({
    id,
    title: `Event ${id}`,
    description: "desc",
    startDate: new Date(Date.now() + 86400000),
    venueId: "venue-1",
    capacity: 100,
    price: 10,
    organizerId: "org-1",
    categoryId: "cat-1",
  });

describe("InMemoryEventRepository.findAll", () => {
  it("retourne les événements triés par id et hasMore=true quand la limite est dépassée", async () => {
    const repository = new InMemoryEventRepository();
    await repository.save(buildEvent("c"));
    await repository.save(buildEvent("a"));
    await repository.save(buildEvent("b"));

    const result = await repository.findAll(undefined, 2);

    expect(result.data.map((event) => event.id)).toEqual(["a", "b"]);
    expect(result.hasMore).toBe(true);
  });

  it("retourne les événements après le curseur lastId", async () => {
    const repository = new InMemoryEventRepository();
    await repository.save(buildEvent("a"));
    await repository.save(buildEvent("b"));
    await repository.save(buildEvent("c"));

    const result = await repository.findAll("b", 2);

    expect(result.data.map((event) => event.id)).toEqual(["c"]);
    expect(result.hasMore).toBe(false);
  });

  it("retombe au début si lastId n'existe pas", async () => {
    const repository = new InMemoryEventRepository();
    await repository.save(buildEvent("a"));
    await repository.save(buildEvent("b"));

    const result = await repository.findAll("missing-id", 1);

    expect(result.data.map((event) => event.id)).toEqual(["a"]);
    expect(result.hasMore).toBe(true);
  });
});

describe("InMemoryEventRepository update/delete", () => {
  it("lève une erreur quand update est appelé avec un id inexistant", async () => {
    const repository = new InMemoryEventRepository();

    await expect(repository.update(buildEvent("unknown"))).rejects.toThrow(
      "Event not found"
    );
  });

  it("lève une erreur quand delete est appelé avec un id inexistant", async () => {
    const repository = new InMemoryEventRepository();

    await expect(repository.delete("unknown")).rejects.toThrow(
      "Event not found"
    );
  });
});
