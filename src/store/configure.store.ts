import { createStore } from "redux";
import { persistCombineReducers } from "redux-persist";
import ExpoFileSystemStorage from "redux-persist-expo-filesystem";
import AppSlice from "./slices/app.slice";
import AuthSlice from "./slices/auth.slice";
import BulletinsSlice from "./slices/bulletin.slice";
import ChartsDataSlice from "./slices/chartsData.slice";
import DataSlice from "./slices/data.slice";
import InvoicesSlice from "./slices/invoices.slice";
import MetalsSlice from "./slices/metals.slice";
import PreferencesSlice from "./slices/preferences.slice";
import ProductFilterSlice from "./slices/product-filter.slice";
import PublicationFilterSlice from "./slices/publication-filter.slice";
import PublicationsSlice from "./slices/publication.slice";
import RegisterSlice from "./slices/register.slice";
import TransactionsSlice from "./slices/transactions.slice";
import UserSlice from "./slices/user.slice";

const persistConfig = {
  key: "root",
  storage: ExpoFileSystemStorage,
  timeout: 1000,
};

export const Store = createStore(
  persistCombineReducers(persistConfig, {
    authStore: AuthSlice.reducer,
    registerStore: RegisterSlice.reducer,
    preferencesStore: PreferencesSlice.reducer,
    productFilterStore: ProductFilterSlice.reducer,
    publicationsStore: PublicationsSlice.reducer,
    publicationFilterStore: PublicationFilterSlice.reducer,
    bulletinsStore: BulletinsSlice.reducer,
    dataStore: DataSlice.reducer,
    chartDataStore: ChartsDataSlice.reducer,
    metalsStore: MetalsSlice.reducer,
    userStore: UserSlice.reducer,
    appStore: AppSlice.reducer,
    invoiceStore: InvoicesSlice.reducer,
    transactionStore: TransactionsSlice.reducer,
  })
);

export type State = ReturnType<typeof Store.getState>;
