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
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.jsonError("Missing authorization header", 403);
    }

    const token = extractToken(authorization);
    if (!token) {
      return res.jsonError("Invalid authorization header", 403);
    }

    const payload = jwt.verify(
      token,
      getEnvVariable("JWT_SECRET")
    ) as UserPayload;

    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
};
