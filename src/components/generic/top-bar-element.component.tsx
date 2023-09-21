import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import colors from "../../themes/colors.theme";
import { TopBarElementType } from "../../type/top-bar.type";
import { ProgressBar } from "../register/progressbar.component";
import { GoldBrokerText } from "../style/goldbroker-text.component";

type TopBarElementPropsType = {
  element: TopBarElementType;
  align: "flex-end" | "flex-start" | "center";
};

const Text = (props: any) => {
  return <GoldBrokerText sspM i18nKey={props.title} fontSize={17} />;
};

const RawText = (props: any) => {
  return <GoldBrokerText sspM value={props.title} fontSize={17} />;
};

const Title = (props: any) => {
  return <GoldBrokerText i18nKey={props.title} fontSize={30} />;
};

const ButtonImage = (props: any) => {
  return (
    <TouchableOpacity onPress={props.function}>
      <Image source={props.source} />
    </TouchableOpacity>
  );
};

const ButtonText = (props: any) => {
  return (
    <TouchableOpacity onPress={props.function}>
      <GoldBrokerText gold sspM i18nKey={props.title} fontSize={16} />
    </TouchableOpacity>
  );
};

const ButtonIcon = (props: any) => (
  <Icon
    name={props.source}
    size={28}
    style={{
      color: colors.white,
      paddingRight: props.align === "flex-start" ? 30 : 0,
      paddingLeft: props.align === "flex-end" ? 30 : 0,
    }}
    onPress={props.function}
  />
);

export const TopBarElement = (props: TopBarElementPropsType) => {
  const navigation = useNavigation();
  const { align, element } = props;

  return (
    <View
      style={{
        flex: align === "center" ? 3 : 1,
        alignItems: align ?? "center",
      }}
    >
      {Boolean(element) ? (
        <>
          {element.type === "text" && <Text title={element.title} />}
          {element.type === "rawtext" && <RawText title={element.title} />}
          {element.type === "title" && <Title title={element.title} />}
          {element.type === "buttonText" && <ButtonText title={element.title} function={element.function} />}
          {element.type === "buttonImage" && <ButtonImage source={element.source} function={element.function} />}
          {element.type === "progressbar" && <ProgressBar progress={element.value} />}
          {element.type === "buttonIcon" && (
            <ButtonIcon source={element.source} function={element.function ?? navigation.goBack} align={align} />
          )}
        </>
      ) : (
        <></>
      )}
    </View>
  );
};
