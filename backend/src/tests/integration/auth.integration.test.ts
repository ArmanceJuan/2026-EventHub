import request from "supertest";
import app from "../../api/app";
import { prisma } from "../../prisma/client";

const safeRun = async (query: () => Promise<unknown>) => {
  try {
    await query();
  } catch {
    // Keep cleanup resilient when local schema is partially initialized.
  }
};

const cleanupDatabase = async () => {
  await safeRun(() => prisma.event.deleteMany());
  await safeRun(() => prisma.a2FBackupCode.deleteMany());
  await safeRun(() => prisma.user.deleteMany());
};

describe("Auth integration", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await prisma.$disconnect();
  });

  it("POST /api/auth/register returns 201 for a valid payload", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: `orga-${Date.now()}@test.com`,
      password: "Test1234!",
      role: "ORGANIZER",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: expect.any(String),
        role: "ORGANIZER",
      }),
    );
  });

  it("POST /api/auth/register returns 400 when email already exists", async () => {
    const email = `duplicate-${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email,
      password: "Test1234!",
      role: "ORGANIZER",
    });

    const response = await request(app).post("/api/auth/register").send({
      email,
      password: "Test1234!",
      role: "ORGANIZER",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain("already exists");
  });

  it("POST /api/auth/register returns 400 for missing fields", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("POST /api/auth/login returns 200 and an accessToken cookie", async () => {
    const email = `login-${Date.now()}@test.com`;
    const password = "Test1234!";

    await request(app).post("/api/auth/register").send({
      email,
      password,
      role: "PARTICIPANT",
    });

    const response = await request(app).post("/api/auth/login").send({
      email,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email,
        role: "PARTICIPANT",
      }),
    );
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toContain("accessToken=");
  });

  it("POST /api/auth/login returns 401 for invalid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "unknown@test.com",
      password: "WrongPassword1!",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe("Invalid credentials");
  });

  it("POST /api/auth/login returns 400 for missing fields", async () => {
    const response = await request(app).post("/api/auth/login").send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
