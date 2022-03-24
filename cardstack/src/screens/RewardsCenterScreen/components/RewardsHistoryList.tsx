import React, { useCallback } from 'react';
import { SectionList } from 'react-native';
import { RewardRow, RewardRowProps } from '.';
import { Container, Text } from '@cardstack/components';

interface RewardsHistoryListProps {
  sections: [
    {
      title: string;
      data: Array<RewardRowProps>;
    }
  ];
}

export const RewardsHistoryList = ({ sections }: RewardsHistoryListProps) => {
  const renderSectionHeader = useCallback(
    ({ section }) => <Text size="medium">{section.title}</Text>,
    []
  );

  const renderItem = useCallback(({ item }) => <RewardRow {...item} />, []);

  const spacing = useCallback(() => <Container paddingBottom={4} />, []);

  return (
    <SectionList
      renderSectionHeader={renderSectionHeader}
      sections={sections}
      renderItem={renderItem}
      ItemSeparatorComponent={spacing}
      SectionSeparatorComponent={spacing}
    />
  );
};
