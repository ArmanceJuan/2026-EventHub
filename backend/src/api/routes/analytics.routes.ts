import { Router } from "express";
import {
  getAnalytics,
  recordAnalytics,
} from "../controllers/analytics.controller";

const router = Router();

router.post("/", recordAnalytics);
router.get("/", getAnalytics);

export default router;
