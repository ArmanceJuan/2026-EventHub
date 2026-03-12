import { QrCodeGenerator } from "../../shared/utils/qr-code-generator";
import { getEnvVariable } from "../utility/utils";

type Dependencies = {
  appName: string;
  qrCodeGenerator: QrCodeGenerator;
};

class Container {
  private deps!: Dependencies;

  init() {
    const appName = getEnvVariable("APP_NAME");
    this.deps = {
      appName,
      qrCodeGenerator: new QrCodeGenerator(appName),
    };
  }

  resolve<K extends keyof Dependencies>(key: K): Dependencies[K] {
    if (!this.deps) {
      this.init();
    }
    return this.deps[key];
  }
}

const container = new Container();
export default container;
export type { Dependencies };
