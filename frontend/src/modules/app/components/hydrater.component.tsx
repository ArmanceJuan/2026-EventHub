import type React from "react";
import { useHydrateAuth } from "../../store/use-hydrate-auth.hook";

export const Hydrater: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useHydrateAuth();
  return <>{children}</>;
};
