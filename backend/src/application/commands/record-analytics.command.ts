import { IAnalyticsRepository } from "../../domain/interfaces/analytics-repository.interface";

export class RecordAnalyticsCommand {
  private analyticsRepository: IAnalyticsRepository;

  constructor({
    analyticsRepository,
  }: {
    analyticsRepository: IAnalyticsRepository;
  }) {
    this.analyticsRepository = analyticsRepository;
  }

  async execute(event: {
    eventName: string;
    userId: string;
    page: string;
    timestamp: Date;
  }) {
    await this.analyticsRepository.recordAnalytics(event);
  }
}
