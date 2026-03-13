import type { AppDispatch, AppGetState } from "../store/store";
import type { AnalyticsEvent } from "./analytics.model";
import {
  sendAnalyticsLoading,
  sendAnalyticsSuccess,
  sendAnalyticsError,
} from "./analytics.slice";
import { sendAnalytics } from "./send-analytics.api";

export const sendAnalyticsAction =
  (event: AnalyticsEvent) => async (dispatch: AppDispatch, _: AppGetState) => {
    try {
      dispatch(sendAnalyticsLoading());
      await sendAnalytics(event);
      dispatch(sendAnalyticsSuccess());
    } catch (error: any) {
      let message = "Une erreur est survenue";
      if (error?.response?.data?.error?.message) {
        message = error.response.data.error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      dispatch(sendAnalyticsError(message));
    }
  };
