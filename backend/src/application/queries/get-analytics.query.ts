import { IAnalyticsRepository } from "../../domain/interfaces/analytics-repository.interface";

export class GetAnalyticsQuery {
  private analyticsRepository: IAnalyticsRepository;

  constructor({
    analyticsRepository,
  }: {
    analyticsRepository: IAnalyticsRepository;
  }) {
    this.analyticsRepository = analyticsRepository;
  }

  async execute(): Promise<{ _id: string; count: number }[]> {
    return this.analyticsRepository.getAnalytics();
  }
}
