import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import styled from "styled-components";
import colors from "../../themes/colors.theme";
import { GoldBrokerText } from "./goldbroker-text.component";

const ErrorText = styled(GoldBrokerText)`
  position: absolute;
  z-index: 10;
  bottom: -20px;
`;

export const GoldbrokerInput = (props) => {
  const [showText, setShowText] = useState<boolean>(props.secret);

  return (
    <View style={styles(props).mainView}>
      <View style={styles(props).inputView}>
        {props.icon && <Icon name="search" size={20} style={{ color: "#6d6d6d", marginLeft: 16 }} />}
        <TextInput
          secureTextEntry={Boolean(showText)}
          style={styles(props).input}
          placeholder={props.placeholder}
          placeholderTextColor={props.dark ? "#6d6d6d" : undefined}
          onChangeText={props.onChange}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          value={props.value}
          multiline={props.multiline}
        />
        {Boolean(props.secret) ? (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 10,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            }}
            onPress={() => setShowText((prevState) => !prevState)}
          >
            {showText ? (
              <Ionicons name="eye" size={24} color="black" />
            ) : (
              <Ionicons name="eye-off" size={24} color="black" />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
      {Boolean(props?.error) && <ErrorText color={colors.danger} ssp left fontSize={14} value={props?.error} />}
    </View>
  );
};

const styles = (props) =>
  StyleSheet.create({
    mainView: {
      width: "100%",
      flexDirection: "column",
      paddingHorizontal: props.padding ?? 20,
      marginBottom: props.mb ?? undefined,
    },
    inputView: {
      width: "100%",
      flexDirection: props.row ? "row" : "column",
      alignItems: "center",
      borderRadius: props.radius ?? 10,
      backgroundColor: props.dark ? colors.gray2 : colors.light,
      height: props.height ?? undefined,
    },
    input: {
      width: props.row ? undefined : "100%",
      flex: props.row ? 1 : undefined,
      padding: props.internPadding ?? 16,
      fontFamily: "SSPRegular",
      fontSize: 18,
      color: props.dark ? colors.light : colors.dark,
    },
  });
