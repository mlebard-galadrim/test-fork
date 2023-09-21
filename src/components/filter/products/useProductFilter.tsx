import i18n from "i18n-js";
import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import { ApiFilterItem } from "./../api-filter-item.component";
import { FilterItem } from "./../filter-item.component";

export const UseProductsFilter = () => {
  const activeFilters = useSelector((state: State) => state.productFilterStore);

  const renderChoices = (id, item, filterList, filterType) => {
    switch (id) {
      case "author":
        return item.choices.map((author) => (
          <ApiFilterItem
            value={`${author.firstname} ${author.lastname}`}
            id={author.id}
            key={author.id}
            action={item.action}
            filters={filterList}
            type={filterType}
          />
        ));
      case "subject":
        return item.choices.map((subject) => (
          <ApiFilterItem
            value={subject.name}
            id={subject.id}
            key={subject.id}
            action={item.action}
            filters={filterList}
            type={filterType}
          />
        ));
      case "publicationType":
        return item.choices.map((type, key) => (
          <FilterItem
            id={type.type}
            i18nKey={type.name}
            key={key}
            action={item.action}
            filters={filterList}
            type={filterType}
          />
        ));
      case "service":
        return item.choices.map((service) => (
          <FilterItem
            id={service.id}
            i18nKey={service.title}
            key={service.id}
            action={item.action}
            filters={filterList}
            type={filterType}
          />
        ));
      default:
        return item.choices.map((i18nKey, key) => (
          <FilterItem
            id={i18n.t(i18nKey)}
            i18nKey={i18nKey}
            key={key}
            action={item.action}
            filters={filterList}
            type={filterType}
          />
        ));
    }
  };

  const selectProductValueAndType = (item) => {
    let filterList = [];
    let filterType = null;
    switch (item.id) {
      case "price":
        filterList = activeFilters.price;
        filterType = "switch";
        break;

      case "metal":
        filterList = activeFilters.metal;
        filterType = "list";
        break;

      case "product":
        filterList = activeFilters.product;
        filterType = "list";
        break;

      case "service":
        filterList = activeFilters.service;
        filterType = "switch";
        break;

      default:
        break;
    }

    return [filterList, filterType];
  };

  return {
    renderChoices,
    selectProductValueAndType,
  };
};
