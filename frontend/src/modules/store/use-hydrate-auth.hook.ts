import { useEffect } from "react";
import { useAppDispatch } from "./store";
import { hydrateAuthFromMe } from "./auth.actions";

export const useHydrateAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateAuthFromMe());
  }, [dispatch]);
};
