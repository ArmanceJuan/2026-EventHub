import { Router } from "express";
import { authenticationMiddleware } from "../middlewares/authentication.middleware";
import { qrCode, enableA2F } from "../controllers/a2f.controller";
import rateLimit from "express-rate-limit";

const router = Router();
const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 4,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de tentatives. Réessayez dans 1 minute." },
});

router.use(authenticationMiddleware);

router.get("/qrcode", qrCode);
router.post("/enable", otpLimiter, enableA2F);

export { router as a2fRouter };
