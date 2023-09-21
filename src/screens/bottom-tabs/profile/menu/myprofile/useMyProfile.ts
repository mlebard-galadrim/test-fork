import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getPhonePrefixesCollection } from "../../../../../services/static/phone-prefixes.service";
import { postAddressDocument, postBankDocument, postIdentityDocument } from "../../../../../services/users.service";
import colors from "../../../../../themes/colors.theme";
import { loadProfileInfo } from "../../../../../utils/auth.utils";

const checkIcon = require("../../../../../../assets/icons/profile/status/icons-espace-client-check.png");
const waitIcon = require("../../../../../../assets/icons/profile/status/icons-espace-client-wait.png");
const notValidIcon = require("../../../../../../assets/icons/profile/status/icons-espace-client-not-valid.png");

export const useMyProfile = () => {
  const navigation = useNavigation();

  const titleColors = {
    1: {
      color: colors.white,
      icon: checkIcon,
    },
    2: {
      color: colors.text.orange,
      icon: waitIcon,
    },
    3: {
      color: colors.text.red,
      icon: notValidIcon,
    },
  };

  const [statusDocumentList, setStatusDocumentList] = useState([]);
  const [addressDocumentList, setAddressDocumentList] = useState([]);
  const [bankDocumentList, setBankDocumentList] = useState([]);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phonePrefixes, setPhonePrefixes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [countryCode, setCountryCode] = useState("FR");

  const canUpload = (currentStatus: number) => {
    return currentStatus !== 1 && currentStatus !== 2;
  };

  const resetDocuments = () => {
    setStatusDocumentList([]);
    setAddressDocumentList([]);
    setBankDocumentList([]);
  };

  const uploadDocuments = async () => {
    try {
      if (statusDocumentList.length > 0) {
        const data = new FormData();
        data.append("mobilePhone[prefix]", countryCode);
        data.append("mobilePhone[number]", phoneNumber);
        statusDocumentList.map((doc) => {
          data.append("idCards[][file]", doc, doc.name);
        });
        const res = await postIdentityDocument(data);
      }
      if (addressDocumentList.length > 0) {
        const data = new FormData();
        addressDocumentList.map((doc) => {
          data.append("proofsOfResidence[][file]", doc, doc.name);
        });
        const res = await postAddressDocument(data);
      }
      if (bankDocumentList.length > 0) {
        const data = new FormData();
        bankDocumentList.map((doc) => {
          data.append("ibans[][file]", doc, doc.name);
        });
        const res = await postBankDocument(data);
      }
      resetDocuments();
      loadProfileInfo();
    } catch (error) {
      resetDocuments();
      Alert.alert("Error", "An error occured while uploading your document. Please try again later or contact our support.");
    }
  };

  useEffect(() => {
    loadProfileInfo();
    getPhonePrefixesCollection().then((r) => {
      setPhonePrefixes(r._embedded.items);
    });
  }, []);

  const closeCallback = (country?) => {
    if (country) {
      setCountryCode(country);
    }
    setShowDropdown(false);
  };

  return {
    navigation,
    titleColors,
    countryCode,
    setPhoneNumber,
    phonePrefixes,
    showDropdown,
    setShowDropdown,
    statusDocumentList,
    setStatusDocumentList,
    addressDocumentList,
    setAddressDocumentList,
    bankDocumentList,
    setBankDocumentList,
    closeCallback,
    phoneNumber,
    canUpload,
    uploadDocuments,
  };
};
