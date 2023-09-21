import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";

import { DatePicker } from "../ratios/date-picker.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import Icon from "react-native-vector-icons/Octicons";
import { SectionTitle } from "../../generic/section-title.component";
import { SeeMoreButton } from "../../generic/buttons/see-more-button.component";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { formatCurrency } from "../../../utils/currencies.utils";
import { getHistoricalSpotPrice } from "../../../services/historical.service";
import { useSelector } from "react-redux";

export const ClosingPrice = ({ currentMetal }) => {
  const [currency, setCurrency] = useState("EUR");
  const [modalVisible, setModalVisible] = useState(false);
  const currencies = useSelector((state: State) => state.dataStore.currencies);
  const initialDate = new Date(Date.now());
  const [manualMode, setManualMode] = useState(true);
  const [date, setDate] = useState(initialDate.toISOString().split("T")[0]);
  const [closingPrice, setClosingPrice] = useState(0);
  const [displayPrice, setDisplayPrice] = useState(false);

  const onFetchValue = () => {
    getHistoricalSpotPrice(date, currentMetal, currency).then((r) => {
      if (r.close) {
        setClosingPrice(r.close);
        setDisplayPrice(true);
      } else {
        alert("Unavailable");
        setDisplayPrice(false);
      }
    });
  };

  useEffect(() => {
    if (displayPrice) {
      getHistoricalSpotPrice(date, currentMetal, currency).then((r) => {
        if (r.close) {
          setClosingPrice(r.close);
        } else {
          alert("Unavailable");
          setDisplayPrice(false);
        }
      });
    }
  }, [currency]);

  return (
    <View style={{ marginTop: 32, marginBottom: 32 }}>
      <SectionTitle
        i18nKey={`charts.history.closing_price.title.${currentMetal}`}
        fontSize={27}
        mb={16}
      />
      <View
        style={{
          backgroundColor: colors.gray2,
          paddingHorizontal: 60,
          paddingVertical: 20,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <GoldBrokerText
            sspL
            flex
            fontSize={17}
            mb={17}
            i18nKey={`charts.history.closing_price.description.${currentMetal}`}
            color={colors.text.gray}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <DatePicker
            date={date}
            setManualMode={setManualMode}
            manualMode={manualMode}
            setDate={setDate}
            bound={"1973-01-01"}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <GoldBrokerText ls ssp value={currency} fontSize={18} mr={6} />
            <Icon name="triangle-down" style={{ color: colors.white }} />
          </TouchableOpacity>
          <Modal
            transparent
            animationType="fade"
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseArea}
              >
                {currencies.map((current, key) => {
                  return (
                    <TouchableOpacity
                      style={styles.modalItem}
                      key={key}
                      onPress={() => {
                        setCurrency(current.code);
                        setModalVisible(false);
                      }}
                    >
                      <GoldBrokerText
                        ls
                        ssp
                        value={current.code}
                        fontSize={18}
                        mr={6}
                      />
                    </TouchableOpacity>
                  );
                })}
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
        <SeeMoreButton
          i18nKey="charts.history.closing_price.button"
          onPress={onFetchValue}
        />
        {displayPrice && (
          <View style={{ marginTop: 20 }}>
            <GoldBrokerText
              value={formatCurrency(currency, closingPrice)}
              fontSize={24}
              sspB
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.transparent4,
  },
  modalCloseArea: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  modalItem: {
    width: "100%",
    backgroundColor: colors.gray2,
    padding: 10,
    alignItems: "center",
    borderBottomColor: colors.gray,
    borderBottomWidth: 2,
    borderRadius: 4,
  },
});
