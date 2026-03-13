import { IAnalyticsRepository } from "../../domain/interfaces/analytics-repository.interface";

export class GetAnalyticsQuery {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async execute(): Promise<{ _id: string; count: number }[]> {
    return this.analyticsRepository.getAnalytics();
  }
}
