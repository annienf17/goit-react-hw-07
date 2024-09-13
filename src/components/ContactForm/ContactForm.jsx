import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { nanoid } from "nanoid";
import css from "./ContactForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addContact, clearErrors } from "../../features/contacts/contactsSlice";

const ContactFormSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Imię może zawierać tylko litery i spacje")
    .required("Wypełnienie pola jest obowiązkowe")
    .min(3, "Minimalna liczba znaków to 3")
    .max(50, "Maksymalna liczba znaków to 50"),
  number: Yup.string()
    .matches(/^\d+(-\d+){0,2}$/, "Numer może zawierać tylko cyfry i myślniki")
    .required("Wypełnienie pola jest obowiązkowe")
    .min(3, "Minimalna liczba znaków to 3")
    .max(50, "Maksymalna liczba znaków to 50"),
});

export default function ContactForm() {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.contacts.error);

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const handleAdd = (values, { resetForm, setFieldError }) => {
    dispatch(
      addContact({
        id: nanoid(),
        name: values.name,
        number: values.number,
      })
    );

    if (error) {
      if (error.includes("name")) {
        setFieldError("name", error);
      }
      if (error.includes("number")) {
        setFieldError("number", error);
      }
    } else {
      resetForm();
    }
  };

  return (
    <Formik
      initialValues={{ name: "", number: "" }}
      validationSchema={ContactFormSchema}
      onSubmit={handleAdd}
    >
      {() => (
        <div className={css.formContainer}>
          <Form>
            <div className={css.formGroup}>
              <label>
                Imię
                <Field type="text" name="name" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={css.error}
                />
              </label>
            </div>
            <div className={css.formGroup}>
              <label>
                Numer
                <Field type="tel" name="number" />
                <ErrorMessage
                  name="number"
                  component="div"
                  className={css.error}
                />
              </label>
            </div>
            <div className={css.buttonContainer}>
              <button type="submit" className={css.button}>
                Add contact
              </button>
              {error && <div className={css.error}>{error}</div>}
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}
