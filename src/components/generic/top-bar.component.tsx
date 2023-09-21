import React from "react";
import { StyleSheet, View } from "react-native";
import { TopBarElementType } from "../../type/top-bar.type";
import { TopBarElement } from "./top-bar-element.component";

type TopBarPropsType = {
  left?: TopBarElementType;
  middle?: TopBarElementType;
  right?: TopBarElementType;
  mb?: number;
};

export const TopBar = (props: TopBarPropsType) => {
  const { left, middle, right } = props;

  return (
    <View style={styles(props).container}>
      {/* LEFT ELEMENT */}
      <TopBarElement align="flex-start" element={left} />
      {/* MIDDDLE ELEMENT */}
      <TopBarElement align="center" element={middle} />
      {/* RIGHT ELEMENT */}
      <TopBarElement align="flex-end" element={right} />
    </View>
  );
};

const styles = (props) =>
  StyleSheet.create({
    container: {
      flexDirection: "row", // row
      alignItems: "center",
      justifyContent: "space-between", // center, space-around
      paddingLeft: 16,
      paddingRight: 16,
      marginBottom: props.mb ?? 20,
      marginTop: 10,
    },
  });
