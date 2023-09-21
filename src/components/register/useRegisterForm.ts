import { useState } from "react";
import { useDispatch } from "react-redux";
import RegisterSlice from "../../store/slices/register.slice";

export const UseRegisterForm = () => {
  const dispatch = useDispatch();

  const [stepCompleted, setStepCompleted] = useState(false);

  const onMailChange = (text) => {
    dispatch(RegisterSlice.actions.setMail(text));
  };
  const onFirstnameChange = (text) => {
    dispatch(RegisterSlice.actions.setFirstname(text));
  };
  const onLastNameChange = (text) => {
    dispatch(RegisterSlice.actions.setLastname(text));
  };
  const onPasswordChange = (text) => {
    dispatch(RegisterSlice.actions.setPassword(text));
  };
  const onSecondPasswordChange = (text) => {
    dispatch(RegisterSlice.actions.setSecondPassword(text));
  };
  const onTosSwitched = () => {
    dispatch(RegisterSlice.actions.switchTosRead());
  };
  const onCompanyNameChange = (text) => {
    dispatch(RegisterSlice.actions.setCompanyName(text));
  };

  return {
    stepCompleted,
    setStepCompleted,
    onMailChange,
    onCompanyNameChange,
    onFirstnameChange,
    onLastNameChange,
    onPasswordChange,
    onSecondPasswordChange,
    onTosSwitched,
  };
};
