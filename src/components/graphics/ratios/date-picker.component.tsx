import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import DateTimePicker from "@react-native-community/datetimepicker";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { useSelector } from "react-redux";

export const DatePicker = (props) => {
  const [show, setShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const locale = useSelector((state: State) => state.appStore.locale);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    const currentDate = selectedDate || new Date(Date.parse(props.date));
    props.setDate(currentDate.toISOString().split("T")[0]);
    props.setManualMode(true);
  };

  const showDatepicker = () => {
    if (Platform.OS === "ios") {
      setModalVisible(true);
    } else {
      setShow(true);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={showDatepicker}
        style={styles(props.manualMode).scaleButton}
      >
        <GoldBrokerText
          color={props.manualMode ? colors.white : colors.gray}
          ssp
          value={props.date}
        />
      </TouchableOpacity>
      {show && Platform.OS !== "ios" && (
        <DateTimePicker
          value={new Date(Date.parse(props.date))}
          mode={"date"}
          onChange={onChange}
          style={{
            flex: 1,
            width: 120,
            borderColor: props.manualMode ? colors.gold : colors.gray,
            borderWidth: 1,
            borderRadius: 4,
            backgroundColor: props.manualMode ? colors.lightDark : colors.dark,
          }}
          maximumDate={
            props.lower
              ? new Date(Date.parse(props.bound))
              : new Date(Date.now())
          }
          minimumDate={
            props.lower ? undefined : new Date(Date.parse(props.bound))
          }
          locale={locale}
        />
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: colors.transparent4 }} />
          <DateTimePicker
            textColor={colors.gold}
            value={new Date(Date.parse(props.date))}
            mode={"date"}
            display="spinner"
            onChange={onChange}
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              backgroundColor: colors.dark,
            }}
            maximumDate={
              props.lower
                ? new Date(Date.parse(props.bound))
                : new Date(Date.now())
            }
            minimumDate={
              props.lower ? undefined : new Date(Date.parse(props.bound))
            }
            locale={locale}
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = (active?) =>
  StyleSheet.create({
    scaleButton: {
      flex: 1,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: active ? colors.gold : colors.gray,
      backgroundColor: active ? colors.lightDark : undefined,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 4,
      marginHorizontal: 4,
    },
  });
