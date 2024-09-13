import { createSlice } from "@reduxjs/toolkit";

const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    status: "all",
    filter: "", // Dodane pole filter do stanu
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload; // Ustawienie wartości filtra
    },
    setStatus: (state, action) => {
      state.status = action.payload; // Ustawienie statusu
    },
  },
});

export const { setFilter, setStatus } = filtersSlice.actions;
export default filtersSlice.reducer;
