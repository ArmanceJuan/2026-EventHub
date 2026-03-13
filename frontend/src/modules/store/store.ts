import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import type { Dependencies } from "./dependencies";
import authReducer from "./auth.slice";
import userReducer from "./user.slice";
import analyticsReducer from "../analytics/analytics.slice";
import dashboardReducer from "../dashboard/dashboard.slice";

const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  analytics: analyticsReducer,
  dashboard: dashboardReducer,
});
export type AppStore = ReturnType<typeof createStore>;
export type AppState = ReturnType<typeof reducers>;
export type AppDispatch = AppStore["dispatch"];
export type AppGetState = AppStore["getState"];

export const createStore = (config: { dependencies: Dependencies }) => {
  const store = configureStore({
    reducer: reducers,
    devTools: true,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: config.dependencies,
        },
      });
    },
  });
  return store;
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
