import { CreateEventUseCase } from "../../application/usecases/create-event.usecase";
import { InMemoryEventRepository } from "../../infrastructure/repositories/in-memory-event.repository";

describe("CreateEventUseCase", () => {
  let useCase: CreateEventUseCase;
  let repository: InMemoryEventRepository;

  const validEventDTO = {
    title: "Concert de Clair Obscure",
    description: "Un orchestre en plein air",
    startDate: new Date(Date.now() + 86400000),
    venueId: "venue-1",
    capacity: 100,
    price: 20,
    organizerId: "user-1",
    categoryId: "cat-1",
    imageUrl:
      "https://images.unsplash.com/photo-1748958342360-db81446bfe60?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  beforeEach(() => {
    repository = new InMemoryEventRepository();
    useCase = new CreateEventUseCase(repository);
  });

  it("crée un événement avec des données valides", async () => {
    const event = await useCase.execute(validEventDTO);

    expect(event).toBeDefined();
    expect(event).toHaveProperty("id");
    expect(event.title).toBe(validEventDTO.title);
  });

  it("échoue si le titre est manquant", async () => {
    await expect(
      useCase.execute({ ...validEventDTO, title: "" })
    ).rejects.toThrow();
  });

  it("échoue si la date est dans le passé", async () => {
    await expect(
      useCase.execute({
        ...validEventDTO,
        startDate: new Date(Date.now() - 86400000),
      })
    ).rejects.toThrow();
  });

  it("échoue si le lieu est manquant", async () => {
    await expect(
      useCase.execute({ ...validEventDTO, venueId: "" })
    ).rejects.toThrow();
  });

  it("échoue si la capacité est inférieure à 1", async () => {
    await expect(
      useCase.execute({ ...validEventDTO, capacity: 0 })
    ).rejects.toThrow();
  });

  it("échoue si le prix est négatif", async () => {
    await expect(
      useCase.execute({ ...validEventDTO, price: -10 })
    ).rejects.toThrow();
  });

  it("échoue si l’organisateur est manquant", async () => {
    await expect(
      useCase.execute({ ...validEventDTO, organizerId: "" })
    ).rejects.toThrow();
  });

  it("échoue si la catégorie est manquante", async () => {
    await expect(
      useCase.execute({ ...validEventDTO, categoryId: "" })
    ).rejects.toThrow();
  });
});
