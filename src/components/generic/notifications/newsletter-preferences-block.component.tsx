import { Image, StyleSheet, Switch, View } from "react-native";
import { GoldBrokerText } from "../../../components/style/goldbroker-text.component";
import { useLogin } from "../../../hooks/useLogin";
import { useUserPreferences } from "../../../hooks/useUserPreferences";
import colors from "../../../themes/colors.theme";

const newsletterIcon = require("../../../../assets/icons/register/icons-newsletter.png");

export const NewsletterPreferencesBlock = () => {
  const { subscribedToInAppNewsletter, handleSubscribedToInAppNewsletterChange } = useUserPreferences();
  // const metalsNewsletter = useSelector((state: State) => state.preferencesStore.metalsNewsletter);
  const { logged } = useLogin();

  return (
    <>
      <View style={styles.container}>
        <View style={{ marginHorizontal: 12, alignItems: "center" }}>
          <Image source={newsletterIcon} style={{ width: 32, height: 32, marginBottom: 24 }} />
          <GoldBrokerText i18nKey="register.newsletter.instruction" ssp mb={16} fontSize={17} />
          {/* <View style={styles.newsletterBox}>
            <GoldBrokerText flex left fontSize={16} mh={8} sspM i18nKey="register.newsletter.setting1" />
            <Switch
              value={metalsNewsletter}
              trackColor={{ false: colors.inactiveText, true: colors.gold }}
              thumbColor={colors.white}
              onValueChange={() => {
                Store.dispatch(PreferencesSlice.actions.setMetalsNewsletter(!metalsNewsletter));
              }}
            />
          </View> */}
          <View style={styles.newsletterBox}>
            <GoldBrokerText flex left fontSize={16} mh={8} sspM i18nKey="register.newsletter.setting3" />
            <Switch
              value={subscribedToInAppNewsletter}
              trackColor={{ false: colors.inactiveText, true: colors.gold }}
              thumbColor={colors.white}
              onValueChange={() => {
                handleSubscribedToInAppNewsletterChange(!subscribedToInAppNewsletter);
              }}
              disabled={!logged}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    paddingBottom: 16,
  },
  newsletterBox: {
    paddingRight: 8,
    marginBottom: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.transparent3,
    borderRadius: 4,
    alignItems: "center",
    paddingVertical: 16,
    width: "100%",
  },
});
