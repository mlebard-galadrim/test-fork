import { StyleSheet, View } from "react-native";

import React from "react";
import { Row } from "./row.component";
import colors from "../../../themes/colors.theme";

export const Table = ({ header, rows, final = [], mt = 36 }) => {
  return (
    <View style={styles(mt).tableContainer}>
      <Row cells={header} header />
      {rows.map((row, index) => {
        return <Row cells={row} key={index} />;
      })}
      {final.length > 0 && (
        <>
          <View style={styles().finalSeparator} />
          <Row cells={final} />
        </>
      )}
    </View>
  );
};

const styles = (mt?) =>
  StyleSheet.create({
    tableContainer: {
      padding: 16,
      paddingBottom: 2,
      marginTop: mt,
      backgroundColor: colors.gray2,
    },
    finalSeparator: {
      height: 1,
      backgroundColor: colors.gray,
      marginBottom: 16,
    },
  });
