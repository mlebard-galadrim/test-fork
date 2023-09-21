import { Feather } from "@expo/vector-icons";
import DOMSerializer from "dom-serializer";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Image, Linking, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import HTMLView from "react-native-htmlview";
import { WebView } from "react-native-webview";
import { useDispatch } from "react-redux";
import { CreateAccountAd } from "../../../components/ads/create-account.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import { SectionNews } from "../../../components/home/section/section-news.component";
import { GoldBrokerText } from "../../../components/style/goldbroker-text.component";
import { CardFounder } from "../../../components/submenus/about/founder-card.component";
import { deviceWidth } from "../../../constants/device.constant";
import { useLogin } from "../../../hooks/useLogin";
import PublicationFilterSlice from "../../../store/slices/publication-filter.slice";
import colors from "../../../themes/colors.theme";
import { publicationShare } from "../../../utils/share.utils";
import { ColorModeComponent } from "./components/ColorMode.component";

const monthName = {
  0: "Janv.",
  1: "Févr.",
  2: "Mars",
  3: "Avr.",
  4: "Mai",
  5: "Juin",
  6: "Juil.",
  7: "Août",
  8: "Sept.",
  9: "Nov.",
  10: "Oct.",
  11: "Déc.",
};

const fontSizeIcon = require("../../../../assets/icons/more/icons-menu-font-size.png");
const shareIcon = require(`../../../../assets/icons/more/icons-menu-partager.png`);

