import { createSlice } from "@reduxjs/toolkit";
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

// Funkcja pomocnicza do sprawdzania duplikatów
const isDuplicate = (contacts, newContact) => {
  const duplicateName = contacts.some(
    (contact) => contact.name.toLowerCase() === newContact.name.toLowerCase()
  );
  const duplicateNumber = contacts.some(
    (contact) => contact.number === newContact.number
  );

  if (duplicateName && duplicateNumber) {
    return "This name and number already exist.";
  } else if (duplicateName) {
    return "This name already exists.";
  } else if (duplicateNumber) {
    return "This number already exists.";
  }

  return null;
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState: {
    items: loadInitialContacts(),
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
      if (state.items.length === 0) {
        state.items = loadInitialContacts(); // Załaduj initialContacts, jeśli lista jest pusta
      }
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const { addContact, removeContact, clearErrors } = contactsSlice.actions;
export default contactsSlice.reducer;
