import { createSlice, nanoid } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: { items: [] },
  reducers: {
    addToast: {
      reducer(state, action) {
        // Avoid stacking the same message several times
        if (state.items.some((t) => t.message === action.payload.message)) return;
        state.items.push(action.payload);
      },
      prepare(type, message) {
        return { payload: { id: nanoid(), type, message } };
      },
    },
    removeToast(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;