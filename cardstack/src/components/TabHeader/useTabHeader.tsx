import React, { useState, useCallback } from 'react';

import { Container } from '@cardstack/components';

import { TabHeaderButton } from '.';

export interface TabType {
  title: string;
  key: string | number;
}

export interface TabsArrayProps {
  tabs: Array<TabType>;
  lightMode?: boolean;
}

export const useTabHeader = ({ tabs, lightMode = true }: TabsArrayProps) => {
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
              color={lightMode ? 'black' : 'white'}
              isSelected={tab.key === currentTab.key}
              title={tab.title}
              onPress={() => setCurrentTab(tab)}
            />
          ))}
        </Container>
        {lightMode && (
          <Container
            backgroundColor="borderLightColor"
            height={1}
            width="100%"
          />
        )}
      </>
    ),
    [tabs, lightMode, currentTab.key]
  );

  return {
    currentTab,
    TabHeader: tabHeaderComp,
  };
};
