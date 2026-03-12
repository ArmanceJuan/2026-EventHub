import crypto from "crypto";

export function generateBackupCodes(count = 5) {
  return Array.from({ length: count }, () => {
    const raw = crypto.randomBytes(4).toString("hex").toUpperCase(); // 8 chars
    return `${raw.slice(0, 4)}-${raw.slice(4)}`;
  });
}
