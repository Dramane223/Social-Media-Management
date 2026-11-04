import { createSlice } from "@reduxjs/toolkit";

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const initialState = {
  token: localStorage.getItem("token"),
  user: loadUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { token, username, email } = action.payload;
      state.token = token;
      state.user = { username, email };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;