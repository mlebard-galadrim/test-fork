import { State } from "react-native-gesture-handler";
import { findSegment } from "../../../utils/charts.utils";
import { scaleLinear } from "d3-scale";
import { useState } from "react";

type UseScopeProps = {
  scaleY: scaleLinear;
  scaleX: scaleLinear;
  MARGIN: number;
  OFFSET: number;
  size: number;
  segments: number[][];
};

export const UseScope = ({
  scaleY,
  scaleX,
  MARGIN,
  OFFSET,
  size,
  data,
  caliber,
}) => {
  const [scopeY, setScopeY] = useState(0);
  const [scopeX, setScopeX] = useState(0);
  const [showScope, setShowScope] = useState(false);

  const handleGesture = ({ nativeEvent }) => {
    // if (nativeEvent.y < MARGIN) {
    //   setScopeY(scaleY.invert(MARGIN));
    // } else if (nativeEvent.y > size + MARGIN) {
    //   setScopeY(scaleY.invert(size + MARGIN));
    // } else {
    //   setScopeY(scaleY.invert(nativeEvent.y));
    // }
    if (data) {
      if (nativeEvent.x < OFFSET) {
        setScopeX(scaleX.invert(OFFSET));
        setScopeY(findSegment(scaleX.invert(OFFSET), data));
      } else if (nativeEvent.x > size - caliber - MARGIN) {
        setScopeX(scaleX.invert(size - caliber - MARGIN));
        setScopeY(findSegment(scaleX.invert(size - caliber - MARGIN), data));
      } else {
        setScopeX(scaleX.invert(nativeEvent.x));
        setScopeY(findSegment(scaleX.invert(nativeEvent.x), data));
      }
    }
  };

  const handleStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      setShowScope(true);
    } else {
      setShowScope(false);
    }
  };

  return {
    scopeX,
    scopeY,
    handleGesture,
    handleStateChange,
    showScope,
  };
};
