import { IAnalyticsRepository } from "../../domain/interfaces/analytics-repository.interface";

export class RecordAnalyticsCommand {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async execute(event: {
    eventName: string;
    userId: string;
    page: string;
    timestamp: Date;
  }): Promise<void> {
    await this.analyticsRepository.recordAnalytics(event);
  }
}
