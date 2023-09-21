import { Line } from "react-native-svg";
import React from "react";
import colors from "../../../themes/colors.theme";

export const Grid = ({ size, OFFSET, TOPMARGIN }) => {
  return (
    <>
      <Line
        x1={OFFSET}
        y1={0 + TOPMARGIN}
        x2={size}
        y2={0 + TOPMARGIN}
        stroke={colors.transparent3}
        strokeWidth="1"
      />
      <Line
        x1={OFFSET}
        y1={size / 4 + TOPMARGIN}
        x2={size}
        y2={size / 4 + TOPMARGIN}
        stroke={colors.transparent3}
        strokeWidth="1"
      />
      <Line
        x1={OFFSET}
        y1={(2 * size) / 4 + TOPMARGIN}
        x2={size}
        y2={(2 * size) / 4 + TOPMARGIN}
        stroke={colors.transparent3}
        strokeWidth="1"
      />
      <Line
        x1={OFFSET}
        y1={(3 * size) / 4 + TOPMARGIN}
        x2={size}
        y2={(3 * size) / 4 + TOPMARGIN}
        stroke={colors.transparent3}
        strokeWidth="1"
      />
      <Line
        x1={OFFSET}
        y1={size + TOPMARGIN}
        x2={size}
        y2={size + TOPMARGIN}
        stroke={colors.transparent3}
        strokeWidth="1"
      />
    </>
  );
};
