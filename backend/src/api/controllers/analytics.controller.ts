import type { NextFunction, Request, Response } from "express";
import container from "../config/dependency-injection";

export const recordAnalytics = async (req, res, next) => {
  try {
    console.log("Resolving recordAnalyticsCommand...");
    const cmd = container.resolve("recordAnalyticsCommand");
    console.log("Resolved:", cmd);
    await cmd.execute(req.body);
    return res.jsonSuccess(null, 201);
  } catch (error) {
    console.error("ERREUR CONTROLLER:", error); // ← voir le vrai message
    next(error);
  }
};

export const getAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const analytics = await container.resolve("getAnalyticsQuery").execute();
    return res.jsonSuccess(analytics, 200);
  } catch (error) {
    next(error);
  }
};
