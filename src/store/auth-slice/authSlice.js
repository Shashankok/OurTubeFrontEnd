import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  },
  reducers: {
    logIn: (state) => {
      state.isLoggedIn = true;
      localStorage.setItem("isLoggedIn", "true");
    },
    logOut: (state) => {
      state.isLoggedIn = false;
      localStorage.setItem("isLoggedIn", "false");
      localStorage.clear();
    },
  },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;
