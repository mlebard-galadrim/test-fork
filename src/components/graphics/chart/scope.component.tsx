import { Line, Rect, Text } from "react-native-svg";

import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { formatCurrency } from "../../../utils/currencies.utils";

export const Scope = ({ showScope, OFFSET, scaleY, scaleX, scopeX, scopeY, MARGIN, caliber, size, currency }) => {
  const timezone = useSelector((state: State) => state.appStore.timezone);
  const locale = useSelector((state: State) => state.appStore.locale);
  const textXPosition = scaleX(scopeX) > OFFSET + (size - OFFSET) / 2 ? -70 : 10;
  if (showScope) {
    return (
      <>
        <Line
          strokeDasharray="5, 5"
          x1={OFFSET + 0.5 * caliber}
          y1={scaleY(scopeY)}
          x2={size + 0.5 * caliber}
          y2={scaleY(scopeY)}
          stroke={colors.white}
          strokeWidth="1"
        />
        <Line
          strokeDasharray="5, 5"
          x1={scaleX(scopeX) + 0.5 * caliber}
          y1={MARGIN}
          x2={scaleX(scopeX) + 0.5 * caliber}
          y2={size + MARGIN}
          stroke={colors.white}
          strokeWidth="1"
        />
        <Rect x={scaleX(scopeX) + 0.5 * caliber + textXPosition - 5} y={scaleY(scopeY) - 23} width={70} height={20} fill={colors.white} rx={5} />
        <Text x={scaleX(scopeX) + 0.5 * caliber + textXPosition} y={scaleY(scopeY) - 10} stroke={colors.black} strokeWidth={0.9} fontSize={10}>
          {currency ? formatCurrency(currency, new Number(scopeY.toFixed(2))) : scopeY.toFixed(4)}
        </Text>
        <Rect
          x={scaleX(scopeX) + 0.5 * caliber + textXPosition - 5}
          y={size + 30 - 13} // + 30 pour éviter que la valeur aille derrière le date. Offset vers le bas
          width={70}
          height={30}
          fill={colors.white}
          rx={5}
        />
        <Text x={scaleX(scopeX) + 0.5 * caliber + textXPosition} y={size + 30} stroke={colors.black} strokeWidth={0.7} fontSize={10}>
          {unixToString(scopeX, timezone, locale)[0]}
        </Text>
        <Text x={scaleX(scopeX) + 0.5 * caliber + textXPosition} y={size + 30 + 12} stroke={colors.black} strokeWidth={0.7} fontSize={10}>
          {unixToString(scopeX, timezone, locale)[1]}
        </Text>
      </>
    );
  } else {
    return <></>;
  }
};

const unixToString = (unixDate, timezone, locale) => {
  const date = new Date(Number(unixDate));
  date.setSeconds(0, 0);
  return date
    .toISOString()
    .replace(/:00.000Z/, "")
    .split("T");
};
