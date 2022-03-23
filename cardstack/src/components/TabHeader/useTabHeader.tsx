import React, { useState, useCallback } from 'react';
import { TabHeaderButton } from '.';
import { Container } from '@cardstack/components';

export interface TabProps {
  title: string;
}

export interface TabsProps {
  tabs: Array<TabProps>;
}

export const useTabHeader = ({ tabs }: TabsProps) => {
  const [currentTab, setCurrentTab] = useState(0);

  const tabHeaderComp = useCallback(
    () => (
      <>
        <Container
          paddingHorizontal={5}
          flexDirection="row"
          justifyContent="space-between"
        >
          {tabs.map((tab, index) => (
            <TabHeaderButton
              isSelected={index === currentTab}
              title={tab.title}
              onPress={() => setCurrentTab(index)}
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
