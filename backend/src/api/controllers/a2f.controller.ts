import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { authenticator } from "otplib";
import { QrCodeGenerator } from "../../shared/utils/qr-code-generator";
import { prisma } from "../../prisma/client";
import { generateBackupCodes } from "../../shared/utils/backup-codes";

export const qrCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    if (!req.user) {
      return res.jsonError("Vous n'êtes pas connecté", 401);
    }

    const userId = (req.user as any).id;
    if (!userId) {
      return res.jsonError("Token invalide (id manquant)", 401);
    }

    const userDb = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!userDb) {
      return res.jsonError("Utilisateur introuvable", 404);
    }

    const secret = authenticator.generateSecret();
    const appName = process.env.APP_NAME || "EventHub";

    const qrCodeGenerator = new QrCodeGenerator(appName);
    const qrCode = await qrCodeGenerator.generate(userDb.email, secret);

    return res.jsonSuccess({ qrCode }, 200);
  } catch (error) {
    next(error);
  }
};

export const enableA2F = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    if (!req.user) return res.jsonError("Vous n'êtes pas connecté", 401);

    const userId = (req.user as any).id;
    if (!userId) return res.jsonError("Token invalide (id manquant)", 401);

    const { secret, code } = req.body as { secret?: string; code?: string };

    if (!secret || !code) {
      return res.jsonError("secret et code sont requis", 400);
    }

    const isValid = authenticator.check(code, secret);
    if (!isValid) {
      return res.jsonError("Code OTP invalide", 400);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { otp_secret: secret, otp_enable: true },
    });

    const backupCodes = generateBackupCodes(5);

    const codesHash = await Promise.all(
      backupCodes.map((c) => bcrypt.hash(c, 10)),
    );
    console.log(Object.keys(prisma));

    await prisma.a2FBackupCode.upsert({
      where: { userId },
      update: { codesHash },
      create: { userId, codesHash },
    });

    return res.jsonSuccess({ message: "2FA activée", backupCodes }, 200);
  } catch (error) {
    next(error);
  }
};
