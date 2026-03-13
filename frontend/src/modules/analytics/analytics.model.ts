export type AnalyticsEventName = "pageview" | "buy-ticket";

export interface AnalyticsEvent {
  eventName: AnalyticsEventName;
  userId: string | null;
  page: string;
  timestamp: string;
}
