import React from "react";
import { Dimensions, View } from "react-native";
import { useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import { buildDomain, buildSegments } from "../../../utils/charts.utils";
import { Chart } from "../chart/chart.component";

export const MetalPriceGraphic = ({ data }) => {
  if (Object.keys(data).length === 0) return null;

  const ratioSegments = buildSegments(data, "value");
  const { width: size } = Dimensions.get("window");
  const [domain, dateDomain] = buildDomain(data, "value");
  const currency = useSelector((state: State) => state.dataStore.selectedCurrency);

  return (
    <View
      style={{
        marginTop: 16,
        marginBottom: 16,
      }}
    >
      {data.length > 0 && (
        <Chart
          data={{ type: "linechart", data: ratioSegments }}
          {...{
            size,
            domain,
            dateDomain,
            currency,
          }}
        />
      )}
    </View>
  );
};
