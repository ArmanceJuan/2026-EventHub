import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { axiosWithoutAuthApi } from "../../services/axios-instance-api.service";

type User = {
  id: string;
  email: string;
  role?: string;
};

type AuthContextType = {
  currentUser: User | null;
  token: string | null;
  register: (email: string, password: string) => Promise<void>;
  login: (
    email: string,
    password: string,
    otpCode?: string,
    backupCode?: string,
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "eventhub_token";

function decodeJwtPayload(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      setToken(saved);
      const payload = decodeJwtPayload(saved);
      if (payload?.id) {
        setCurrentUser({
          id: payload.id,
          email: payload.email ?? "unknown",
          role: payload.role,
        });
      }
    }
  }, []);

  const setSession = (jwt: string) => {
    localStorage.setItem(TOKEN_KEY, jwt);
    setToken(jwt);

    const payload = decodeJwtPayload(jwt);
    if (payload?.id) {
      setCurrentUser({
        id: payload.id,
        email: payload.email ?? "unknown",
        role: payload.role,
      });
    } else {
      setCurrentUser(null);
    }
  };

  const register = async (email: string, password: string) => {
    await axiosWithoutAuthApi.post("/api/auth/register", {
      email,
      password,
      role: "ORGANIZER",
    });
  };

  const login = async (
    email: string,
    password: string,
    otpCode?: string,
    backupCode?: string,
  ) => {
    const res = await axiosWithoutAuthApi.post("/api/auth/login", {
      email,
      password,
      ...(otpCode ? { otpCode } : {}),
      ...(backupCode ? { backupCode } : {}),
    });

    const jwt =
      res.data?.token ??
      res.data?.data?.token ??
      res.data?.accessToken ??
      res.data?.data?.accessToken;

    if (!jwt) {
      throw new Error("Token manquant dans la réponse du backend.");
    }

    setSession(jwt);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({ currentUser, token, register, login, logout }),
    [currentUser, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
