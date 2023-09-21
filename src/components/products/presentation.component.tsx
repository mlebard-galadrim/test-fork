import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { State } from "../../store/configure.store";
import { formatCurrency } from "../../utils/currencies.utils";
import { GoldBrokerText } from "../style/goldbroker-text.component";
import { Details } from "./presentation-details.component";
import { VideoModal } from "./video-modal.component";

type ProductPresentationProps = {
  pictureUrl: {
    uri: string;
  };
  name: string;
  price: number;
  videos: any;
  storage: string[];
  delivery: string[];
  pictures: Object;
  available: Boolean;
};

export const ProductPresentation = (props: ProductPresentationProps) => {
  const currency = useSelector((state: State) => state.preferencesStore.currency);

  const [mainPicture, setMainPicture] = useState(props.pictureUrl);
  const [carouselPictures, setCarouselPictures] = useState(Object.values(props.pictures));

  return (
    <View style={styles.container}>
      <Image
        style={{
          width: 262,
          height: 262,
          resizeMode: "contain",
          alignSelf: "center",
          marginBottom: 2,
        }}
        source={mainPicture}
      />
      <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        {carouselPictures.map((pic, key) => {
          return (
            <TouchableOpacity
              key={key}
              onPress={() => {
                const tempArray = [...carouselPictures];
                tempArray.splice(key, 1);
                tempArray.unshift(mainPicture.uri);
                setCarouselPictures(tempArray);
                setMainPicture({ uri: pic });
              }}
            >
              <Image source={{ uri: pic }} style={{ width: 100, height: 100, marginHorizontal: 8 }} />
            </TouchableOpacity>
          );
        })}
        {props.videos.map((item, key) => {
          return (
            <View key={key}>
              <VideoModal item={item} />
            </View>
          );
        })}
      </ScrollView>
      <GoldBrokerText left value={props.name} mb={32} mt={22} fontSize={24} />
      <Details storage={props.storage} delivery={props.delivery} available={props.available} />
      <View style={styles.price}>
        <Text>
          <GoldBrokerText lh={34} left sspL fontSize={17} i18nKey="products.details.from_to" />
          <GoldBrokerText lh={34} value="  " />
          <GoldBrokerText left sspB fontSize={30} lh={34} value={formatCurrency(currency, props.price)} />
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 42,
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  price: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 24,
  },
});
