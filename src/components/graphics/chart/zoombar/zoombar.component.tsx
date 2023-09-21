import { Animated, Dimensions, View } from "react-native";
import React, { useState } from "react";

import { LeftCursor } from "./left-cursor.component";
import { RightCursor } from "./right-cursor.component";
import colors from "../../../../themes/colors.theme";

const { width: totalWidth } = Dimensions.get("window");
const horizontalMargin = 16;

export const ZoomBar = () => {
  const [leftCursorOfffset, setLeftCursorOffset] = useState(0);
  const [rightCursorOfffset, setRightCursorOffset] = useState(0);
  // const leftCursorOffset = useRef(new Animated.Value(0)).current;
  return (
    <>
      <View
        style={{
          backgroundColor: colors.lightDark,
          height: 50,
          width: totalWidth - 16,
          marginTop: 16,
        }}
      />
      <Animated.View
        style={{
          position: "relative",
          bottom: 40,
          flex: 1,
          backgroundColor: colors.transparent2,
          height: 40,
          flexDirection: "row",
        }}
      >
        <LeftCursor
          setLeftCursorOffset={setLeftCursorOffset}
          rightCursorOffset={rightCursorOfffset}
        />
        <RightCursor
          setRightCursorOffset={setRightCursorOffset}
          leftCursorOffset={leftCursorOfffset}
        />
      </Animated.View>
    </>
  );
};
