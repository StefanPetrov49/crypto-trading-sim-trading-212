import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  isLoading: false,
  error: false,
  isLoggedIn: false,
  data: null,
  createUser: {
    data: {},
    isLoading: false,
    error: null,
  }
};

const storedUserData =
  typeof window !== "undefined" ? localStorage.getItem("userData") : null;

const userSlice = createSlice({
  name: "user",
  initialState: storedUserData
    ? {
      ...initialState,
      data: JSON.parse(storedUserData),
      isLoggedIn: true,
    }
    : initialState,
  reducers: {
    createUserStart: (state) => {
      state.createUser.isLoading = true;
      state.createUser.error = null;
    },
    createUserSuccess: (state, action) => {
      state.createUser.isLoading = false;
      state.createUser.data = action.payload;
      state.createUser.error = null;
    },
    createUserFailure: (state, action) => {
      state.createUser.isLoading = false;
      state.createUser.error = action.payload;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.data = action.payload.data;
      Cookies.set("token", action.payload.token);
      if (typeof window !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(action.payload.data));
      }
    },
    logout: (state) => {
      state.isLoading = false;
      state.error = false;
      state.isLoggedIn = false;
      state.data = null;
      Cookies.remove("token");
      localStorage.removeItem("userData");
    },
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginFailure: (state) => {
      state.isLoading = false;
      state.error = true;
    }
  },
});

export const {
  createUserStart,
  createUserSuccess,
  createUserFailure,
  loginSuccess,
  loginStart,
  loginFailure,
  logout
} = userSlice.actions;
export default userSlice.reducer;
