import React from "react";
import { Provider } from "react-redux";
import { app } from "../main";
import { AuthProvider } from "../../store/auth-context.provider";

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Provider store={app.store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
};
