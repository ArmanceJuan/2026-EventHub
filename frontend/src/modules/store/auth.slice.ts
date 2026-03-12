import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  id: string;
  email: string;
  role: string;
};

export type AuthState = {
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  user: AuthUser;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  status: "idle",
  error: null,
  user: {
    id: "",
    email: "",
    role: "",
  },
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginLoading: (state) => {
      state.status = "loading";
      state.error = null;
      state.isAuthenticated = false;
      state.user = { id: "", email: "", role: "" };
    },
    loginSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.status = "success";
      state.error = null;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = { id: "", email: "", role: "" };
    },
    logout: (state) => {
      state.status = "idle";
      state.error = null;
      state.isAuthenticated = false;
      state.user = { id: "", email: "", role: "" };
    },
    hydrateAuth: (state, action: PayloadAction<AuthUser>) => {
      state.status = "success";
      state.error = null;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
  },
});

export const { loginLoading, loginSuccess, loginError, logout, hydrateAuth } =
  authSlice.actions;
export default authSlice.reducer;
