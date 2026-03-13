import type { AppDispatch, AppGetState } from "./store";
import {
  loginLoading,
  loginSuccess,
  loginError,
  hydrateAuth,
  logout,
  type AuthUser,
} from "./auth.slice";
import {
  axiosWithoutAuthApi,
  axiosWithAuthApi,
} from "../../services/axios-instance-api.service";

export const loginThunk =
  (email: string, password: string, otpCode?: string, backupCode?: string) =>
  async (dispatch: AppDispatch, getState: AppGetState) => {
    try {
      dispatch(loginLoading());

      const payload: {
        email: string;
        password: string;
        otpCode?: string;
        backupCode?: string;
      } = { email, password };

      if (otpCode) payload.otpCode = otpCode;
      if (!otpCode && backupCode) payload.backupCode = backupCode;

      const response = await axiosWithoutAuthApi.post(
        "/api/auth/login",
        payload,
      );

      if (!response.data.success) {
        throw new Error(response.data.error?.message || "Erreur inconnue");
      }

      const userFromApi = response.data.data.user as {
        id: string;
        email: string;
        role: string;
      };

      const user: AuthUser = {
        id: userFromApi.id,
        email: userFromApi.email,
        role: userFromApi.role,
      };

      dispatch(loginSuccess(user));
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Une erreur inattendue est survenue";
      console.error("[auth.actions][loginThunk] Error", message, error);
      dispatch(loginError(message));
      throw error;
    }
  };

export const hydrateAuthFromMe =
  () => async (dispatch: AppDispatch, getState: AppGetState) => {
    try {
      const response = await axiosWithAuthApi.get("/api/auth/me");

      if (!response.data.success) {
        return;
      }

      const userFromApi = response.data.data.user as {
        id: string;
        email: string;
        role: string;
      };

      const user: AuthUser = {
        id: userFromApi.id,
        email: userFromApi.email,
        role: userFromApi.role,
      };

      dispatch(hydrateAuth(user));
    } catch {
      dispatch(logout());
    }
  };

export const logoutThunk =
  () => async (dispatch: AppDispatch, getState: AppGetState) => {
    try {
      const response = await axiosWithAuthApi.post("/api/auth/logout");
      dispatch(logout());
    } catch {
      dispatch(logout());
    }
  };
