import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: {
    name: "Shyam",
    email: "shyam.badgujar@Mitaoe.ac.in",
    phone: "7841083679"
  },
  isEditing: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    },
    updateProfileField(state, action) {
      state.profile[action.payload.field] = action.payload.value;
    },
    toggleEdit(state) {
      state.isEditing = !state.isEditing;
    }
  }
});

export const { setProfile, updateProfileField, toggleEdit } = userSlice.actions;
export default userSlice.reducer;
