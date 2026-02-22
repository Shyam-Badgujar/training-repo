import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import validationReducer from "./validationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    validation: validationReducer
  }
});
export default store;