export const TextPublicationScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { logged } = useLogin();

  const publication = route.params.publication;
  const formattedBody = publication.body.replace(/&nbsp;/g, " ");

  const author = publication["_embedded"]["author"];
  const date = new Date(Date.parse(publication.published_at));

  const [currentHeights, setCurrentHeights] = useState<any>({});

  const [fontSize, setFontSize] = useState(0);
  const [colorMode, setColorMode] = useState(0); // 0 for dark (default) mode, 1 for light mode
  const [displayGoToTop, setDisplayGoToTop] = useState(false);
  const [imagesDimensions, setImagesDimensions] = useState<{ src: string; height: number; width: number }[]>([]);
  const [loadingImagesDimensions, setLoadingImagesDimensions] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    (async () => {
      await calcImageSrcArrayDimensions();
      setLoadingImagesDimensions(false);
    })();
  }, []);

  const isCloseToBottom = ({ contentOffset, contentSize }) => {
    return contentOffset.y >= contentSize.height * 0.2;
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const getImagesSrc = () => {
    const regex = /src\s*=\s*"(.*?)"/g;
    let m: any;
    const arr: string[] = [];
    while ((m = regex.exec(publication.body)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      arr.push(m[1]);
    }
    return arr;
  };

  const calcImageSrcArrayDimensions = async () => {
    const imagesSrc = getImagesSrc();

    await Promise.all(
      imagesSrc.map(async (imageSrc) => {
        Image.getSize(imageSrc, (width, height) => {
          setImagesDimensions((previousValue) => [
            ...previousValue,
            {
              src: imageSrc,
              width,
              height,
            },
          ]);
        });
      })
    );
  };

  const renderNode = (node, index, siblings, parent, defaultRenderer) => {
    if (node.name == "iframe") {
      const a = node.attribs;
      const iframeHtml = `<body style="padding: 0; margin: 0;"><iframe src="${a.src}" width=100% height=100% style="position: absolute;"></iframe></body>`;
      return (
        <View
          key={index}
          style={{
            width: deviceWidth - 32,
            height: Number(a.height) * ((deviceWidth - 32) / Number(a.width)),
          }}
        >
          <WebView source={{ html: iframeHtml }} style={{ backgroundColor: colors.dark }} />
        </View>
      );
    }

    if (node.name == "img") {
      const a = node.attribs;
      const imageFound = imagesDimensions.find((imageDimensions) => {
        return imageDimensions.src === a.src;
      });

      if (!imageFound) {
        return null;
      }

      return (
        <View key={index}>
          <Image
            source={{ uri: a.src }}
            style={{
              width: deviceWidth - 32,
              height: (Number(imageFound.height) * (deviceWidth - 32)) / Number(imageFound.width),
            }}
          />
        </View>
      );
    }

    if (node.name === "blockquote") {
      if (node.attribs && node.attribs.class && node.attribs.class.includes("twitter")) {
        let JS = '<script type="text/javascript" src="https://platform.twitter.com/widgets.js"></script>';
        const rawHtml = "<html>" + JS + DOMSerializer(node) + "</html>";
        const disableZoom = `const meta = document.createElement('meta'); meta.setAttribute('content', 'initial-scale=1.0, maximum-scale=1.0'); 
        meta.setAttribute('name', 'viewport'); 
         document.getElementsByTagName('head')[0].appendChild(meta);
         setTimeout(function() {window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);}, 1000);
         true;
         `;
        return (
          <View
            style={{
              height: currentHeights[index.toString()] || 300,
              width: deviceWidth - 32,
            }}
            key={`${index}-${currentHeights[index.toString()]}`}
          >
            <WebView
              style={{
                backgroundColor: "rgba(0, 0, 0, 0)",
                width: deviceWidth - 32,
                opacity: 0.99,
              }}
              source={{ html: rawHtml }}
              javaScriptEnabled={true}
              injectedJavaScript={disableZoom}
              onMessage={(e) => {
                if (!currentHeights.index) {
                  setCurrentHeights({ ...currentHeights, [index]: parseInt(e.nativeEvent.data) });
                }
                /* IOS trigger javascript */
              }}
              onShouldStartLoadWithRequest={(req) => {
                if (req.url.includes("platform.twitter.com") || req.url.includes("about:blank")) {
                  return true;
                }
                Linking.openURL(req.url);
                return false;
              }}
            />
          </View>
        );
      } else {
        return (
          <View key={index} style={{ width: deviceWidth - 32, borderTopWidth: 1, borderColor: colors.gold, borderBottomWidth: 1 }}>
            {defaultRenderer(node.children, node)}
          </View>
        );
      }
    }

    if (node.name === "p" && parent.name === "blockquote") {
      if (node.attribs && node.attribs.class && node.attribs.class === "author") {
        return <GoldBrokerText key={`${index}_author_before`} gold right value={`-${node.children[0].data}`} />;
      } else {
        if (node.children[0].children && node.children[0].children.length > 0) {
          // <blockquote><p><em>TEXT</em></p></blockquote>
          return <GoldBrokerText key={`${index}_text_before`} gold value={`"${node.children[0].children.map((child) => child.data).join("")}"`} />;
        } else {
          // <blokquote><p>TEXT</p></blockquote>
          return <GoldBrokerText key={`${index}_text_before`} gold value={`"${node.children[0].data}"`} />;
        }
      }
    }
  };

  const handleAuthorClick = (id) => {
    dispatch(PublicationFilterSlice.actions.setShouldReload(true));
    dispatch(PublicationFilterSlice.actions.setAuthor([id]));
    navigation.navigate("Publications");
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: publication.illustration }} style={styles.bgImage} />
      <LinearGradient colors={["rgba(35,35,35,0.5)", "rgba(35,35,35,1)"]} style={styles.bgImage} />
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            navigation.goBack();
          },
        }}
        right={{
          type: "buttonText",
          title: "news.share",
          function: () => {
            publicationShare(publication.url, publication.title);
          },
        }}
        mb={0}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
        onScroll={({ nativeEvent }) => {
          isCloseToBottom(nativeEvent) ? setDisplayGoToTop(true) : setDisplayGoToTop(false);
        }}
        scrollEventThrottle={400}
      >
        <GoldBrokerText mt={36} mb={30} mh={30} fontSize={35} value={publication.title} />
        <TouchableOpacity onPress={() => handleAuthorClick(author.id)} style={{ alignItems: "center", marginBottom: 24 }}>
          <Image
            source={{ uri: author.picture }}
            style={{
              width: 52,
              height: 52,
              borderRadius: 30,
              marginBottom: 12,
            }}
          />
          <GoldBrokerText color={colors.light} fontSize={11} ssp ls value={`${author.firstname.toUpperCase()} ${author.lastname.toUpperCase()}`} />
          <GoldBrokerText ssp fontSize={11} ls value={`${date.getDate()} ${monthName[date.getMonth()]} ${date.getFullYear()}`} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            marginHorizontal: 12,
          }}
        >
          <Pressable onPress={() => setColorMode((colorMode + 1) % 2)}>
            <ColorModeComponent colorMode={colorMode} />
          </Pressable>
          <TouchableOpacity onPress={() => setFontSize((fontSize + 1) % 3)}>
            <Image source={fontSizeIcon} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: "flex-start",
            marginBottom: 42,
            backgroundColor: colorMode === 0 ? "transparent" : colors.white,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          {!loadingImagesDimensions ? (
            <HTMLView
              value={`<div>${formattedBody}</div>`}
              stylesheet={htmlStyle(fontSize, colorMode)}
              renderNode={renderNode}
              addLineBreaks={false}
            />
          ) : null}
        </View>
        <CardFounder
          author={{
            picture: { uri: author.picture },
            name: `${author.firstname} ${author.lastname}`,
            job: author.occupation,
            description: author.biography,
            id: author.id,
            website: author.website || undefined,
            twitter: author.twitter_url || undefined,
            facebook: author.facebook_url || undefined,
          }}
          scrollRef={scrollRef}
        />
        <SectionNews nb={5} publicationType="article" i18nKey="news.similarNews" currentPublication={publication} />
        {!logged && <CreateAccountAd />}
      </ScrollView>
      {displayGoToTop && (
        <TouchableOpacity style={styles.scrollToTop} onPress={() => scrollToTop()}>
          <Feather name="arrow-up" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const htmlStyle = (fontSize, colorMode) => {
  const fontSizes = [18, 20, 22];
  return StyleSheet.create({
    blockquote: {
      padding: 0,
      margin: 0,
    },
    a: {
      color: colors.gold,
    },
    em: {
      fontFamily: "SSPItalic",
    },
    strong: {
      fontFamily: "SSPBold",
    },
    p: {
      marginTop: 0,
      marginBottom: 0,
      fontFamily: "SSPRegular",
      fontSize: fontSizes[fontSize],
    },
    li: {
      marginTop: 0,
      marginBottom: 0,
      fontFamily: "SSPRegular",
      fontSize: fontSizes[fontSize],
    },
    h3: {
      color: colors.gold,
      fontSize: fontSizes[fontSize] + 6,
      fontFamily: "SSPBold",
    },
    h2: {
      color: colors.gold,
      fontSize: fontSizes[fontSize] + 8,
      fontFamily: "SSPBold",
    },
    h1: {
      color: colors.gold,
      fontSize: fontSizes[fontSize] + 10,
      fontFamily: "SSPBold",
    },
    div: {
      color: colorMode === 0 ? colors.white : colors.black,
      textAlign: "justify",
      fontSize: fontSizes[fontSize],
    },
  });
};

const styles = StyleSheet.create({
  bgImage: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 200,
  },
  scrollToTop: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gold,
    justifyContent: "center",
    alignItems: "center",
  },
});
