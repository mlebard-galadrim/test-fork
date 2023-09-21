import React from "react";
import { View } from "react-native";
import colors from "../../../themes/colors.theme";
import { Cell } from "./cell.component";

export const Row = (props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        borderBottomWidth: Boolean(props.header) ? 1 : 0,
        marginVertical: 8,
        paddingBottom: 6,
        borderBottomColor: colors.transparent2,
        alignItems: "center",
      }}
    >
      {props.cells.map((cell, key) => {
        return <Cell item={cell} key={key}></Cell>;
      })}
    </View>
  );
};
