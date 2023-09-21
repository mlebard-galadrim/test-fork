import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Keyboard } from "react-native";
import { signin } from "../../services/auth.service";

export const UseLoginForm = () => {
  const navigation = useNavigation();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [stepCompleted, setStepCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNextStepPress = () => {
    signin({ email: mail, password: password })
      .then((r) => {
        Keyboard.dismiss();
        navigation.navigate("PinSetup", {
          token: r.token,
          refresh_token: r.refresh_token,
        });
      })
      .catch((err) => {
        setErrorMessage("Invalid credentials");
      });
  };

  return {
    mail,
    setMail,
    password,
    setPassword,
    stepCompleted,
    setStepCompleted,
    errorMessage,
    handleNextStepPress,
  };
};
