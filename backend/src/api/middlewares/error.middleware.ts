import type { NextFunction, Request, Response } from "express";

export const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "An error occurred";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
