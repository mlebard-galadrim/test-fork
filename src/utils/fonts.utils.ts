import * as Font from "expo-font";

export const loadFonts = async () => {
  try {
    await Font.loadAsync({
      PlayfairDisplayBlack: require("../../assets/fonts/PlayfairDisplay-Black.ttf"),
      PlayfairDisplayRegular: require("../../assets/fonts/PlayfairDisplay-Regular.ttf"),
      PlayfairDisplayMedium: require("../../assets/fonts/PlayfairDisplay-Medium.ttf"),
      PlayfairDisplaySemiBold: require("../../assets/fonts/PlayfairDisplay-SemiBold.ttf"),
      PlayfairDisplayItalic: require("../../assets/fonts/PlayfairDisplay-Italic.ttf"),
      SSPRegular: require("../../assets/fonts/SSP/SourceSansPro-Regular.ttf"),
      SSPLight: require("../../assets/fonts/SSP/SourceSansPro-Light.ttf"),
      SSPBold: require("../../assets/fonts/SSP/SourceSansPro-Bold.ttf"),
      SSPBlack: require("../../assets/fonts/SSP/SourceSansPro-Black.ttf"),
      SSPMedium: require("../../assets/fonts/SSP/SourceSansPro-SemiBold.ttf"),
      SSPItalic: require("../../assets/fonts/SSP/SourceSansPro-Italic.ttf"),
    });
  } catch (e) {
    console.warn("Erreur loading" + e);
  }
};
