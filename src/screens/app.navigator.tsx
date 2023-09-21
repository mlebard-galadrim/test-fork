import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { PinLogin } from "../components/login/pin-login.component";
import { State } from "../store/configure.store";
import { registerForPushNotifcationsAsync } from "../utils/notifications.utils";
import BottomTabNavigator from "./bottom-tabs/bottom-tab.navigator";
import { ProductFilterScreen } from "./bottom-tabs/products/product-filter.screen";
import ProductScreen from "./bottom-tabs/products/product.screen";
import { BalanceScreen } from "./bottom-tabs/profile/menu/bills/balance.screen";
import { BillScreen } from "./bottom-tabs/profile/menu/bills/bill.screen";
import { CheckoutScreen } from "./bottom-tabs/profile/menu/bills/checkout.screen";
import { PaypalScreen } from "./bottom-tabs/profile/menu/bills/paypal.screen";
import { PaymentSuccessScreen } from "./bottom-tabs/profile/menu/bills/success.screen";
import { NewMessageScreen } from "./bottom-tabs/profile/menu/messages/new-message.screen";
import { PinUpdateScreen } from "./bottom-tabs/profile/menu/pin-update/pin-update.screen";
import SideMenuScreen from "./bottom-tabs/profile/menu/side-menu.screen";
import { PublicationFilterScreen } from "./bottom-tabs/publications/publication-filter.screen";
import { TextPublicationScreen } from "./bottom-tabs/publications/text-publication.screen";
import { VideoPublicationScreen } from "./bottom-tabs/publications/video-publication.screen";
import ContactNavigator from "./contact-us/contact-us.navigator";
import { ForgottenPasswordSuccessScreen } from "./login/forgotten-password-success.screen";
import { ForgottenPasswordScreen } from "./login/forgotten-password.screen";
import { LoginScreen } from "./login/login.screen";
import { PinSetup } from "./login/pin-setup.screen";
import MenuNavigator from "./menu/menu.navigator";
import NewsletterNavigator from "./menu/newsletter/newsletter.navigator";
import RegisterNavigator from "./register/register.navigator";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const app = useSelector((state: State) => state.appStore);
  const locale = useSelector((state: State) => state.appStore.locale);
  const notificationId = useSelector((state: any) => state.appStore.notificationId);

  let initialRouteName = app.firstlaunch ? "NewsletterNavigator" : "BottomTabScreens";

  useEffect(() => {
    (async () => {
      await registerForPushNotifcationsAsync({
        currentNotificationId: notificationId,
        locale,
      });
    })();
  }, []);

  return (
    <Stack.Navigator headerMode="none" initialRouteName={initialRouteName}>
      <Stack.Screen name="BottomTabScreens" component={BottomTabNavigator} />
      <Stack.Screen name="ContactNavigator" component={ContactNavigator} />
      <Stack.Screen name="MenuNavigator" component={MenuNavigator} options={{ gestureDirection: "horizontal-inverted" }} />
      <Stack.Screen name="NewsletterNavigator" component={NewsletterNavigator} />
      {/** Screens outside of navigator */}
      <Stack.Screen name="ProductScreen" component={ProductScreen} />
      <Stack.Screen name="VideoPublicationScreen" component={VideoPublicationScreen} />
      <Stack.Screen name="TextPublicationScreen" component={TextPublicationScreen} />
      <Stack.Screen name="ProductFilterScreen" component={ProductFilterScreen} />
      <Stack.Screen name="NewMessageScreen" component={NewMessageScreen} />
      <Stack.Screen name="BillScreen" component={BillScreen} />
      <Stack.Screen name="PaymentSuccessScreen" component={PaymentSuccessScreen} />
      <Stack.Screen name="BalanceScreen" component={BalanceScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      <Stack.Screen name="PaypalScreen" component={PaypalScreen} />
      <Stack.Screen name="PublicationFilterScreen" component={PublicationFilterScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="ForgottenPasswordScreen" component={ForgottenPasswordScreen} />
      <Stack.Screen name="ForgottenPasswordSuccessScreen" component={ForgottenPasswordSuccessScreen} />
      <Stack.Screen name="RegisterNavigator" component={RegisterNavigator} />
      <Stack.Screen name="PinUpdateScreen" component={PinUpdateScreen} />
      <Stack.Screen name="PinSetup" component={PinSetup} />
      <Stack.Screen name="PinLogin" component={PinLogin} />
      <Stack.Screen name="SideMenuScreen" component={SideMenuScreen} options={{ gestureDirection: "horizontal-inverted" }} />
    </Stack.Navigator>
  );
}
