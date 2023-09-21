import { tabIcons } from "../constants/tabs.constant";

export const getIconSource = (routeName, focused) => {
    let tab = tabIcons.filter((tab) => { return tab.key === routeName })[0];
    return focused ? tab.activeIcon : tab.inactiveIcon
  }
  