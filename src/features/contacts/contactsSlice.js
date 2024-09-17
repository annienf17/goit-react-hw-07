import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import api from "../../api";

// Async thunk to fetch contacts
export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async () => {
    const response = await api.get("/");
    return response.data;
  }
);

// Async thunk to add a contact
export const addContact = createAsyncThunk(
  "contacts/addContact",
  async (contact) => {
    const response = await api.post("/", contact);
    return response.data;
  }
);

// Async thunk to delete a contact
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (id) => {
    await api.delete(`/${id}`);
    return id;
  }
);

const contactsSlice = createSlice({
  name: "contacts",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (contact) => contact.id !== action.payload
        );
      });
  },
});

// Selector to get the contacts state
const selectContactsState = (state) => state.contacts;

// Memoized selector to filter contacts
export const selectFilteredContacts = createSelector(
  [selectContactsState],
  (contactsState) => {
    // Replace the condition with your filtering logic
    return contactsState.items.filter((contact) => contact.isActive);
  }
);

export default contactsSlice.reducer;
