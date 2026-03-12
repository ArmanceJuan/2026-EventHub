export interface IQrCodeGenerator {
  generate(username: string, secret: string): Promise<object>;
}
