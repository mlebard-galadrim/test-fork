import { rawpost } from "./utils.service";

export const createContact = async (firstname, lastname, phone, email, subject, body) => {
  const res = await rawpost(`/contacts`, {
    firstname,
    lastname,
    phone,
    email,
    subject,
    body,
  });

  return res.status;
};
