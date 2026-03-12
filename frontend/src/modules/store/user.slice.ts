import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./user.model";

interface UserState {
  users: User[];
  currentUser: User | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    registerUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
      state.currentUser = action.payload;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    loginFailure(state) {
      state.currentUser = null;
    },
    updateUser(state, action: PayloadAction<User>) {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) state.users[index] = action.payload;
      state.currentUser = action.payload;
    },
    logout(state) {
      state.currentUser = null;
    },
  },
});

export const { registerUser, loginSuccess, loginFailure, updateUser, logout } =
  userSlice.actions;

export default userSlice.reducer;
