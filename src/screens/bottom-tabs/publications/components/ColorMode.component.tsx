import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import colors from "../../../../themes/colors.theme";

const sunIcon = require("../../../../../assets/icons/article/soleil.png");
const moonIcon = require("../../../../../assets/icons/article/lune.png");

type Props = {
  colorMode: number;
};

export const ColorModeComponent = ({ colorMode }: Props) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const enable = () => {
    Animated.timing(translateX, {
      toValue: 20,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const disable = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (colorMode == 1) {
      enable();
    } else disable();
  }, [colorMode]);

  return (
    <View style={[styles.container, { backgroundColor: colorMode === 0 ? colors.gray : colors.gold }]}>
      <Animated.View
        style={[
          styles.tracker,
          {
            transform: [{ translateX: translateX }],
          },
        ]}
      >
        {colorMode === 0 ? <Image source={moonIcon} style={styles.imageContainer} /> : <Image source={sunIcon} style={styles.imageContainer} />}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 50, height: 30, borderRadius: 20, justifyContent: "center" },
  imageContainer: {
    width: 28,
    height: 28,
  },
  tracker: {
    height: 28,
    width: 28,
    borderRadius: 28,
    backgroundColor: colors.white,
    marginHorizontal: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
