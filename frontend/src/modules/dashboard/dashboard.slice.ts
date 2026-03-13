import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type PageViewData = {
  _id: string;
  count: number;
};

export type DashboardState = {
  status: "idle" | "loading" | "success" | "error";
  data: PageViewData[];
  error: string | null;
};

const initialState: DashboardState = {
  status: "idle",
  data: [],
  error: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    fetchViewsLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },
    fetchViewsSuccess: (state, action: PayloadAction<PageViewData[]>) => {
      state.status = "success";
      state.data = action.payload;
      state.error = null;
    },
    fetchViewsError: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
    },
  },
});

export const { fetchViewsLoading, fetchViewsSuccess, fetchViewsError } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
