import { Dimensions, View } from "react-native";
import { buildDomain, buildSegments } from "../../../utils/charts.utils";

import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import { Chart } from "../chart/chart.component";

export const RatioGraph = ({ data }) => {
  const ratioSegments = buildSegments(data, "close");
  const { width: size } = Dimensions.get("window");
  const [domain, dateDomain] = buildDomain(data, "close");
  const { selectedCurrency } = useSelector((state: State) => state.dataStore);
  return (
    <View>
      {data.length > 0 && (
        <Chart
          data={{ type: "linechart", data: ratioSegments }}
          {...{
            size,
            domain,
            dateDomain,
          }}
          currency={selectedCurrency}
        />
      )}
    </View>
  );
};
