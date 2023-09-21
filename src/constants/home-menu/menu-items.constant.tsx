const iconBasePath = "../../../assets/icons/home-menu";

export const tabs = [
  {
    i18nKey: "leftMenu.submenus.contact.title",
    icon: require(`${iconBasePath}/icons-menu-contact.png`),
    screen: "ContactNavigator",
  },
  {
    i18nKey: "leftMenu.submenus.services.title",
    icon: require(`${iconBasePath}/icons-menu-tool-box.png`),
    screen: "ServicesScreen",
  },
  {
    i18nKey: "leftMenu.submenus.about.title",
    icon: require(`${iconBasePath}/icons-menu-propos.png`),
    screen: "AboutScreen",
  },
  {
    i18nKey: "leftMenu.submenus.clientReview",
    icon: require(`${iconBasePath}/icons-menu-avis-client.png`),
    screen: "ClientReviewScreen",
  },
  {
    i18nKey: "leftMenu.submenus.newsletter.title",
    icon: require(`${iconBasePath}/icons-menu-mail.png`),
    screen: "NewsletterNavigator",
  },
  {
    i18nKey: "leftMenu.submenus.settings.title",
    icon: require(`${iconBasePath}/icons-menu-cog.png`),
    screen: "SettingsNavigator",
  },
  {
    i18nKey: "leftMenu.submenus.termsOfService.title",
    icon: require(`${iconBasePath}/icons-menu-legal-2.png`),
    screen: "CguScreen",
  },
];

export const settingstab = [
  {
    i18nKey: "leftMenu.submenus.settings.menus.notifications.navigation",
    icon: require(`${iconBasePath}/settings/icons-bell.png`),
    screen: "NotificationsScreen",
  },
  {
    i18nKey: "leftMenu.submenus.settings.menus.currency.navigation",
    icon: require(`${iconBasePath}/settings/icons-menu-devise.png`),
    screen: "CurrencyScreen",
  },
  {
    i18nKey: "leftMenu.submenus.settings.menus.language.navigation",
    icon: require(`${iconBasePath}/settings/icons-menu-langue.png`),
    screen: "LanguageScreen",
  },
];
