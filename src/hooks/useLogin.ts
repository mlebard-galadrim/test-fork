import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { State } from "../store/configure.store";

export const useLogin = () => {
  const auth = useSelector((state: State) => state.authStore);
  const { shouldAskPin, lastPinDate, now } = useSelector((state: State) => state.appStore);
  const [logged, setLogged] = useState<boolean>(false);

  useEffect(() => {
    setLogged(auth.token !== null);
  }, [auth]);

  return { logged, lastPinDate, shouldAskPin, now };
};
