import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContacts,
  deleteContact,
} from "../../features/contacts/contactsSlice";
import Contact from "../Contact/Contact";

const ContactList = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts.items);
  const loading = useSelector((state) => state.contacts.loading);
  const error = useSelector((state) => state.contacts.error);
  const filter = useSelector((state) => state.filters.status);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteContact(id));
  };

  const filteredContacts = filter
    ? contacts.filter((contact) =>
        contact.name.toLowerCase().includes(filter.toLowerCase())
      )
    : contacts;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {filteredContacts.map((contact) => (
        <li key={contact.id}>
          <Contact data={contact} onDelete={handleDelete} />
        </li>
      ))}
    </ul>
  );
};

export default ContactList;
