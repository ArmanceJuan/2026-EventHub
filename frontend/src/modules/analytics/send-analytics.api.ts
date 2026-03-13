import { axiosWithoutAuthApi } from "../../services/axios-instance-api.service";
import type { AnalyticsEvent } from "./analytics.model";

export async function sendAnalytics(event: AnalyticsEvent): Promise<void> {
  await axiosWithoutAuthApi.post("/api/analytics", event);
}
