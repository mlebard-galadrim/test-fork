import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "../../../store/configure.store";
import { SeeMoreButton } from "../../generic/buttons/see-more-button.component";
import { SectionTitle } from "../../generic/section-title.component";
import { ProductCard } from "../../products/product-card.component";

const Section = styled(ScrollView)`
  margin-bottom: 32px;
  margin-left: 16px;
`;

const puce = require(`../../../../assets/puces/puces-main.png`);

export const SectionProduct = (props) => {
  const navigation = useNavigation();
  const products = useSelector((state: State) => state.dataStore.products);

  const goToProduct = () => {
    navigation.navigate("Products");
  };
  return (
    <Section>
      <SectionTitle i18nKey={props.i18nKey} />
      <ScrollView style={{ marginBottom: 10 }} horizontal showsHorizontalScrollIndicator={false}>
        {products
          .filter((p) => (props.currentProduct ? p.id !== props.currentProduct.id : true))
          .map((item, key) => {
            return (
              <ProductCard
                title={item.name}
                price={item.as_low_as}
                picture={item.picture}
                key={key}
                width={156}
                product={item}
                year={item.year}
                metal={item.metal.type}
                goToTop={props.goToTop}
              />
            );
          })}
      </ScrollView>
      {props.button && <SeeMoreButton i18nKey="home.moreProducts" onPress={goToProduct} />}
    </Section>
  );
};
