import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, type AppState } from "../store/store";
import { sendAnalyticsAction } from "./send-analytics.action";

export const useTrackPageView = (page: string) => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: AppState) => state.auth);

  useEffect(() => {
    dispatch(
      sendAnalyticsAction({
        eventName: "pageview",
        userId: user?.id ?? "",
        page,
        timestamp: new Date().toISOString(),
      }),
    );
  }, [dispatch, page, user?.id]);
};
