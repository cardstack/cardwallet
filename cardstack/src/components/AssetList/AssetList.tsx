import React, { useState } from 'react';
import { LayoutAnimation, RefreshControl, SectionList } from 'react-native';

import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import AddFundsInterstitial from '../../../../src/components/AddFundsInterstitial';
import ButtonPressAnimation from '../../../../src/components/animations/ButtonPressAnimation';
import { AssetFooter } from './AssetFooter';
import { AssetListLoading } from './AssetListLoading';
import { Button, Container, Icon, Text } from '@cardstack/components';
import {
  PinnedHiddenSectionOption,
  usePinnedAndHiddenItemOptions,
  useRefreshAccountData,
} from '@rainbow-me/hooks';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

interface HeaderItem {
  title: string;
  count?: number;
  showContextMenu?: boolean;
  total?: string;
  type?: PinnedHiddenSectionOption;
}

export type AssetListSectionItem<ComponentProps> = {
  Component: (
    props: ComponentProps & { networkName: string; nativeCurrency: string }
  ) => JSX.Element;
  header: HeaderItem;
  data: ComponentProps[];
};

interface AssetListProps {
  isEmpty: boolean;
  loading: boolean;
  network: string;
  nativeCurrency: string;
  sections: AssetListSectionItem<any>[];
}

export const AssetList = (props: AssetListProps) => {
  const refresh = useRefreshAccountData();
  const [refreshing, setRefreshing] = useState(false);

  const { isEmpty, loading, sections, network, nativeCurrency } = props;
  const networkName = getConstantByNetwork('name', network);

  const { editing, toggle } = usePinnedAndHiddenItemOptions();

  function toggleEditingPinnedHidden(type: PinnedHiddenSectionOption) {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    );

    toggle(type);
  }

  async function onRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  if (loading) {
    return <AssetListLoading />;
  }

  if (isEmpty) {
    return <AddFundsInterstitial network={network} />;
  }

  return (
    <>
      <SectionList
        refreshControl={
          <RefreshControl
            tintColor="white"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        sections={sections}
        renderItem={({ item, section: { Component } }) => (
          <Component
            {...item}
            networkName={networkName}
            nativeCurrency={nativeCurrency}
          />
        )}
        renderSectionHeader={({ section }) => {
          const {
            header: { type, title, count, showContextMenu, total },
          } = section;

          const isEditing = type === editing;

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
                  <Text
                    color="buttonPrimaryBorder"
                    size="medium"
                    marginLeft={2}
                  >
                    {count}
                  </Text>
                ) : null}
              </Container>
              <Container
                marginRight={3}
                alignItems="center"
                flexDirection="row"
              >
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
                  isEditing ? (
                    <Button
                      variant="tiny"
                      onPress={() => toggleEditingPinnedHidden(type)}
                    >
                      DONE
                    </Button>
                  ) : (
                    <ButtonPressAnimation
                      onPress={() => {
                        showActionSheetWithOptions(
                          {
                            options: ['Edit', 'Cancel'],
                            cancelButtonIndex: 1,
                          },
                          (buttonIndex: number) => {
                            if (buttonIndex === 0) {
                              toggleEditingPinnedHidden(type);
                            }
                          }
                        );
                      }}
                    >
                      <Icon name="more-circle" />
                    </ButtonPressAnimation>
                  )
                ) : null}
              </Container>
            </Container>
          );
        }}
        contentContainerStyle={{ paddingBottom: 180 }}
      />
      <AssetFooter sections={sections} />
    </>
  );
};
