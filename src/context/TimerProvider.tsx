import React, { createContext, ReactElement, useContext } from "react";

interface ITimerContext {
  lastPinDate: Date;
}

interface Props {
  lastPinDate: Date;
  children: ReactElement;
}

const TimerContext = createContext<ITimerContext>({ lastPinDate: null });

export const usePinTimer = () => useContext(TimerContext);

export const TimerProvider = ({ lastPinDate, children }: Props) => (
  <TimerContext.Provider value={{ lastPinDate }}>{children}</TimerContext.Provider>
);
