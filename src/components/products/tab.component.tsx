import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { GoldBrokerText } from "../style/goldbroker-text.component";
import { ProductSpecification } from "./specification.component";
import colors from "../../themes/colors.theme";

export const TabBlock = ({ product }) => {
  const [focus, setFocus] = useState("description");

  var re = new RegExp(String.fromCharCode(160), "g");
  return (
    <View
      style={{
        width: "100%",
        marginBottom: 52,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          style={styles(focus === "description").tab}
          onPress={() => {
            setFocus("description");
          }}
        >
          <GoldBrokerText
            sspM
            mb={8}
            color={focus === "description" ? colors.gold : colors.light}
            i18nKey="products.description.tabTitle"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles(focus === "specification").tab}
          onPress={() => {
            setFocus("specification");
          }}
        >
          <GoldBrokerText
            sspM
            mb={8}
            color={focus === "specification" ? colors.gold : colors.light}
            i18nKey="products.specification.tabTitle"
          />
        </TouchableOpacity>
      </View>
      {focus === "description" ? (
        <GoldBrokerText
          left
          ssp
          fontSize={17}
          value={product.description
            .replace(/&nbsp;/g, " ")
            .replace(new RegExp("<[^>]*>", "g"), "")}
          mh={16}
        />
      ) : (
        <ProductSpecification product={product} />
      )}
    </View>
  );
};

const styles = (focused) =>
  StyleSheet.create({
    tab: {
      flex: 1,
      borderBottomWidth: 2,
      borderBottomColor: focused ? colors.gold : colors.gray,
    },
  });
