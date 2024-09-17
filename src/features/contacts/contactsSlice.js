import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import contactsData from "../../contacts.json";
import { nanoid } from "nanoid";

// Ładowanie początkowych kontaktów z localStorage lub użycie domyślnych kontaktów
const loadInitialContacts = () => {
  const savedContacts = localStorage.getItem("contacts");
  if (savedContacts) {
    const parsedContacts = JSON.parse(savedContacts);
    if (parsedContacts.length > 0) {
      return parsedContacts;
    }
  }
  const initialContacts = contactsData.map((contact) => ({
    ...contact,
    id: nanoid(),
  }));
  return initialContacts;
};

// Asynchroniczne generatory akcji
export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async () => {
    const response = await axios.get(
      "https://66e2f551494df9a478e3c7ef.mockapi.io/Contacts"
    );
    return response.data;
  }
);

export const addContactAsync = createAsyncThunk(
  "contacts/addContactAsync",
  async (newContact) => {
    const response = await axios.post(
      "https://66e2f551494df9a478e3c7ef.mockapi.io/Contacts",
      newContact
    );
    return response.data;
  }
);

export const deleteContactAsync = createAsyncThunk(
  "contacts/deleteContactAsync",
  async (contactId) => {
    await axios.delete(
      `https://66e2f551494df9a478e3c7ef.mockapi.io/Contacts/${contactId}`
    );
    return contactId;
  }
);

// Funkcja pomocnicza do sprawdzania duplikatów
const isDuplicate = (contacts, newContact) => {
  const duplicateContact = contacts.find(
    (contact) =>
      contact.name.toLowerCase() === newContact.name.toLowerCase() &&
      contact.number === newContact.number
  );

  if (duplicateContact) {
    return "This name and number already exist.";
  }

  const duplicateName = contacts.some(
    (contact) => contact.name.toLowerCase() === newContact.name.toLowerCase()
  );

  const duplicateNumber = contacts.some(
    (contact) => contact.number === newContact.number
  );

  if (duplicateName) {
    return "This name already exists.";
  } else if (duplicateNumber) {
    return "This number already exists.";
  }

  return null;
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addContact: (state, action) => {
      const errorMessage = isDuplicate(state.items, action.payload);
      if (errorMessage) {
        state.error = errorMessage;
      } else {
        state.items.push(action.payload);
        state.error = null;
      }
    },
    removeContact: (state, action) => {
      state.items = state.items.filter(
        (contact) => contact.id !== action.payload
      );
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addContactAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteContactAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (contact) => contact.id !== action.payload
        );
      });
  },
});

export const { addContact, removeContact, clearErrors } = contactsSlice.actions;
export default contactsSlice.reducer;
