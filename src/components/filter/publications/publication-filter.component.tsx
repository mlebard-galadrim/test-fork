import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import colors from "../../../themes/colors.theme";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { UsePublicationFilter } from "./usePublicationFilter";

type PublicationFilterBlockProps = {
  body: {
    id: string;
    title: string;
    choices: string[];
    action: ActionCreatorWithPayload<any, string>;
  }[];
};

const Container = styled(View)`
  padding: 0px 16px 24px 16px;
  margin-top: 24px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray};
`;

export const PublicationFilterBlock = ({ body }: PublicationFilterBlockProps) => {
  const { renderChoices, selectPublicationValueAndType } = UsePublicationFilter();

  return (
    <View>
      {body.map((item, key) => {
        const [filterList, filterType] = selectPublicationValueAndType(item);

        return (
          <Container key={key}>
            <GoldBrokerText left gray mb={4} ssp uppercase fontSize={17} i18nKey={item.title} />
            {renderChoices(item.id, item, filterList, filterType)}
          </Container>
        );
      })}
    </View>
  );
};
