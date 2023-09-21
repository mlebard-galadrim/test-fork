import i18n from "i18n-js";
import { useState } from "react";
import { Alert } from "react-native";
import { createContact } from "../../../services/contact.service";

export const useForm = (setSuccess) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [countryCode, setCountryCode] = useState("FR");
  const [phonePrefixes, setPhonePrefixes] = useState({});

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumberPrefix, setPhoneNumberPrefix] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mail, setMail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const closeCallback = (country?) => {
    if (country) {
      setCountryCode(country);
      setPhoneNumberPrefix(phonePrefixes[country]);
    }
    setShowDropdown(false);
  };

  const submitContact = () => {
    createContact(firstname, lastname, `${phoneNumberPrefix}${phoneNumber}`, mail, subject, body)
      .then((r) => {
        if (r === 204) {
          setSuccess(true);
        } else {
          Alert.alert(i18n.t("contactUs.form.fail.title"), i18n.t("contactUs.form.fail.body"));
        }
      })
      .catch((e) => console.warn(e));
  };

  return {
    showDropdown,
    setShowDropdown,
    countryCode,
    phonePrefixes,
    setPhonePrefixes,
    firstname,
    setFirstname,
    lastname,
    setLastname,
    phoneNumberPrefix,
    setPhoneNumberPrefix,
    phoneNumber,
    setPhoneNumber,
    mail,
    setMail,
    subject,
    setSubject,
    body,
    setBody,
    closeCallback,
    submitContact,
  };
};
