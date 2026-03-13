import {
  asClass,
  asValue,
  createContainer,
  type AwilixContainer,
} from "awilix";

import { GetAnalyticsQuery } from "../../application/queries/get-analytics.query";
import { RecordAnalyticsCommand } from "../../application/commands/record-analytics.command";
import { MongoAnalyticsRepository } from "../../infrastructure/repositories/mongo-analytics-repository";
import { QrCodeGenerator } from "../../shared/utils/qr-code-generator";
import { getEnvVariable } from "../utility/utils";

type Dependencies = {
  appName: string;
  qrCodeGenerator: QrCodeGenerator;

  analyticsRepository: MongoAnalyticsRepository;
  recordAnalyticsCommand: RecordAnalyticsCommand;
  getAnalyticsQuery: GetAnalyticsQuery;
};

class Container {
  private awilix!: AwilixContainer<Dependencies>;

  init() {
    const appName = getEnvVariable("APP_NAME");

    const container = createContainer<Dependencies>();
    container.register({
      appName: asValue(appName),
      qrCodeGenerator: asClass(QrCodeGenerator).singleton(),

      analyticsRepository: asClass(MongoAnalyticsRepository).singleton(),
      recordAnalyticsCommand: asClass(RecordAnalyticsCommand).singleton(),
      getAnalyticsQuery: asClass(GetAnalyticsQuery).singleton(),
    });

    this.awilix = container;
  }

  resolve<K extends keyof Dependencies>(key: K): Dependencies[K] {
    if (!this.awilix) {
      this.init();
    }
    return this.awilix.resolve(key);
  }
}

const container = new Container();
export default container;
export type { Dependencies };
