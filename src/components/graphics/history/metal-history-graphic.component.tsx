import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { useSelector } from "react-redux";
import { getHistoricalCollectionSpotPrice } from "../../../services/historical.service";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { buildSegments } from "../../../utils/charts.utils";
import { getFromTo } from "../../../utils/date.utils";
import { Chart } from "../chart/chart.component";
import { RatioFilter } from "../ratios/ratio-filter.component";
import { DataTypeButton } from "./data-type-button.component";

export const MetalHistoryGraphic = ({ currentMetal, setGlobalPerformance, setPerformancesHistory }) => {
  const OFFSET = 60;
  const [from, to] = getFromTo(5);
  const [lowerDate, setLowerDate] = useState(from);
  const [higherDate, setHigherDate] = useState(to);
  const [displayClosing, setDisplayClosing] = useState(true);
  const [displayCandles, setDisplayCandles] = useState(false);
  const [displayMA50, setDisplayMA50] = useState(false);
  const [displayMA200, setDisplayMA200] = useState(false);
  const [rawValues, setRawValues] = useState([0]);
  const [rawDates, setRawDates] = useState([0]);
  const { selectedCurrency } = useSelector((state: State) => state.dataStore);

  const [candles, setCandles] = useState([]);
  const { width: size } = Dimensions.get("window");
  const [caliber, setCaliber] = useState(1);
  const [domain, setDomain] = useState([]);
  const [dateDomain, setDateDomain] = useState([]);
  const [closingPrice, setClosingPrice] = useState([]);
  const [ma50, setMa50] = useState([]);
  const [ma200, setMa200] = useState([]);

  useEffect(() => {
    if (candles.length > 0) {
      setRawValues(candles.map((candle) => [candle.low, candle.high]).flat());
      setRawDates(candles.map((candle) => new Date(candle.date).getTime()));
      setGlobalPerformance(((candles[candles.length - 1].close - candles[0].close) / candles[0].close) * 100);
    }
    setClosingPrice(buildSegments(candles, "close"));
    setMa50(buildSegments(candles, "ma50"));
    setMa200(buildSegments(candles, "ma200"));
  }, [candles]);

  useEffect(() => {
    setDomain([Math.min(...rawValues), Math.max(...rawValues)]);
    setDateDomain([Math.min(...rawDates), Math.max(...rawDates)]);
    const daysNumber = Math.ceil((Math.max(...rawDates) - Math.min(...rawDates)) / (1000 * 3600 * 24));
    setCaliber((size - OFFSET) / (daysNumber + 1));
  }, [rawValues, rawDates]);

  useEffect(() => {
    if (lowerDate === higherDate) {
      getHistoricalCollectionSpotPrice(currentMetal, selectedCurrency).then((r) => {
        const temp = r._embedded.items;
        setCandles(temp);
        setPerformancesHistory(r._embedded.performances);
      });
    } else {
      getHistoricalCollectionSpotPrice(currentMetal, selectedCurrency, lowerDate, higherDate).then((r) => {
        const temp = r._embedded.items;
        setCandles(temp);
        setPerformancesHistory(r._embedded.performances);
      });
    }
  }, [currentMetal, lowerDate, higherDate, selectedCurrency]);

  return (
    <View
      style={{
        marginTop: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 8,
          marginBottom: 16,
          justifyContent: "space-between",
        }}
      >
        <DataTypeButton
          title={"charts.history.closing_candle_ma_chart.closing"}
          display={displayClosing}
          setDisplay={setDisplayClosing}
          color={colors.gold}
        />
        <DataTypeButton
          title={"charts.history.closing_candle_ma_chart.candle"}
          display={displayCandles}
          setDisplay={setDisplayCandles}
          color={colors.success}
        />
        <DataTypeButton title={"charts.history.closing_candle_ma_chart.ma50"} display={displayMA50} setDisplay={setDisplayMA50} color={colors.blue} />
        <DataTypeButton
          title={"charts.history.closing_candle_ma_chart.ma200"}
          display={displayMA200}
          setDisplay={setDisplayMA200}
          color={colors.danger}
        />
      </View>
      <View style={{ marginBottom: 16 }}>
        {candles.length > 0 && (
          <Chart
            data={displayClosing && closingPrice.length > 0 ? { type: "linechart", data: closingPrice } : undefined}
            data2={displayCandles && candles.length > 0 ? { type: "candle", data: candles } : undefined}
            data3={displayMA50 && ma50.length > 0 ? { type: "linechart", data: ma50 } : undefined}
            data4={displayMA200 && ma200.length > 0 ? { type: "linechart", data: ma200 } : undefined}
            {...{
              caliber,
              size,
              domain,
              dateDomain,
            }}
            currency={selectedCurrency}
          />
        )}
      </View>
      <RatioFilter lowerDate={lowerDate} setLowerDate={setLowerDate} higherDate={higherDate} setHigherDate={setHigherDate} />
      {/* <ZoomBar /> */}
    </View>
  );
};
