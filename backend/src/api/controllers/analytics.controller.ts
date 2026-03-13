import type { NextFunction, Request, Response } from "express";
import container from "../config/dependency-injection";

export const recordAnalytics = async (req, res, next) => {
  try {
    const cmd = container.resolve("recordAnalyticsCommand");
    await cmd.execute(req.body);
    return res.jsonSuccess(null, 201);
  } catch (error) {
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
