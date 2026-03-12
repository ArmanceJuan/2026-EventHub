import { Router } from "express";
import eventRoutes from "./event.route";
import authRoutes from "./auth.route";

const router = Router();

router.use(authRoutes);
router.use(eventRoutes);

export default router;
