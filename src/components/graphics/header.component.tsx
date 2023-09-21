import React, { useEffect, useState } from "react";
import { FlatList, LayoutChangeEvent, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Octicons";
import { useSelector } from "react-redux";
import { mainCurrencyCodes } from "../../constants/main-currency-codes.constant";
import { getCurrencies } from "../../services/static/currencies.service";
import { State, Store } from "../../store/configure.store";
import DataSlice from "../../store/slices/data.slice";
import colors from "../../themes/colors.theme";
import { GoldBrokerText } from "../style/goldbroker-text.component";

export const GraphicHeader = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedCurrency } = useSelector((state: State) => state.dataStore);
  const [currencies, setCurrencies] = useState([]);
  const [pickerYPosition, setPickerYPosition] = useState<number>();

  useEffect(() => {
    (async () => {
      const res = await getCurrencies("chart");
      const currencyVals = res["_embedded"]["items"];
      const mainCurrencyVals = mainCurrencyCodes.map((code) => {
        const currency = currencyVals.find((val) => val.code === code);
        if (currency !== undefined)
          return currency;
      });
      mainCurrencyVals.push({"code": "----", "name": ""})
      setCurrencies([...mainCurrencyVals, ...currencyVals]);
    })();
  }, []);

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setPickerYPosition(height);
  };

  const renderCurrencyItem = ({ item }) => {
    if (item.name !== "")
    {
      return (
        <TouchableOpacity
        key={item.code}
        style={styles.modalItem}
        onPress={() => {
          Store.dispatch(DataSlice.actions.setSelectedCurrency(item.code));
          setModalVisible(false);
        }}
        >
          <GoldBrokerText ls ssp value={item.code} fontSize={18} mr={6} />
        </TouchableOpacity>
      );
    }
    else
    {
      return (
        <TouchableWithoutFeedback
        key={item.code}
        style={styles.modalItem}
        >
          <GoldBrokerText ls ssp value={item.code} fontSize={18} mr={6} />
        </TouchableWithoutFeedback>
      );
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        top: 8,
        right: 16,
        bottom: 0,
      }}
    >
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={modalCloseStyles(pickerYPosition).modalCloseArea}>
              <FlatList data={[...currencies]} renderItem={renderCurrencyItem} style={styles.modalItemContainer} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <TouchableOpacity
        style={styles.currencyButton}
        onPress={() => {
          setModalVisible(true);
        }}
        onLayout={onLayout}
      >
        <GoldBrokerText ls ssp value={selectedCurrency} fontSize={18} mr={6} />
        <Icon name="triangle-down" style={{ color: colors.white }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  currencyButton: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  modalContainer: {
    flex: 1,
  },
  modalItemContainer: {
    maxHeight: 300,
  },
  modalItem: {
    width: 75,
    backgroundColor: colors.gray2,
    padding: 10,
    alignItems: "center",
    borderBottomColor: colors.gray,
    borderBottomWidth: 2,
    borderRadius: 4,
  },
});

const modalCloseStyles = (paddingTop: number) =>
  StyleSheet.create({
    modalCloseArea: {
      flex: 1,
      alignItems: "flex-end",
      paddingRight: 16,
      paddingTop,
    },
  });
