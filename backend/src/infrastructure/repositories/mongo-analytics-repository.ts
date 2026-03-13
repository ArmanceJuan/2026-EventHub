import { IAnalyticsRepository } from "../../domain/interfaces/analytics-repository.interface";
import { EventModel } from "../../domain/models/event-analytics.model";

export class MongoAnalyticsRepository implements IAnalyticsRepository {
  async recordAnalytics(event: {
    eventName: string;
    userId: string;
    page: string;
    timestamp: Date;
  }): Promise<void> {
    await EventModel.create(event);
  }

  async getAnalytics(): Promise<{ _id: string; count: number }[]> {
    const result = await EventModel.aggregate([
      { $match: { eventName: "pageview" } },
      { $group: { _id: "$page", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return result;
  }
}
