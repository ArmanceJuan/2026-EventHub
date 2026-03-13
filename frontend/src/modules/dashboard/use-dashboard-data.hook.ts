import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, type AppState } from "../store/store";
import { fetchViewsPerPage } from "./fetch-views-per-page.query";

export const useDashboardData = () => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useSelector(
    (state: AppState) => state.dashboard,
  );

  useEffect(() => {
    console.log("Dispatching fetchViewsPerPage..."); // ← ajouter
    dispatch(fetchViewsPerPage());
  }, [dispatch]);

  return { data, status, error };
};
