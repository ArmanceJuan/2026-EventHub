import { useEffect } from "react";
import { useAppDispatch } from "./store";
import { hydrateAuthFromMe } from "./auth.actions";

export const useHydrateAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("[useHydrateAuth] Dispatching hydrateAuthFromMe");
    dispatch(hydrateAuthFromMe());
  }, [dispatch]);
};
