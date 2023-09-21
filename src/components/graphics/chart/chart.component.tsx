import { scaleLinear } from "d3-scale";
import React from "react";
import { PanGestureHandler } from "react-native-gesture-handler";
import Svg from "react-native-svg";
import colors from "../../../themes/colors.theme";
import { Candle } from "./candle.component";
import { Grid } from "./grid.component";
import { Labels } from "./labels.component";
import { Scope } from "./scope.component";
import { Segment } from "./segment.component";
import { UseScope } from "./useScope";

const MARGIN = 20;
export const Chart = ({ data, data3 = undefined, data2 = undefined, data4 = undefined, caliber = 1, size, domain, dateDomain, currency }) => {
  const OFFSET = 60;
  const scaleY = scaleLinear()
    .domain(domain)
    .range([size + MARGIN, MARGIN]);
  const scaleX = scaleLinear()
    .domain(dateDomain)
    .range([OFFSET, size - caliber - MARGIN]);
  const scaleBody = scaleLinear()
    .domain([0, domain[1] - domain[0]])
    .range([0, size]);

  const { scopeX, scopeY, handleGesture, handleStateChange, showScope } = UseScope({
    scaleY,
    scaleX,
    size,
    MARGIN,
    OFFSET,
    data,
    caliber,
  });
  return (
    <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleStateChange}>
      <Svg width={size - MARGIN} height={size + 3 * MARGIN}>
        <Grid size={size} OFFSET={OFFSET} TOPMARGIN={MARGIN} />
        <Labels
          size={size}
          caliber={caliber}
          TOPMARGIN={MARGIN}
          scaleY={scaleY}
          scaleX={scaleX}
          currency={currency}
          MARGIN={MARGIN}
          OFFSET={OFFSET}
        />
        {data !== undefined &&
          data.type === "linechart" &&
          data.data.map((segment, index) => {
            return <Segment key={index} {...{ segment, caliber, scaleY, scaleX }} />;
          })}
        {data2 !== undefined &&
          data2.type === "candle" &&
          data2.data.map((candle, index) => {
            return <Candle key={index} {...{ candle, caliber, scaleY, scaleX, scaleBody, index }} />;
          })}
        {data2 !== undefined &&
          data2.type === "linechart" &&
          data2.data.map((segment, index) => {
            return <Segment key={index} {...{ segment, caliber, scaleY, scaleX }} />;
          })}
        {data3 &&
          data3.type === "linechart" &&
          data3.data.map((segment, index) => {
            return <Segment key={index} color={colors.blue} {...{ segment, caliber, scaleY, scaleX }} />;
          })}
        {data4 &&
          data4.type === "linechart" &&
          data4.data.map((segment, index) => {
            return <Segment key={index} color={colors.danger} {...{ segment, caliber, scaleY, scaleX }} />;
          })}
        {data ? (
          <Scope
            {...{
              scaleX,
              scaleY,
              scopeX,
              scopeY,
              size,
              OFFSET,
              MARGIN,
              showScope,
              caliber,
              currency,
            }}
          />
        ) : null}
      </Svg>
    </PanGestureHandler>
  );
};
