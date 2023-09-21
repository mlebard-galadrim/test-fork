import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { PublicationFilterBlock } from "../../../components/filter/publications/publication-filter.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import { State, Store } from "../../../store/configure.store";
import PublicationFilterSlice from "../../../store/slices/publication-filter.slice";

const buildPublicationFilter = (authors, publicationTags) => {
  return [
    {
      id: "publicationType",
      title: "news.filters.byType.title",
      choices: [
        {
          type: "article",
          name: "news.filters.byType.categories.articles",
        },
        {
          type: "video",
          name: "news.filters.byType.categories.videos",
        },
      ],
      action: PublicationFilterSlice.actions.setPublicationType,
    },
    {
      id: "subject",
      title: "news.filters.bySubject.title",
      choices: publicationTags,
      action: PublicationFilterSlice.actions.setSubject,
    },
    {
      id: "author",
      title: "news.filters.byAuthor.title",
      choices: authors,
      action: PublicationFilterSlice.actions.setAuthor,
    },
  ];
};

export const PublicationFilterScreen = () => {
  const navigation = useNavigation();
  const { authors } = useSelector((state: State) => state.dataStore);
  const { publicationTags } = useSelector((state: State) => state.dataStore);
  const [publicationFilter, setPublicationFilter] = useState([]);
  const activeFilters = useSelector((state: State) => state.publicationFilterStore);

  useEffect(() => {
    setPublicationFilter(buildPublicationFilter(authors, publicationTags));
  }, [activeFilters]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            Store.dispatch(PublicationFilterSlice.actions.setShouldReload(true));
            navigation.goBack();
          },
        }}
        middle={{
          type: "text",
          title: "news.filters.title",
        }}
        mb={0}
      />
      <PublicationFilterBlock body={publicationFilter} />
    </ScrollView>
  );
};
