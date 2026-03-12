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
      console.log("[auth.actions][loginThunk] Start", {
        email,
        hasOtpCode: !!otpCode,
        hasBackupCode: !!backupCode,
      });
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

      console.log("[auth.actions][loginThunk] Response received", {
        success: response.data?.success,
        status: response.status,
      });

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

      console.log("[auth.actions][loginThunk] Login success", user);
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
      console.log("[auth.actions][hydrateAuthFromMe] Start");
      const response = await axiosWithAuthApi.get("/api/auth/me");

      console.log("[auth.actions][hydrateAuthFromMe] Response received", {
        success: response.data?.success,
        status: response.status,
      });

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

      console.log("[auth.actions][hydrateAuthFromMe] Hydration success", user);
      dispatch(hydrateAuth(user));
    } catch {
      console.warn("[auth.actions][hydrateAuthFromMe] Failed, dispatching logout");
      dispatch(logout());
    }
  };

export const logoutThunk =
  () => async (dispatch: AppDispatch, getState: AppGetState) => {
    try {
      console.log("[auth.actions][logoutThunk] Start");
      const response = await axiosWithAuthApi.post("/api/auth/logout");
      console.log("[auth.actions][logoutThunk] Response received", {
        success: response.data?.success,
        status: response.status,
      });
      dispatch(logout());
    } catch {
      console.warn("[auth.actions][logoutThunk] Request failed, forcing logout");
      dispatch(logout());
    }
  };
