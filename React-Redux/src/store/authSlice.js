import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fields: {
    username: "",
    password: ""
  },
  errors: {},
  isAuthenticated: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateField(state, action) {
      state.fields[action.payload.field] = action.payload.value;
    },
    loginSuccess(state) {
      state.isAuthenticated = true;
      state.errors = {};
    },
    loginFailure(state, action) {
      state.errors = action.payload;
    }
  }
});

export const { updateField, loginSuccess, loginFailure } = authSlice.actions;
export default authSlice.reducer;
