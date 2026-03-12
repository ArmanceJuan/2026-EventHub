import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { extractToken, getEnvVariable } from "../utility";
import { UserPayload } from "../dto";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}

export const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      console.log("[authenticationMiddleware] Missing access token cookie");
      return res.jsonError("Missing access token", 403);
    }

    const payload = jwt.verify(
      token,
      getEnvVariable("JWT_SECRET"),
    ) as UserPayload;

    console.log("[authenticationMiddleware] Token verified", {
      userId: payload.id,
      email: payload.email,
      role: payload.role,
    });

    req.user = payload;
    next();
  } catch (error) {
    console.error("[authenticationMiddleware] Error while verifying token", error);
    next(error);
  }
};
