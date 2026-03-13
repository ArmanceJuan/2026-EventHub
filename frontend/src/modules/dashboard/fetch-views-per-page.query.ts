import { AppDispatch, AppGetState } from "../store/store";
import {
  fetchViewsLoading,
  fetchViewsSuccess,
  fetchViewsError,
} from "./dashboard.slice";
import { fetchViewsPerPageApi } from "./fetch-analytics-data.api";

export const fetchViewsPerPage =
  () => async (dispatch: AppDispatch, _: AppGetState) => {
    try {
      dispatch(fetchViewsLoading());
      const data = await fetchViewsPerPageApi();
      dispatch(fetchViewsSuccess(data));
    } catch (error: any) {
      let message = "Erreur dashboard";
      if (error?.response?.data?.error?.message) {
        message = error.response.data.error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      dispatch(fetchViewsError(message));
    }
  };
