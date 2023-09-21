import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { ContactInformation } from "../../components/contact-us/contact-info.component";
import { ContactSuccess } from "../../components/contact-us/contact-success.component";
import { ContactForm } from "../../components/contact-us/form/contact-form.component";
import { MessagingWelcome } from "../../components/contact-us/messaging/messaging-access.component";
import { TabBlock } from "../../components/contact-us/tab.component";
import { TopBar } from "../../components/generic/top-bar.component";

export const ContactScreen = () => {
  const [focus, setFocus] = useState("contact");
  const [success, setSuccess] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
        }}
        middle={{
          type: "text",
          title: "contactUs.title",
        }}
      />
      <TabBlock focus={focus} setFocus={setFocus} />
      {focus === "contact" ? (
        success === false ? (
          <ScrollView style={{ marginTop: 16 }}>
            <ContactInformation />
            <ContactForm setSuccess={setSuccess} />
          </ScrollView>
        ) : (
          <ContactSuccess />
        )
      ) : (
        <MessagingWelcome />
      )}
    </View>
  );
};
