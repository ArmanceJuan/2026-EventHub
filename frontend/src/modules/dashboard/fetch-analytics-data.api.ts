import { axiosWithAuthApi } from "../../services/axios-instance-api.service";
import type { PageViewData } from "./dashboard.slice";

export async function fetchViewsPerPageApi(): Promise<PageViewData[]> {
  const response = await axiosWithAuthApi.get("/api/analytics");
  return response.data.data as PageViewData[];
}
