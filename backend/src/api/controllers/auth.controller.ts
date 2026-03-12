import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authenticator } from "otplib";
import { prisma } from "../../prisma/client";
import { getEnvVariable } from "../utility";
import { hashPassword, verifyPassword } from "../utility/password";
import type { LoginDTO, RegisterDTO, UserPayload } from "../dto/auth.dto";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as RegisterDTO;

      console.log("[AuthController][register] Incoming request", {
        email: body.email,
        role: body.role,
      });

      if (!body.email || !body.password) {
        return res.jsonError("Email and password are required", 400);
      }

      const existing = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (existing) {
        return res.jsonError(`Email ${body.email} already exists`, 400);
      }

      const hashed = await hashPassword(body.password);

      const user = await prisma.user.create({
        data: {
          email: body.email,
          passwordHash: hashed,
          role: (body.role as any) ?? "PARTICIPANT",
        },
        select: { id: true, email: true, role: true, createdAt: true },
      });

      return res.jsonSuccess(user, 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as LoginDTO;

      console.log("[AuthController][login] Incoming request", {
        email: body.email,
        hasPassword: !!body.password,
        hasOtpCode: !!body.otpCode,
        hasBackupCode: !!body.backupCode,
      });

      if (!body.email || !body.password) {
        return res.jsonError("Email and password are required", 400);
      }

      const user = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (!user) {
        console.log("[AuthController][login] User not found", {
          email: body.email,
        });
        return res.jsonError("Invalid credentials", 401);
      }

      const ok = await verifyPassword(body.password, user.passwordHash);
      if (!ok) {
        console.log("[AuthController][login] Invalid password", {
          email: body.email,
        });
        return res.jsonError("Invalid credentials", 401);
      }

      if (user.otp_enable) {
        const otpCode = body.otpCode?.trim();
        const backupCode = body.backupCode?.trim();

        if (!otpCode && !backupCode) {
          return res.jsonError("OTP requis (otpCode ou backupCode)", 401);
        }

        if (otpCode) {
          if (!user.otp_secret) {
            return res.jsonError("2FA activée mais secret manquant", 500);
          }

          const isValidOtp = authenticator.check(otpCode, user.otp_secret);
          if (!isValidOtp) {
            return res.jsonError("Code OTP invalide", 401);
          }
        }

        if (!otpCode && backupCode) {
          const rec = await prisma.a2FBackupCode.findUnique({
            where: { userId: user.id },
          });

          if (!rec) {
            return res.jsonError("Aucun code de secours disponible", 401);
          }

          const hashes = rec.codesHash as unknown as string[];
          if (!Array.isArray(hashes) || hashes.length === 0) {
            return res.jsonError("Aucun code de secours disponible", 401);
          }

          let matchIndex = -1;
          for (let i = 0; i < hashes.length; i++) {
            const isMatch = await bcrypt.compare(backupCode, hashes[i]);
            if (isMatch) {
              matchIndex = i;
              break;
            }
          }

          if (matchIndex === -1) {
            console.log("[AuthController][login] Invalid backup code", {
              userId: user.id,
            });
            return res.jsonError("Code de secours invalide", 401);
          }

          const newHashes = hashes.filter((_, i) => i !== matchIndex);

          await prisma.a2FBackupCode.update({
            where: { userId: user.id },
            data: { codesHash: newHashes as any },
          });
        }
      }

      const payload: UserPayload = {
        id: user.id,
        email: user.email,
        role: user.role as any,
      };

      const token = jwt.sign(payload, getEnvVariable("JWT_SECRET"), {
        expiresIn: "7d",
      });

      console.log("[AuthController][login] Login success", {
        userId: payload.id,
        email: payload.email,
        role: payload.role,
      });

      return res
        .cookie("accessToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .jsonSuccess({ user: payload }, 200);
    } catch (err) {
      next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        console.log("[AuthController][me] No user on request");
        return res.jsonError("Unauthorized", 401);
      }
      console.log("[AuthController][me] Current user", {
        userId: user.id,
        email: user.email,
        role: user.role,
      });
      return res.jsonSuccess({ user }, 200);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("[AuthController][logout] Logging out user", {
        userId: req.user?.id,
        email: req.user?.email,
      });
      res
        .cookie("accessToken", "", {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 0,
        })
        .jsonSuccess({ message: "Logged out" }, 200);
    } catch (err) {
      next(err);
    }
  }
}
