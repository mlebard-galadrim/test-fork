import React from "react";
import { Text } from "react-native-svg";
import colors from "../../../themes/colors.theme";
import { formatCurrency } from "../../../utils/currencies.utils";

const HORIZONTALOFFSET = 30;

export const Labels = ({ size, caliber, TOPMARGIN, scaleY, scaleX, currency = false, MARGIN, OFFSET }) => {
  return (
    <>
      <Text x={"0"} y={0 + 4 + TOPMARGIN} stroke={colors.white} strokeWidth={1} fontSize={10}>
        {currency ? formatCurrency(currency, scaleY.invert(0).toFixed(2)) : scaleY.invert(MARGIN).toFixed(4)}
      </Text>
      <Text x={"0"} y={size / 4 + 4 + TOPMARGIN} stroke={colors.white} strokeWidth={1} fontSize={10}>
        {currency ? formatCurrency(currency, scaleY.invert(size / 4).toFixed(2)) : scaleY.invert(MARGIN + size / 4).toFixed(4)}
      </Text>
      <Text x={"0"} y={(2 * size) / 4 + 4 + TOPMARGIN} stroke={colors.white} strokeWidth={1} fontSize={10}>
        {currency ? formatCurrency(currency, scaleY.invert((2 * size) / 4).toFixed(2)) : scaleY.invert((MARGIN + 2 * size) / 4).toFixed(4)}
      </Text>
      <Text x={"0"} y={(3 * size) / 4 + 4 + TOPMARGIN} stroke={colors.white} strokeWidth={1} fontSize={10}>
        {currency ? formatCurrency(currency, scaleY.invert((3 * size) / 4).toFixed(2)) : scaleY.invert((MARGIN + 3 * size) / 4).toFixed(4)}
      </Text>
      <Text x={"0"} y={size + 4 + TOPMARGIN} stroke={colors.white} strokeWidth={1} fontSize={10}>
        {currency ? formatCurrency(currency, scaleY.invert(size).toFixed(2)) : scaleY.invert(MARGIN + size).toFixed(4)}
      </Text>

      {/* X AXIS LABEL */}

      <Text x={OFFSET - HORIZONTALOFFSET} y={size + 4 + 2 * TOPMARGIN} stroke={colors.white} strokeWidth={1} fontSize={10}>
        {unixToString(scaleX.invert(OFFSET).toFixed(0))}
      </Text>
      <Text x={OFFSET + (size - OFFSET) / 2 - 2 * HORIZONTALOFFSET} y={size + 4 + 2 * TOPMARGIN} stroke={colors.white} strokeWidth={1} fontSize={10}>
        {unixToString(scaleX.invert(OFFSET + (size - OFFSET) / 2 - HORIZONTALOFFSET).toFixed(0))}
      </Text>
      <Text x={size - OFFSET - 20} y={size + 4 + 2 * TOPMARGIN} stroke={colors.white} strokeWidth={1} fontSize={10}>
        {unixToString(scaleX.invert(size - caliber - MARGIN).toFixed(0))}
      </Text>
    </>
  );
};

const unixToString = (unixDate) => {
  const date = new Date(Number(unixDate));
  return date.toISOString().split("T")[0];
};
