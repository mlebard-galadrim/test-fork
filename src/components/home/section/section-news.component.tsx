import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "../../../store/configure.store";
import { SeeMoreButton } from "../../generic/buttons/see-more-button.component";
import { SectionTitle } from "../../generic/section-title.component";
import { Publication } from "./../publication.component";

const Section = styled(View)`
  margin-bottom: 42px;
  margin-left: 16px;
  margin-right: 16px;
`;

export const SectionNews = (props) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const publications = useSelector((state: State) => state.publicationsStore.publications);
  const goToPublications = () => {
    navigation.navigate("Publications");
  };

  return (
    <Section>
      <SectionTitle i18nKey={props.i18nKey} mb={16} />
      {publications
        .filter((p) =>
          props.publicationType === "videos"
            ? p.type === "video" && p.id !== props.currentPublication.id
            : props.publicationType === "article"
            ? p.type === "article" && p.id !== props.currentPublication.id
            : true
        )
        .slice(0, props.nb ?? undefined)
        .map((item, index) => {
          return (
            <Publication
              title={item.title}
              author={item.author ?? `${item._embedded.author.firstname} ${item._embedded.author.lastname}`}
              key={index}
              illustration={item.illustration}
              publication={item}
              noborder={index === props.nb - 1}
            />
          );
        })}
      {props.button && <SeeMoreButton i18nKey="home.moreNews" onPress={goToPublications} />}
    </Section>
  );
};
