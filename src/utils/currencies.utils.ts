import "intl";
import "intl/locale-data/jsonp/en";

require("date-time-format-timezone");

export const formatCurrency = (currency, number) => {
  if (!currency) return -10;
  if (number === undefined) return -10;
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: currency }).format(number);
};
