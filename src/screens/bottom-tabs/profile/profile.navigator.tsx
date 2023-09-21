import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLogin } from "../../../hooks/useLogin";
import AppSlice from "../../../store/slices/app.slice";
import { NewsletterScreen } from "../../menu/settings/newsletter.screen";
import { NotificationsScreen } from "../../menu/settings/notifications.screen";
import { BillsScreen } from "./menu/bills/bills.screen";
import { BulletinsScreen } from "./menu/bulletins/bulletins.screen";
import { CoinAndBarScreen } from "./menu/coin-and-bar/coin-and-bar.screen";
import { DashboardScreen } from "./menu/dashboard/dashboard.screen";
import { FundTransferScreen } from "./menu/fund-transfer/fund-transfer.screen";
import { MessagesScreen } from "./menu/messages/messages.screen";
import SuccessMessageScreen from "./menu/messages/success-message.screen";
import ThreadScreen from "./menu/messages/thread.screen";
import { MyProfileScreen } from "./menu/myprofile/my-profile.screen";
import { PasswordUpdateScreen } from "./menu/password-update/password-update.screen";
import { PreferencesScreen } from "./menu/preferences/preferences.screen";
import { PropertyTitlesScreen } from "./menu/property-titles/property-titles.screen";
import { TransactionsScreen } from "./menu/transactions/transactions.screen";
import WriteReviewScreen from "./menu/write-review.screen";
import { ProfileWelcomeScreen } from "./welcome/profile-welcome.screen";

const Stack = createStackNavigator();

const ProfileWelcomeScreenNavigator = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName={"ProfileWelcomeScreen"}>
      <Stack.Screen name="ProfileWelcomeScreen" component={ProfileWelcomeScreen} />
    </Stack.Navigator>
  );
};

export default function ProfileNavigator() {
  const { logged, lastPinDate, shouldAskPin, now } = useLogin();
  const dispatch = useDispatch();

  const isTooLongSinceLastPinValidation = new Date(now).getTime() - new Date(lastPinDate).getTime() > 60000;

  useEffect(() => {
    if (isTooLongSinceLastPinValidation) {
      dispatch(AppSlice.actions.setShouldAskPin(true));
    }
  }, [isTooLongSinceLastPinValidation]);

  if (!logged) {
    return <ProfileWelcomeScreenNavigator />;
  }

  if (shouldAskPin) {
    return <ProfileWelcomeScreenNavigator />;
  }

  if (isTooLongSinceLastPinValidation) {
    return <ProfileWelcomeScreenNavigator />;
  }

  return (
    <Stack.Navigator headerMode="none" initialRouteName={"DashboardScreen"}>
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      <Stack.Screen name="WriteReviewScreen" component={WriteReviewScreen} />
      <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
      <Stack.Screen name="SuccessMessageScreen" component={SuccessMessageScreen} />
      <Stack.Screen name="ThreadScreen" component={ThreadScreen} />
      <Stack.Screen name="CoinAndBarScreen" component={CoinAndBarScreen} />
      <Stack.Screen name="PropertyTitlesScreen" component={PropertyTitlesScreen} />
      <Stack.Screen name="BillsScreen" component={BillsScreen} />
      <Stack.Screen name="TransactionsScreen" component={TransactionsScreen} />
      <Stack.Screen name="FundTransferScreen" component={FundTransferScreen} />
      <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />
      <Stack.Screen name="PasswordUpdateScreen" component={PasswordUpdateScreen} />
      <Stack.Screen name="PreferencesScreen" component={PreferencesScreen} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
      <Stack.Screen name="NewsletterScreen" component={NewsletterScreen} />
      <Stack.Screen name="BulletinsScreen" component={BulletinsScreen} />
    </Stack.Navigator>
  );
}
