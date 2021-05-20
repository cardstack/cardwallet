/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';

import { SectionList } from 'react-native';
import AddFundsInterstitial from '../../../../src/components/AddFundsInterstitial';
import { AssetListItemSkeleton } from '../../../../src/components/asset-list';
import ButtonPressAnimation from '../../../../src/components/animations/ButtonPressAnimation';
import { Container, Text, Icon } from '@cardstack/components';

interface HeaderItem {
  title: string;
  count?: number;
  showContextMenu?: boolean;
  total?: string;
}

interface AssetListSectionItem {
  header: HeaderItem;
  data: any[];
}

interface AssetListProps {
  isEmpty: boolean;
  loading: boolean;
  network: string;
  sections: any[];
}

export const AssetList = (props: AssetListProps) => {
  const { isEmpty, loading, sections, network } = props;

  if (loading) {
    return (
      <Container>
        <AssetListItemSkeleton />
        <AssetListItemSkeleton />
        <AssetListItemSkeleton />
      </Container>
    );
  }

  if (isEmpty) {
    return <AddFundsInterstitial network={network} />;
  }

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
    />
  );
};

const renderItem = ({ item, section: { Component } }) => (
  <Component {...item} />
);

interface SectionHeaderProps {
  section: AssetListSectionItem;
}

const renderSectionHeader = ({ section }: SectionHeaderProps) => {
  const {
    header: { title, count, showContextMenu, total },
  } = section;

  return (
    <Container
      alignItems="center"
      flexDirection="row"
      justifyContent="space-between"
      padding={4}
      backgroundColor="backgroundBlue"
    >
      <Container flexDirection="row">
        <Text color="white" size="medium">
          {title}
        </Text>
        {count ? (
          <Text color="buttonPrimaryBorder" size="medium" marginLeft={2}>
            {count}
          </Text>
        ) : null}
      </Container>
      <Container marginRight={3} alignItems="center" flexDirection="row">
        {total ? (
          <Text
            color="buttonPrimaryBorder"
            size="body"
            weight="extraBold"
            marginRight={showContextMenu ? 3 : 0}
          >
            {total}
          </Text>
        ) : null}
        {showContextMenu ? (
          <ButtonPressAnimation>
            <Icon name="more-circle" />
          </ButtonPressAnimation>
        ) : null}
      </Container>
    </Container>
  );
};
