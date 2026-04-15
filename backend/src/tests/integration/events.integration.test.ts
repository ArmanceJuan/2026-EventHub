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

const futureDateIso = () => new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

const baseEventPayload = () => ({
  title: "Event test",
  description: "Description",
  startDate: futureDateIso(),
  venueId: "venue-1",
  capacity: 50,
  price: 20,
  categoryId: "category-1",
  imageUrl: "https://example.com/image.jpg",
});

const registerAndLogin = async (role: "ORGANIZER" | "PARTICIPANT") => {
  const email = `${role.toLowerCase()}-${Date.now()}-${Math.random()}@test.com`;
  const password = "Test1234!";

  await request(app).post("/api/auth/register").send({
    email,
    password,
    role,
  });

  const loginResponse = await request(app).post("/api/auth/login").send({
    email,
    password,
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.headers["set-cookie"]).toBeDefined();

  return {
    cookie: loginResponse.headers["set-cookie"],
  };
};

describe("Events integration", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await prisma.$disconnect();
  });

  it("GET /api/events returns 200", async () => {
    const response = await request(app).get("/api/events");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("GET /api/events/:id returns 200 for an existing event", async () => {
    const { cookie } = await registerAndLogin("ORGANIZER");

    const createResponse = await request(app)
      .post("/api/events")
      .set("Cookie", cookie)
      .send(baseEventPayload());

    const eventId = createResponse.body.data.id;

    const response = await request(app).get(`/api/events/${eventId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(eventId);
  });

  it("GET /api/events/:id returns 404 for an unknown event", async () => {
    const response = await request(app).get("/api/events/unknown-id");

    expect(response.status).toBe(404);
  });

  it("POST /api/events returns 201 for an authenticated organizer", async () => {
    const { cookie } = await registerAndLogin("ORGANIZER");

    const response = await request(app)
      .post("/api/events")
      .set("Cookie", cookie)
      .send(baseEventPayload());

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toEqual(expect.any(String));
  });

  it("POST /api/events returns 403 without token", async () => {
    const response = await request(app).post("/api/events").send(baseEventPayload());

    expect(response.status).toBe(403);
  });

  it("PUT /api/events/:id returns 200 for the event owner", async () => {
    const { cookie } = await registerAndLogin("ORGANIZER");

    const createResponse = await request(app)
      .post("/api/events")
      .set("Cookie", cookie)
      .send(baseEventPayload());

    const eventId = createResponse.body.data.id;

    const response = await request(app)
      .put(`/api/events/${eventId}`)
      .set("Cookie", cookie)
      .send({
        ...baseEventPayload(),
        title: "Updated title",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe("Updated title");
  });

  it("PUT /api/events/:id returns 403 for a non-owner", async () => {
    const owner = await registerAndLogin("ORGANIZER");
    const intruder = await registerAndLogin("ORGANIZER");

    const createResponse = await request(app)
      .post("/api/events")
      .set("Cookie", owner.cookie)
      .send(baseEventPayload());

    const eventId = createResponse.body.data.id;

    const response = await request(app)
      .put(`/api/events/${eventId}`)
      .set("Cookie", intruder.cookie)
      .send({
        ...baseEventPayload(),
        title: "Should fail",
      });

    expect(response.status).toBe(403);
  });

  it("PUT /api/events/:id returns 404 when event does not exist", async () => {
    const { cookie } = await registerAndLogin("ORGANIZER");

    const response = await request(app)
      .put("/api/events/unknown-id")
      .set("Cookie", cookie)
      .send(baseEventPayload());

    expect(response.status).toBe(404);
  });

  it("DELETE /api/events/:id returns 204 for the event owner", async () => {
    const { cookie } = await registerAndLogin("ORGANIZER");

    const createResponse = await request(app)
      .post("/api/events")
      .set("Cookie", cookie)
      .send(baseEventPayload());

    const eventId = createResponse.body.data.id;

    const response = await request(app)
      .delete(`/api/events/${eventId}`)
      .set("Cookie", cookie);

    expect(response.status).toBe(204);
  });

  it("DELETE /api/events/:id returns 403 for a non-owner", async () => {
    const owner = await registerAndLogin("ORGANIZER");
    const intruder = await registerAndLogin("ORGANIZER");

    const createResponse = await request(app)
      .post("/api/events")
      .set("Cookie", owner.cookie)
      .send(baseEventPayload());

    const eventId = createResponse.body.data.id;

    const response = await request(app)
      .delete(`/api/events/${eventId}`)
      .set("Cookie", intruder.cookie);

    expect(response.status).toBe(403);
  });

  it("DELETE /api/events/:id returns 404 when event does not exist", async () => {
    const { cookie } = await registerAndLogin("ORGANIZER");

    const response = await request(app)
      .delete("/api/events/unknown-id")
      .set("Cookie", cookie);

    expect(response.status).toBe(404);
  });
});
