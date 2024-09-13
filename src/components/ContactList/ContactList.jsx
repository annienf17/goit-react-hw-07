import { useSelector, useDispatch } from "react-redux";
import Contact from "../Contact/Contact";
import css from "./ContactList.module.css";
import { removeContact } from "../../features/contacts/contactsSlice";
import { selectFilteredContacts } from "../../features/contacts/selectors";

export default function ContactList() {
  const filteredContacts = useSelector(selectFilteredContacts);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(removeContact(id));
  };

  return (
    <ul className={css.contactList}>
      {filteredContacts.map((contact) => (
        <li key={contact.id}>
          <Contact data={contact} onDelete={handleDelete} />
        </li>
      ))}
    </ul>
  );
}
