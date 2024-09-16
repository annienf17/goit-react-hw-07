/* eslint-disable react/prop-types */
import { HiUser, HiPhone } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { removeContact } from "../../features/contacts/contactsSlice";
import css from "./Contact.module.css";

export default function Contact({ data: { id, name, phone } }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(removeContact(id));
  };

  return (
    <div className={css.contactContainer}>
      <ul className={css.contactList}>
        <li className={css.listItem}>
          <HiUser className={css.icon} size="20" />
          {name}
        </li>
        <li className={css.listItem}>
          <HiPhone className={css.icon} size="20" /> {phone}
        </li>
      </ul>

      <button className={css.button} onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}
