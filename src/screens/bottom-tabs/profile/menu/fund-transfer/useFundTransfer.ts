import { useEffect, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getBankAccounts } from "./../../../../../services/bank-account.service";

export const UseFundTransfer = () => {
  const navigation = useNavigation();
  const currency = useSelector((state: any) => state.preferencesStore.currency);
  const [selected, setSelected] = useState<string>(currency);
  const [bankInformation, setBankInformation] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getBankAccounts(selected);
      setBankInformation(res);
    })();
  }, [selected]);
  return {
    navigation,
    selected,
    setSelected,
    bankInformation,
  };
};
