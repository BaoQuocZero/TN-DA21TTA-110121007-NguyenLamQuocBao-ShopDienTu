// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import languageReducer from "./languageSlice";
const store = configureStore({
  reducer: {
    auth: authReducer, ///
    language: languageReducer,
  },
});

export default store;
