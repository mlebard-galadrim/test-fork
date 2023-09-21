import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import DetailComponent from "../../../../../components/profile/coin-and-bar/detail-component";
import FooterComponent from "../../../../../components/profile/coin-and-bar/footer-component";
import { GoldBrokerText } from "../../../../../components/style/goldbroker-text.component";
import { metalsConstant } from "../../../../../constants/metals.constant";
import { UseSummary } from "../../../../../hooks/useSummary";
import { getUserStock } from "../../../../../services/users.service";
import colors from "../../../../../themes/colors.theme";

export const CoinAndBarScreen = () => {
  const navigation = useNavigation();
  const [currentMetal, setCurrentMetal] = useState<string>("XAU");
  const [stockProducts, setStockProducts] = useState<any>([]);

  const [displayGoToTop, setDisplayGoToTop] = useState(false);

  const { summary, total, userCurrency } = UseSummary();

  useEffect(() => {
    getUserStock(currentMetal).then((r) => {
      setStockProducts(r._embedded.items);
    });
  }, [currentMetal]);

  const scrollRef = useRef(null);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y >= contentSize.height * 0.2;
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "three-bars",
          function: () => {
            navigation.navigate("SideMenuScreen");
          },
        }}
        middle={{
          type: "text",
          title: "profile.menu.coin_and_bar",
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      <View style={styles().metalSelectionBar}>
        {metalsConstant.map((metal, key) => {
          return (
            <TouchableOpacity
              style={styles(metal.id === currentMetal).metalButton}
              key={key}
              onPress={() => {
                setCurrentMetal(metal.id);
              }}
            >
              <GoldBrokerText color={metal.id === currentMetal ? colors.dark : colors.text.gray} i18nKey={metal.name} fontSize={16} ssp />
            </TouchableOpacity>
          );
        })}
      </View>
      <ScrollView
        ref={scrollRef}
        onScroll={({ nativeEvent }) => {
          isCloseToBottom(nativeEvent) ? setDisplayGoToTop(true) : setDisplayGoToTop(false);
        }}
        scrollEventThrottle={400}
      >
        {/* <ResumeComponent summary={summary} /> */}
        <DetailComponent {...{ stockProducts }} />
        {Object.keys(total).length > 0 ? <FooterComponent totalSummary={total} {...{ currentMetal, userCurrency }} /> : null}
      </ScrollView>
      {displayGoToTop ? (
        <TouchableOpacity style={styles().scrollToTop} onPress={() => scrollToTop()}>
          <Feather name="arrow-up" size={24} color="white" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
const styles = (active?) =>
  StyleSheet.create({
    metalSelectionBar: {
      marginHorizontal: 16,
      marginBottom: 16,
      flexDirection: "row",
      backgroundColor: colors.lightDark,
      alignItems: "center",
      borderRadius: 4,
    },
    metalButton: {
      flex: 1,
      paddingVertical: 10,
      margin: 3,
      backgroundColor: active ? colors.gold : undefined,
      borderRadius: 4,
    },
    scrollToTop: {
      position: "absolute",
      bottom: 20,
      right: 20,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.gold,
      justifyContent: "center",
      alignItems: "center",
    },
  });
