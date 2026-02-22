import { createSlice } from "@reduxjs/toolkit";

const validationSlice = createSlice({
  name: "validation",
  initialState: {
    rules: {
      name: /^[A-Za-z ]+$/,
      phone: /^[0-9]{10}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    messages: {
      name: "Name should contain only letters",
      phone: "Phone must be 10 digits"
    }
  },
  reducers: {}
});

export default validationSlice.reducer;
