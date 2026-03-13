import bcrypt from "bcrypt";
import { prisma } from "./client";

async function main() {
  const email = "orga@test.com";
  const password = "test123";

  const passwordHash = await bcrypt.hash(password, 10);

  const organizer = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      role: "ORGANIZER",
    },
  });

  console.log("Seed OK: orga@test.com / test123");

  const baseDate = new Date("2030-01-01T10:00:00.000Z");

  const eventsData = [
    {
      id: "event-concert-1",
      title: "Concert Imagine Dragons",
      description: "Live à l'Accor Arena",
      startDate: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      venueId: "venue-paris-1",
      capacity: 150,
      price: 45,
      categoryId: "cat-concert",
      imageUrl: "https://example.com/imagine-dragons.jpg",
    },
    {
      id: "event-concert-2",
      title: "Concert Coldplay",
      description: "Stade de France - Music of the Spheres",
      startDate: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      venueId: "venue-paris-2",
      capacity: 80000,
      price: 80,
      categoryId: "cat-concert",
      imageUrl: "https://example.com/coldplay.jpg",
    },
    {
      id: "event-festival-1",
      title: "Festival Rock en Seine",
      description: "3 jours de rock à Paris",
      startDate: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000),
      venueId: "venue-paris-3",
      capacity: 30000,
      price: 120,
      categoryId: "cat-festival",
      imageUrl: "https://example.com/rock-en-seine.jpg",
    },
    {
      id: "event-festival-2",
      title: "Festival Les Vieilles Charrues",
      description: "Le plus grand festival de France",
      startDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      venueId: "venue-bretagne-1",
      capacity: 250000,
      price: 150,
      categoryId: "cat-festival",
      imageUrl: "https://example.com/vieilles-charrues.jpg",
    },
    {
      id: "event-expo-1",
      title: "Exposition Monet & les Nymphéas",
      description: "Une immersion dans l'œuvre de Monet",
      startDate: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      venueId: "venue-musee-orsay",
      capacity: 500,
      price: 20,
      categoryId: "cat-exposition",
      imageUrl: "https://example.com/monet.jpg",
    },
    {
      id: "event-expo-2",
      title: "Exposition Street Art Paris",
      description: "Les plus grands artistes urbains réunis",
      startDate: new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000),
      venueId: "venue-paris-4",
      capacity: 800,
      price: 18,
      categoryId: "cat-exposition",
      imageUrl: "https://example.com/street-art.jpg",
    },
    {
      id: "event-conference-1",
      title: "Conférence Tech - JS Nation",
      description: "Les nouveautés JavaScript et TypeScript",
      startDate: new Date(baseDate.getTime() + 6 * 24 * 60 * 60 * 1000),
      venueId: "venue-tech-1",
      capacity: 400,
      price: 60,
      categoryId: "cat-conference",
      imageUrl: "https://example.com/js-nation.jpg",
    },
    {
      id: "event-conference-2",
      title: "Conférence IA - Future of AI",
      description: "L'intelligence artificielle en 2035",
      startDate: new Date(baseDate.getTime() + 8 * 24 * 60 * 60 * 1000),
      venueId: "venue-tech-2",
      capacity: 600,
      price: 90,
      categoryId: "cat-conference",
      imageUrl: "https://example.com/ai-future.jpg",
    },
  ];

  const moreEvents = Array.from({ length: 22 }).map((_, index) => {
    const i = index + 1;
    return {
      id: `event-generic-${i}`,
      title: `Soirée événement #${i}`,
      description: `Événement générique numéro ${i}`,
      startDate: new Date(baseDate.getTime() + (10 + i) * 24 * 60 * 60 * 1000),
      venueId: `venue-generic-${i}`,
      capacity: 100 + i * 10,
      price: 10 + i,
      categoryId: i % 2 === 0 ? "cat-soiree" : "cat-concert",
      imageUrl: "https://example.com/event-generic.jpg",
    };
  });

  const allEvents = [...eventsData, ...moreEvents];

  await prisma.event.createMany({
    data: allEvents.map((e) => ({
      ...e,
      organizerId: organizer.id,
    })),
    skipDuplicates: true,
  });

  console.log(`Seed OK: ${allEvents.length} events créés.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
