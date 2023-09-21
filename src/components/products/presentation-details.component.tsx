import { Image, StyleSheet, View } from "react-native";

import { CountryFlags } from "../../constants/country-names.constant";
import { GoldBrokerText } from "../style/goldbroker-text.component";
import React from "react";
import colors from "../../themes/colors.theme";

type PresentationDetailsProps = {
  storage: string[];
  delivery: string[];
  available: Boolean;
};

const Pastille = ({ available }) => {
  return (
    <View
      style={{
        height: 8,
        width: 8,
        marginRight: 5,
        borderRadius: 10,
        backgroundColor: available ? colors.success : colors.danger,
      }}
    />
  );
};

const Flag = ({ country }) => {
  return (
    <Image
      source={CountryFlags[country]}
      style={{
        borderRadius: 8,
        resizeMode: "cover",
      }}
    />
  );
};

export const Details = ({
  storage,
  delivery,
  available,
}: PresentationDetailsProps) => {
  return (
    <View style={styles.details}>
      <Pastille available={available} />
      <GoldBrokerText
        fontSize={16}
        ssp
        left
        i18nKey={
          available
            ? "products.details.available"
            : "products.details.notavailable"
        }
        color={available ? colors.success : colors.danger}
      />
      {available && (
        <>
          <GoldBrokerText mh={8} fontSize={16} ssp left value="|" />
          {storage.length > 0 && (
            <>
              <GoldBrokerText
                fontSize={16}
                mr={8}
                ssp
                left
                i18nKey={"products.details.storage"}
              />
              {storage.map((country, key) => (
                <Flag key={key} country={country} />
              ))}
              <GoldBrokerText mh={8} fontSize={16} ssp left value="|" />
            </>
          )}
          {delivery.length > 0 && (
            <>
              <GoldBrokerText
                fontSize={16}
                mr={8}
                ssp
                left
                i18nKey={"products.details.delivery"}
              />
              {delivery.map((country, key) => (
                <Flag key={key} country={country} />
              ))}
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  details: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 42,
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
});
