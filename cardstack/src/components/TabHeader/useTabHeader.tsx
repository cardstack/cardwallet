import React, { useState, useCallback } from 'react';

import { Container } from '@cardstack/components';
import {
  colorStyleVariants,
  ThemeVariant,
} from '@cardstack/theme/colorStyleVariants';

import { TabHeaderButton } from '.';

export interface TabType {
  title: string;
  key: string | number;
}

export interface TabsArrayProps {
  tabs: Array<TabType>;
  variant?: ThemeVariant;
}

export const useTabHeader = ({ tabs, variant = 'light' }: TabsArrayProps) => {
  const [currentTab, setCurrentTab] = useState<TabType>(tabs[0]);

  const tabHeaderComp = useCallback(
    () => (
      <>
        <Container
          paddingHorizontal={5}
          flexDirection="row"
          justifyContent="space-between"
        >
          {tabs.map(tab => (
            <TabHeaderButton
              color={colorStyleVariants.textColor[variant]}
              isSelected={tab.key === currentTab.key}
              title={tab.title}
              onPress={() => setCurrentTab(tab)}
            />
          ))}
        </Container>
        {variant === 'light' && (
          <Container
            backgroundColor="borderLightColor"
            height={1}
            width="100%"
          />
        )}
      </>
    ),
    [tabs, variant, currentTab.key]
  );

  return {
    currentTab,
    TabHeader: tabHeaderComp,
  };
};
