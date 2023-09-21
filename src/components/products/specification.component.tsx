import { GoldBrokerText } from "../style/goldbroker-text.component";
import React from "react";
import { View } from "react-native";
import colors from "../../themes/colors.theme";
import styled from "styled-components";

const Container = styled(View)`
  flex: 1;
  margin: 0px 8px;
  padding: 0px 8px;
  padding-top: 16px;
  justify-content: space-between;
  background-color: ${colors.gray2};
  border-radius: 4px;
`;

const Row = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const specificationFields = [
  "manufacturing_process",
  "length",
  "width",
  "diameter",
  "thickness",
  "weight",
  "fineness",
  "brand",
];

export const ProductSpecification = ({ product }) => {
  return (
    <Container>
      {specificationFields.map((specification, key) => {
        if (product[specification]) {
          let value = "";
          switch (specification) {
            case "weight":
              value = `${product.weight} ${product.weight_unit}`;
              break;
            default:
              value = product[specification];
              break;
          }
          return (
            <Row key={key}>
              <View style={{ flex: 1 }}>
                <GoldBrokerText
                  left
                  fontSize={18}
                  i18nKey={`products.specification.${specification}`}
                  color={colors.transparent5}
                  sspL
                />
              </View>
              <View style={{ flex: 1 }}>
                <GoldBrokerText left fontSize={18} value={value} sspL />
              </View>
            </Row>
          );
        }
      })}
    </Container>
  );
};
