import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import {
  CreateEventUseCase,
  GetAllEventsUseCase,
  GetEventByIdUseCase,
  UpdateEventUseCase,
  DeleteEventUseCase,
} from "../../application/usecases";
import { EventRepositoryDatabase } from "../../infrastructure/repositories/event-database.repository";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";

const router = Router();

const repository = new EventRepositoryDatabase();

const createEventUseCase = new CreateEventUseCase(repository);
const getAllEventsUseCase = new GetAllEventsUseCase(repository);
const getEventByIdUseCase = new GetEventByIdUseCase(repository);
const updateEventUseCase = new UpdateEventUseCase(repository);
const deleteEventUseCase = new DeleteEventUseCase(repository);

const controller = new EventController(
  createEventUseCase,
  getAllEventsUseCase,
  getEventByIdUseCase,
  updateEventUseCase,
  deleteEventUseCase
);

// PUBLIC
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Lister les événements
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Liste des événements
 */

router.get("/events", controller.getAll.bind(controller));

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Récupérer un événement par ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Événement trouvé
 *       404:
 *         description: Événement introuvable
 */

router.get("/events/:id", controller.getById.bind(controller));

// PROTECTED
/**
 * @swagger
 * /events:
 *   post:
 *     summary: Créer un événement (auth requis)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, startDate, venueId, capacity, categoryId]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Coldplay"
 *               description:
 *                 type: string
 *                 example: "One year again"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2030-01-01T10:00:00.000Z"
 *               venueId:
 *                 type: string
 *                 example: "venue-1"
 *               capacity:
 *                 type: integer
 *                 example: 100
 *               price:
 *                 type: integer
 *                 example: 20
 *               categoryId:
 *                 type: string
 *                 example: "cat-1"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Événement créé
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Non authentifié
 */

router.post(
  "/events",
  authenticationMiddleware,
  controller.create.bind(controller)
);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Mettre à jour un événement (auth requis)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Événement mis à jour
 *       403:
 *         description: Non authentifié
 *       404:
 *         description: Événement introuvable
 */

router.put(
  "/events/:id",
  authenticationMiddleware,
  controller.update.bind(controller)
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Supprimer un événement (auth requis)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Supprimé
 *       403:
 *         description: Non authentifié
 *       404:
 *         description: Événement introuvable
 */

router.delete(
  "/events/:id",
  authenticationMiddleware,
  controller.delete.bind(controller)
);

export default router;
