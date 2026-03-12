import qrcode from "qrcode";
import { authenticator } from "otplib";
import { IQrCodeGenerator } from "../interfaces/qr-code-generator.interface";

export class QrCodeGenerator implements IQrCodeGenerator {
  constructor(private readonly appName: string) {}

  async generate(username: string, secret: string) {
    return qrcode
      .toDataURL(authenticator.keyuri(username, this.appName, secret))
      .then((image) => Promise.resolve({ image, username, secret }));
  }
}
