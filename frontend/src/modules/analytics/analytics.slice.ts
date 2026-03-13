import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AnalyticsState = {
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
};

const initialState: AnalyticsState = {
  status: "idle",
  error: null,
};

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    sendAnalyticsLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },
    sendAnalyticsSuccess: (state) => {
      state.status = "success";
      state.error = null;
    },
    sendAnalyticsError: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
    },
  },
});

export const {
  sendAnalyticsLoading,
  sendAnalyticsSuccess,
  sendAnalyticsError,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
