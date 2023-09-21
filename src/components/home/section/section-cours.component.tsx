import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "../../../store/configure.store";
import { SectionTitle } from "../../generic/section-title.component";
import { MetalRate } from "../metal-rate.component";

const Section = styled(View)`
  margin-bottom: 37px;
  margin-left: 16px;
  margin-right: 16px;
`;

export const SectionCours = (props) => {
  const metals = useSelector((state: State) => state.metalsStore);
  const currency = useSelector((state: State) => state.preferencesStore.currency);

  return (
    <Section>
      <SectionTitle i18nKey="home.rate" />
      <MetalRate value={metals.XAU?.[currency]?.oz.value} performance={metals.XAU?.[currency]?.oz.performance} metal="or" />
      <MetalRate value={metals.XAG?.[currency]?.oz.value} performance={metals.XAG?.[currency]?.oz.performance} metal="argent" />
    </Section>
  );
};
