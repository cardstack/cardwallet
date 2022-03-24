import React, { useState, useCallback } from 'react';
import { TabHeaderButton } from '.';
import { Container } from '@cardstack/components';

export interface TabType {
  title: string;
  key: string;
}

export interface TabsArrayProps {
  tabs: Array<TabType>;
}

export const useTabHeader = ({ tabs }: TabsArrayProps) => {
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
              isSelected={tab.key === currentTab.key}
              title={tab.title}
              onPress={() => setCurrentTab(tab)}
            />
          ))}
        </Container>
        <Container backgroundColor="borderLightColor" height={1} width="100%" />
      </>
    ),
    [tabs, currentTab]
  );

  return {
    currentTab,
    TabHeader: tabHeaderComp,
  };
};
