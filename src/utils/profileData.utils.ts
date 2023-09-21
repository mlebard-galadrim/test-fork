import { getTransactionsCollection } from "../services/transactions.service";
import { Store } from "../store/configure.store";
import InvoicesSlice from "../store/slices/invoices.slice";
import TransactionsSlice from "../store/slices/transactions.slice";
import UserSlice from "../store/slices/user.slice";
import { getInvoicesCollection, getInvoicesStatuses, getInvoicesTypes } from "./../services/invoices.service";
import { getTransactionsTypes } from "./../services/transactions.service";
import { getProfileStatuses } from "./../services/users.service";

export const loadInvoices = async (currency) => {
  await getInvoicesCollection(currency).then((r) => {
    Store.dispatch(InvoicesSlice.actions.setInvoices(r._embedded.items));
  });
};

export const loadInvoicesTypes = async () => {
  await getInvoicesTypes().then((r) => {
    Store.dispatch(InvoicesSlice.actions.setTypes(r._embedded.items));
  });
};

export const loadInvoicesStatuses = async () => {
  await getInvoicesStatuses().then((r) => {
    Store.dispatch(InvoicesSlice.actions.setStatuses(r._embedded.items));
  });
};

export const loadTransactions = async (currency) => {
  await getTransactionsCollection(currency).then((r) => {
    Store.dispatch(TransactionsSlice.actions.setTransactions(r._embedded.items));
  });
};

export const loadTransactionsTypes = async () => {
  await getTransactionsTypes().then((r) => {
    Store.dispatch(TransactionsSlice.actions.setTypes(r._embedded.items));
  });
};

export const loadProfileStatuses = async () => {
  await getProfileStatuses().then((r) => {
    Store.dispatch(UserSlice.actions.setStatuses(r._embedded.items));
  });
};
