export type BillPayment = {
  amount: number;
  available_payment_methods: string[];
  balance_amount: number;
  currency: string;
  date: string;
  items: Bill[];
  status: number;
};

export type Bill = {
  amount: number;
  currency: string;
  date: string;
  invoice_number: string;
  status: string;
  type: BillType;
};

export type BillType =
  | "import"
  | "repurchase"
  | "transfer"
  | "extraservice"
  | "visit"
  | "delivery"
  | "pickup"
  | "storagefee"
  | "investororder"
  | "affiliatepayment";
