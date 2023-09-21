import { Line } from "react-native-svg";
import React from "react";
import colors from "../../../themes/colors.theme";

export const Segment = ({
  segment,
  caliber,
  scaleY,
  scaleX,
  color = colors.gold,
}) => {
  const MARGIN = 2;
  return (
    <Line
      x1={scaleX(segment[2]) + 0.5 * (caliber - 2 * MARGIN)}
      x2={scaleX(segment[3]) + 0.5 * (caliber - 2 * MARGIN)}
      y1={scaleY(segment[0])}
      y2={scaleY(segment[1])}
      stroke={color}
      strokeWidth={1}
    />
  );
};
