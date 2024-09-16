import { useState, useEffect } from "react";
import Contact from "../Contact/Contact";
import css from "./ContactList.module.css";

export default function ContactList() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Fetch contacts from backend
    fetch("https://66e2f551494df9a478e3c7ef.mockapi.io/Contacts")
      .then((response) => response.json())
      .then((data) => setContacts(data))
      .catch((error) => console.error("Error fetching contacts:", error));
  }, []);

  const handleDelete = (id) => {
    // Delete contact from backend
    fetch(`https://66e2f551494df9a478e3c7ef.mockapi.io/Contacts/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setContacts((prevContacts) =>
            prevContacts.filter((contact) => contact.id !== id)
          );
        } else {
          console.error("Error deleting contact:", response.statusText);
        }
      })
      .catch((error) => console.error("Error deleting contact:", error));
  };

  return (
    <ul className={css.contactList}>
      {contacts.map((contact) => (
        <li key={contact.id}>
          <Contact data={contact} onDelete={handleDelete} />
        </li>
      ))}
    </ul>
  );
}
