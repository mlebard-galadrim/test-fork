import i18n from "i18n-js";
import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import { ApiFilterItem } from "../api-filter-item.component";
import { FilterItem } from "../filter-item.component";

export const UsePublicationFilter = () => {
  const activeFilters = useSelector((state: State) => state.publicationFilterStore);

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
          <ApiFilterItem value={subject.name} id={subject.id} key={subject.id} action={item.action} filters={filterList} type={filterType} />
        ));
      case "publicationType": {
        return item.choices.map((type, key) => (
          <FilterItem id={type.type} i18nKey={type.name} key={key} action={item.action} filters={filterList} type={filterType} />
        ));
      }
      default:
        return item.choices.map((i18nKey, key) => (
          <FilterItem id={i18n.t(i18nKey)} i18nKey={i18nKey} key={key} action={item.action} filters={filterList} type={filterType} />
        ));
    }
  };

  const selectPublicationValueAndType = (item) => {
    let filterList = [];
    let filterType = null;
    switch (item.id) {
      case "publicationType":
        filterList = activeFilters.publicationType;
        filterType = "list";
        break;

      case "subject":
        filterList = activeFilters.subject;
        filterType = "list";
        break;

      case "author":
        filterList = activeFilters.author;
        filterType = "list";
        break;

      default:
        break;
    }

    return [filterList, filterType];
  };

  return {
    renderChoices,
    selectPublicationValueAndType,
  };
};
