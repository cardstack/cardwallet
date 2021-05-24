import React from 'react';
import { SectionList } from 'react-native';

import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import AddFundsInterstitial from '../../../../src/components/AddFundsInterstitial';
import ButtonPressAnimation from '../../../../src/components/animations/ButtonPressAnimation';
import { AssetListLoading } from './AssetListLoading';
import { Container, Icon, Text } from '@cardstack/components';

interface HeaderItem {
  title: string;
  count?: number;
  showContextMenu?: boolean;
  total?: string;
}

export type AssetListSectionItem<ComponentProps> = {
  Component: (props: ComponentProps & { networkName: string }) => JSX.Element;
  header: HeaderItem;
  data: ComponentProps[];
};

interface AssetListProps {
  isEmpty: boolean;
  loading: boolean;
  network: string;
  sections: AssetListSectionItem<any>[];
}

export const AssetList = (props: AssetListProps) => {
  const { isEmpty, loading, sections, network } = props;
  const networkName = getConstantByNetwork('name', network);

  if (loading) {
    return <AssetListLoading />;
  }

  if (isEmpty) {
    return <AddFundsInterstitial network={network} />;
  }

  return (
    <SectionList
      sections={sections}
      renderItem={({ item, section: { Component } }) => (
        <Component {...item} networkName={networkName} />
      )}
      renderSectionHeader={({ section }) => {
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
      }}
    />
  );
};
