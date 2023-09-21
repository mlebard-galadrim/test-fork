import { useScrollToTop } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Title } from "../../../components/generic/title.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import { Graphics } from "../../../components/graphics/graphics.component";
import { GraphicHeader } from "../../../components/graphics/header.component";
import { MetalsTable } from "../../../components/graphics/metals-table.component";
import { getAnnualPerformances } from "../../../services/annuel-performances.service";
import { getSpotPricesCollection } from "../../../services/spot-prices.service";
import { State } from "../../../store/configure.store";
import ChartsDataSlice from "../../../store/slices/chartsData.slice";
import { loadMetals } from "../../../utils/data.utils";

const Container = styled(View)`
  height: 100%;
  display: flex;
`;

export default function GraphicsScreen({ route, navigation }) {
  const metal = route.params.metal;
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentMetal, setCurrentMetal] = useState(metal);
  const { selectedCurrency } = useSelector((state: State) => state.dataStore);
  const { tripleCurrencies } = useSelector((state: State) => state.chartDataStore);

  const ref = React.useRef(null);
  useScrollToTop(ref);

  const loadGraphicData = async () => {
    const res = await getSpotPricesCollection(currentMetal, selectedCurrency);
    dispatch(ChartsDataSlice.actions.setMetalPriceGraphic(res._embedded.items));
  };

  const loadAnnualPerformances = useCallback(async () => {
    const res = await getAnnualPerformances("XAU", tripleCurrencies);
    dispatch(ChartsDataSlice.actions.setAnnualPerformances(res._embedded.items));
  }, [tripleCurrencies]);

  useEffect(() => {
    loadAnnualPerformances();
  }, [tripleCurrencies]);

  useEffect(() => {
    loadGraphicData();
  }, [selectedCurrency, currentMetal]);

  const reload = async () => {
    setRefreshing(true);
    await loadMetals();
    await loadAnnualPerformances();
    await loadGraphicData();
    setRefreshing(false);
  };

  return (
    <Container>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "three-bars",
          function: () => {
            navigation.navigate("MenuNavigator");
          },
        }}
        mb={10}
      />
      <Title title="charts.title" />
      <GraphicHeader />
      <ScrollView ref={ref} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} tintColor={"white"} />}>
        <MetalsTable />
        <Graphics metal={metal} currentMetal={currentMetal} setCurrentMetal={setCurrentMetal} />
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({});
