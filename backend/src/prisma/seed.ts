import bcrypt from "bcrypt";
import { prisma } from "./client";

async function main() {
  const email = "orga@test.com";
  const password = "test123";

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      role: "ORGANIZER",
    },
  });

  console.log("Seed OK: orga@test.com / test123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
