import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import Icon from "react-native-vector-icons/Octicons";
import { WebView } from "react-native-webview";
import colors from "../../themes/colors.theme";
import { deviceWidth } from "../../constants/device.constant";

export const VideoModal = ({ item }) => {
  const [isVisible, setVisible] = useState(false);

  return (
    <View
      style={{
        marginHorizontal: 8,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setVisible(true);
        }}
      >
        <Image
          source={{ uri: item.thumbnail_url }}
          style={{ width: 100, height: 100 }}
        />
        <View style={styles.centerSquare}>
          <Icon
            name="play"
            size={30}
            style={{
              color: colors.white,
            }}
          />
        </View>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        visible={isVisible}
        transparent={true}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.transparent4,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "flex-end",
            }}
            onPress={() => {
              setVisible(false);
            }}
          >
            <Icon
              name="x"
              size={30}
              style={{ marginLeft: 10, marginBottom: 10, color: colors.white }}
            />
          </TouchableOpacity>
          <View style={{ height: 300 }}>
            <WebView
              javaScriptEnabled={true}
              scrollEnabled={false}
              allowsFullscreenVideo={true}
              injectedJavaScript={`setTimeout(() => document.getElementById('movie_player').click(),1000);`}
              onMessage={(e) => {
                // For IOS to trigger javascript
              }}
              style={{
                height: 400,
                width: deviceWidth - 20,
              }}
              source={{
                uri: `${item.url}?mute=1`,
              }}
            />
          </View>
          <TouchableOpacity
            style={{
              flex: 1,
              width: "100%",
            }}
            onPress={() => {
              setVisible(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centerSquare: {
    height: 100,
    width: 100,
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
