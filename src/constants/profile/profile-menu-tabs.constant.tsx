const iconBasePath = "../../../assets/icons/profile/menu";

export const tabs = [
  {
    i18nKey: "profile.menu.dashboard",
    screen: "DashboardScreen",
    icon: require(`${iconBasePath}/icons-espace-client-tableau-de-bord.png`),
  },
  {
    i18nKey: "profile.menu.messages",
    screen: "MessagesScreen",
    icon: require(`${iconBasePath}/icons-espace-client-mes-messages.png`),
  },
  {
    i18nKey: "profile.menu.coin_and_bar",
    screen: "CoinAndBarScreen",
    icon: require(`${iconBasePath}/icons-espace-client-mes-lingots-et-pi-ces.png`),
  },
  // {
  //   i18nKey: "profile.menu.property_titles",
  //   screen: "PropertyTitlesScreen",
  //   icon: require(`${iconBasePath}/icons-espace-client-titres-de-propri-t.png`),
  // },
  {
    i18nKey: "profile.menu.bills",
    screen: "BillsScreen",
    icon: require(`${iconBasePath}/icons-espace-client-mes-factures.png`),
  },
  {
    i18nKey: "profile.menu.my_transactions",
    screen: "TransactionsScreen",
    icon: require(`${iconBasePath}/icons-espace-client-mes-transactions.png`),
  },
  // {
  //   i18nKey: "profile.menu.products",
  //   screen: "Products",
  //   icon: require(`${iconBasePath}/icons-bottom-product-white.png`),
  // },
  {
    i18nKey: "profile.menu.fund_transfer",
    screen: "FundTransferScreen",
    icon: require(`${iconBasePath}/icons-espace-client-transf-rer-des-fonds.png`),
  },
  {
    i18nKey: "profile.menu.bulletins",
    screen: "BulletinsScreen",
    icon: require(`${iconBasePath}/icons-bulletins.png`),
  },
];

export const settingsTabs = [
  {
    i18nKey: "profile.menu.my_profile",
    screen: "MyProfileScreen",
    icon: require(`${iconBasePath}/settings/icons-espace-client-mon-profil.png`),
  },
  // {
  //   i18nKey: "profile.menu.password_change",
  //   screen: "PasswordUpdateScreen",
  //   icon: require(`${iconBasePath}/settings/icons-espace-client-mot-de-passe.png`),
  // },
  {
    i18nKey: "profile.menu.pin_change",
    screen: "PinUpdateScreen",
    icon: require(`${iconBasePath}/settings/icons-espace-client-pin.png`),
  },
  // {
  //   i18nKey: "profile.menu.preferences",
  //   screen: "PreferencesScreen",
  //   icon: require(`${iconBasePath}/settings/icons-espace-client-pr-f-rences.png`),
  // },
  {
    i18nKey: "profile.menu.notifications",
    screen: "NotificationsScreen",
    icon: require(`${iconBasePath}/settings/icons-bell.png`),
  },
  {
    i18nKey: "profile.menu.newsletter",
    screen: "NewsletterScreen",
    icon: require(`${iconBasePath}/settings/icons-menu-mail.png`),
  },
  {
    i18nKey: "profile.menu.contact_us",
    screen: "ContactNavigator",
    icon: require(`${iconBasePath}/icons-menu-contact-2.png`),
  },
];
