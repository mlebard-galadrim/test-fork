import { Line, Rect } from "react-native-svg";

import React from "react";
import colors from "../../../themes/colors.theme";

const MARGIN = 2;
export const Candle = ({
  candle: { low, high, open, close, date },
  caliber,
  scaleY,
  scaleX,
  scaleBody,
}) => {
  const unixDate = new Date(date).getTime();
  const color = open > close ? colors.danger : colors.success;
  return (
    <>
      <Line
        x1={scaleX(unixDate) + 0.5 * (caliber - 2 * MARGIN)}
        x2={scaleX(unixDate) + 0.5 * (caliber - 2 * MARGIN)}
        y1={scaleY(high)}
        y2={scaleY(low)}
        stroke={color}
        strokeWidth={1}
      />
      <Rect
        x={scaleX(unixDate)}
        y={scaleY(Math.max(open, close))}
        width={caliber - 2 * MARGIN}
        height={scaleBody(Math.max(open, close) - Math.min(open, close))}
        fill={color}
      />
    </>
  );
};
