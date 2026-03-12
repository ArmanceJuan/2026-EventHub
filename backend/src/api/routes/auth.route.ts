import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "../controllers/auth.controller";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";

const router = Router();
const controller = new AuthController();
const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 4,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de tentatives. Réessaie dans 1 minute.",
  },
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "orga@test.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 example: "ORGANIZER"
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Données invalides / email déjà existant
 */

router.post("/auth/register", controller.register.bind(controller));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter (retourne un JWT)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "orga@test.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: JWT retourné
 *       401:
 *         description: Identifiants invalides
 */

router.post("/auth/login", otpLimiter, controller.login.bind(controller));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *       401:
 *         description: Non authentifié
 */

router.get(
  "/auth/me",
  authenticationMiddleware,
  controller.me.bind(controller),
);

router.post(
  "/auth/logout",
  authenticationMiddleware,
  controller.logout.bind(controller),
);
export default router;
