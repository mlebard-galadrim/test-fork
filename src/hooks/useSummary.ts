import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserStock } from "../services/users.service";
import { State } from "../store/configure.store";
import { formatCurrency } from "../utils/currencies.utils";

const getMetalIcon = (metal) => {
  let icon;
  switch (metal) {
    case "XAU":
      icon = require("../../assets/icons/metals/or.png");
      break;
    case "XAG":
      icon = require("../../assets/icons/metals/argent.png");
      break;
    case "XPT":
      icon = require("../../assets/icons/metals/platine.png");
      break;
    case "XPD":
      icon = require("../../assets/icons/metals/palladium.png");
      break;
    default:
      icon = require("../../assets/icons/metals/argent.png");
      break;
  }
  return icon;
};

const buildData = (data, currency) => {
  const metalsData = data.metals;

  const dataRows = Object.keys(metalsData).map((metal) => {
    return [
      {
        type: "icon",
        source: getMetalIcon(metal),
        flex: 0.8,
      },
      {
        type: "text",
        value: formatCurrency(currency, metalsData[metal].purchaseValue.toFixed(2)),
        flex: 2,
        // value: metalsData[metal].ounces,
      },
      {
        type: "text",
        value: formatCurrency(currency, metalsData[metal].currentValue.toFixed(2)),
        flex: 2,
      },
      {
        type: "performance",
        value: metalsData[metal].performance.toFixed(2),
        flex: 1.2,
      },
    ];
  });
  const finalRow = [
    {
      type: "bold-text",
      value: "Total",
      flex: 0.8,
    },
    {
      type: "bold-text",
      value: formatCurrency(currency, data.purchaseValue.toFixed(2)),
      flex: 2,
    },
    {
      type: "bold-text",
      value: formatCurrency(currency, data.currentValue.toFixed(2)),
      flex: 2,
    },
    {
      type: "performance",
      value: data.performance.toFixed(2),
      flex: 1.3,
    },
  ];
  return [dataRows, finalRow];
};

export const UseSummary = () => {
  const currency = useSelector((state: State) => state.preferencesStore.currency);

  const [summary, setSummary] = useState([]);
  const [total, setTotal] = useState({});
  const [userCurrency, setUserCurrency] = useState("");

  useEffect(() => {
    getUserStock("XAG")
      .then((r) => {
        if (r.summary && !Array.isArray(r.summary)) {
          setSummary(buildData(r.summary, r.currency));
          setTotal(r.summary);
          setUserCurrency(r.currency);
        }
      })
      .catch((err) => console.warn(err));
  }, [currency]);

  return { summary, total, userCurrency };
};
