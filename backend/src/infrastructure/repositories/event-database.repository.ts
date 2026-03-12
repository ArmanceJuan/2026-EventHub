import { prisma } from "../../prisma/client";
import { Event } from "../../domain/entities/event.entity";
import { EventRepositoryInterface } from "../../domain/interfaces/event-repository.interface";

export class EventRepositoryDatabase implements EventRepositoryInterface {
  private toDomain(dbEvent: any): Event {
    return new Event({
      id: dbEvent.id,
      title: dbEvent.title,
      description: dbEvent.description ?? undefined,
      startDate: dbEvent.startDate,
      venueId: dbEvent.venueId,
      capacity: dbEvent.capacity,
      price: dbEvent.price ?? undefined,
      organizerId: dbEvent.organizerId,
      categoryId: dbEvent.categoryId,
      imageUrl: dbEvent.imageUrl ?? undefined,
      createdAt: dbEvent.createdAt,
      updatedAt: dbEvent.updatedAt,
    });
  }

  async save(event: Event): Promise<Event> {
    const created = await prisma.event.create({
      data: {
        id: event.id,
        title: event.title,
        description: event.description ?? null,
        startDate: event.startDate,
        venueId: event.venueId,
        capacity: event.capacity,
        price: event.price ?? null,
        organizerId: event.organizerId,
        categoryId: event.categoryId,
        imageUrl: event.imageUrl ?? null,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async findAll(): Promise<Event[]> {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    return events.map((e) => this.toDomain(e));
  }

  async findById(id: string): Promise<Event | null> {
    const event = await prisma.event.findUnique({ where: { id } });
    return event ? this.toDomain(event) : null;
  }

  async update(event: Event): Promise<Event> {
    const updated = await prisma.event.update({
      where: { id: event.id },
      data: {
        title: event.title,
        description: event.description ?? null,
        startDate: event.startDate,
        venueId: event.venueId,
        capacity: event.capacity,
        price: event.price ?? null,
        organizerId: event.organizerId,
        categoryId: event.categoryId,
        imageUrl: event.imageUrl ?? null,
        updatedAt: event.updatedAt,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.event.delete({ where: { id } });
  }
}
