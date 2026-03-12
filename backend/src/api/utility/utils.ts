import "dotenv/config";
import { Response } from "express";

export const getEnvVariable = (variableName: string) => {
  const value = process.env[variableName];

  if (!value) {
    throw new Error(`Missing environment variable: ${variableName}`);
  }

  return value;
};

export const jsonError = function (
  this: Response,
  message: string,
  statusCode: number = 500
) {
  return this.status(statusCode).json({
    success: false,
    message,
  });
};

export const jsonSuccess = function (
  this: Response,
  data: any,
  statusCode: number = 200
) {
  return this.status(statusCode).json({
    success: true,
    data,
  });
};

export const extractToken = (authorization: string): string | null => {
  if (!authorization) {
    return null;
  }

  const [prefix, token] = authorization.split(" ");

  if (!prefix || !token) {
    return null;
  }

  const authorizationPrefixes = ["Bearer"];

  if (!authorizationPrefixes.includes(prefix)) {
    return null;
  }

  return token;
};
