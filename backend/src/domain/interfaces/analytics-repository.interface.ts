export interface IAnalyticsRepository {
  recordAnalytics(event: {
    eventName: string;
    userId: string;
    page: string;
    timestamp: Date;
  }): Promise<void>;

  getAnalytics(): Promise<{ _id: string; count: number }[]>;
}
