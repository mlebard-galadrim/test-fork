import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { Logo } from "../../../components/generic/logo.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import { GoldBrokerText } from "../../../components/style/goldbroker-text.component";
import { FooterBlock } from "../../../components/submenus/about/footer.component";
import { CardFounder } from "../../../components/submenus/about/founder-card.component";
import { HistoryBlock } from "../../../components/submenus/about/history.component";
import { getFounders } from "../../../services/users.service";
import { State } from "../../../store/configure.store";

const backgroundImage = require(`../../../../assets/background-images/main-en.jpg`);
const backgroundImageFR = require(`../../../../assets/background-images/main-fr.jpg`);

export const AboutScreen = () => {
  const navigation = useNavigation();
  const locale = useSelector((state: State) => state.appStore.locale);
  const [founders, setFounders] = useState([]);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    getFounders().then((res) => {
      setFounders(res?._embedded?.items);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Image source={locale === "fr" ? backgroundImageFR : backgroundImage} style={styles.bgImage} />
      <LinearGradient colors={["rgba(35,35,35,0.5)", "rgba(35,35,35,1)"]} style={styles.bgImage} />
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
        }}
        middle={{
          type: "text",
          title: "leftMenu.submenus.about.title",
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
        <Logo top={5} />
        <View style={{ marginBottom: 50, marginTop: 80, marginHorizontal: 16 }}>
          <GoldBrokerText i18nKey="leftMenu.submenus.about.introduction" ssp fontSize={17} />
        </View>
        <HistoryBlock />
        {founders.length > 0 &&
          founders.map((founder, index) => (
            <CardFounder
              author={{
                picture: { uri: founder.picture },
                name: `${founder.firstname} ${founder.lastname}`,
                job: founder.occupation,
                description: founder.biography,
                id: founder.id,
                website: founder.website || undefined,
                twitter: founder.twitter_url || undefined,
                facebook: founder.facebook_url || undefined,
              }}
              scrollRef={scrollRef}
              key={index}
            />
          ))}
        <FooterBlock />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    position: "absolute",
    top: 0,
    resizeMode: "cover",
    height: 200,
    width: "100%",
  },
});
