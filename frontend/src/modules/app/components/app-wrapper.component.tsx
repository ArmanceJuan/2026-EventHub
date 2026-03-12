import React from "react";
import { Provider } from "react-redux";
import { app } from "../main";
import { AuthProvider } from "../../store/auth-context.provider";
import { Hydrater } from "./hydrater.component";

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Provider store={app.store}>
      <Hydrater>
        <AuthProvider>{children}</AuthProvider>
      </Hydrater>
    </Provider>
  );
};
