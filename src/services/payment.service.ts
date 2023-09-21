import { get, post, rawpost } from "./utils.service";

export const getInvoice = async (invoiceNumber: string, use_balance: number = 0) => {
  const res = await get(`/payments/${invoiceNumber}/prepare`, { use_balance });
  return res;
};

export const getPaypal = async (invoice_number, use_balance) => {
  const res = await rawpost(`/payments/paypal`, {
    invoice_number,
    use_balance,
  });
  return res;
};

export const postCheckout = async (invoice_number, token, token_type, save_card, use_balance = 0) => {
  const res = await rawpost(`/payments/checkout`, {
    invoice_number,
    use_balance,
    token,
    token_type,
    save_card,
  });
  return res;
};

export const postBalance = async (invoice_number) => {
  const res = await post(`/payments/balance`, {
    invoice_number,
  });

  return res;
};

export const paymentDone = async (invoiceNumber, params = {}) => {
  const res = await get(`/payments/${invoiceNumber}/done`, params);
  return res;
};
