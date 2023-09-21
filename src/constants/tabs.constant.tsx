import GraphicsScreen from "../screens/bottom-tabs/graphics/graphics.screen";
import HomeScreen from "../screens/bottom-tabs/home/home.screen";
import ProductsScreen from "../screens/bottom-tabs/products/products.screen";
import ProfileNavigator from "../screens/bottom-tabs/profile/profile.navigator";
import PublicationsScreen from "../screens/bottom-tabs/publications/publications.screen";
import { Store } from "../store/configure.store";
import AppSlice from "../store/slices/app.slice";
import ProductFilterSlice from "../store/slices/product-filter.slice";
import PublicationFilterSlice from "../store/slices/publication-filter.slice";

const iconBasePath = "../../assets/icons/bottomBar";

const updateLasPinDate = () => {
  Store.dispatch(AppSlice.actions.setNewLastPinDate(new Date()));
};

export const tabs = [
  {
    key: "HomeScreen",
    i18nKey: "bottomtab.home",
    component: HomeScreen,
    listener: ({ navigation, route }) => ({
      tabPress: (e) => {
        updateLasPinDate();
      },
    }),
  },
  {
    key: "Publications",
    i18nKey: "bottomtab.news",
    component: PublicationsScreen,
    listener: ({ navigation, route }) => ({
      tabPress: (e) => {
        updateLasPinDate();
        Store.dispatch(PublicationFilterSlice.actions.reset());
      },
    }),
  },
  {
    key: "Graphics",
    i18nKey: "bottomtab.graphics",
    component: GraphicsScreen,
    initialParams: { metal: "XAU" },
    listener: ({ navigation, route }) => ({
      tabPress: (e) => {
        updateLasPinDate();
      },
    }),
  },
  {
    key: "Products",
    i18nKey: "bottomtab.products",
    component: ProductsScreen,
    listener: ({ navigation, route }) => ({
      tabPress: (e) => {
        updateLasPinDate();
        Store.dispatch(ProductFilterSlice.actions.reset());
      },
    }),
  },
  {
    key: "Profile",
    i18nKey: "bottomtab.profile",
    component: ProfileNavigator,
    listener: ({ navigation, route }) => ({
      tabPress: (e) => {
        Store.dispatch(AppSlice.actions.setNow(new Date()));
        Store.dispatch(AppSlice.actions.transferPinDate());
      },
    }),
  },
];

export const tabIcons = [
  {
    key: "HomeScreen",
    activeIcon: require(`${iconBasePath}/icons-bottom-maison-active.png`),
    inactiveIcon: require(`${iconBasePath}/icons-bottom-maison-inactive.png`),
  },
  {
    key: "Publications",
    activeIcon: require(`${iconBasePath}/icons-bottom-actualit-active.png`),
    inactiveIcon: require(`${iconBasePath}/icons-bottom-actualit-inactive.png`),
  },
  {
    key: "Graphics",
    activeIcon: require(`${iconBasePath}/icons-bottom-chart-active.png`),
    inactiveIcon: require(`${iconBasePath}/icons-bottom-chart-inactive.png`),
  },
  {
    key: "Products",
    activeIcon: require(`${iconBasePath}/icons-bottom-product-active.png`),
    inactiveIcon: require(`${iconBasePath}/icons-bottom-product-inactive.png`),
  },
  {
    key: "Profile",
    activeIcon: require(`${iconBasePath}/icons-bottom-espace-active.png`),
    inactiveIcon: require(`${iconBasePath}/icons-bottom-espace-inactive.png`),
  },
];
