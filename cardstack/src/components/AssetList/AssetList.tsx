import React, { useState, useCallback, useEffect, createRef } from 'react';
import { LayoutAnimation, RefreshControl, SectionList } from 'react-native';
import { BackgroundColorProps, ColorProps } from '@shopify/restyle';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useRoute } from '@react-navigation/core';
import AddFundsInterstitial from '../../../../src/components/AddFundsInterstitial';
import ButtonPressAnimation from '../../../../src/components/animations/ButtonPressAnimation';
import { Theme } from '../../theme';
import { AssetFooter } from './AssetFooter';
import { AssetListLoading } from './AssetListLoading';
import {
  Button,
  Container,
  ListEmptyComponent,
  Icon,
  Text,
} from '@cardstack/components';
import { isLayer1, Device } from '@cardstack/utils';
import {
  PinnedHiddenSectionOption,
  useAccountProfile,
  usePinnedAndHiddenItemOptions,
  useRefreshAccountData,
  useWallets,
} from '@rainbow-me/hooks';
import showWalletErrorAlert from '@rainbow-me/helpers/support';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { showActionSheetWithOptions } from '@rainbow-me/utils';
import logger from 'logger';
import { Network } from '@rainbow-me/helpers/networkTypes';

interface HeaderItem {
  title: string;
  count?: number;
  showContextMenu?: boolean;
  total?: string;
  type?: PinnedHiddenSectionOption;
}

export type AssetListSectionItem<ComponentProps> = {
  Component: (
    props: ComponentProps & {
      networkName: string;
      nativeCurrency: string;
      currencyConversionRates: {
        [key: string]: number;
      };
    }
  ) => JSX.Element | null;
  header: HeaderItem;
  data: ComponentProps[];
};

interface AssetListProps
  extends BackgroundColorProps<Theme>,
    ColorProps<Theme> {
  isEmpty: boolean;
  loading: boolean;
  network: Network;
  nativeCurrency: string;
  currencyConversionRates: {
    [key: string]: number;
  };
  sections: AssetListSectionItem<any>[];
  headerPaddingVertical?: number;
  headerPaddingHorizontal?: number;
}

interface RouteType {
  params: {
    scrollToPrepaidCardsSection?: boolean;
    forceRefreshOnce?: boolean;
  };
  key: string;
  name: string;
}

// We need to pass this prop if the section to scrollTo is not on viewport
const onScrollToIndexFailed = () => {
  logger.log('onScrollToIndexFailed');
};

export const AssetList = (props: AssetListProps) => {
  const sectionListRef = createRef<SectionList>();
  const refresh = useRefreshAccountData();
  const [refreshing, setRefreshing] = useState(false);
  const { accountAddress } = useAccountProfile();
  const { navigate, setParams } = useNavigation();
  const { params } = useRoute<RouteType>();

  const { isDamaged } = useWallets();

  const {
    isEmpty,
    loading,
    sections,
    network,
    nativeCurrency,
    currencyConversionRates,
    backgroundColor,
    color,
    headerPaddingVertical,
    headerPaddingHorizontal,
  } = props;

  const networkName = getConstantByNetwork('name', network);

  const { editing, toggle } = usePinnedAndHiddenItemOptions();

  function toggleEditingPinnedHidden(type?: PinnedHiddenSectionOption) {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    );

    type && toggle(type);
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh, setRefreshing]);

  useEffect(() => {
    if (params?.forceRefreshOnce) {
      // Set to false so it won't update on assetsRefresh
      onRefresh();
      setParams({ forceRefreshOnce: false });
    }
  }, [onRefresh, params, sectionListRef, sections, setParams]);

  useEffect(() => {
    if (params?.scrollToPrepaidCardsSection) {
      const prepaidCardSectionIndex = sections.findIndex(
        section =>
          section.header.type === PinnedHiddenSectionOption.PREPAID_CARDS
      );

      sectionListRef.current?.scrollToLocation({
        animated: false,
        sectionIndex: prepaidCardSectionIndex,
        itemIndex: 0,
      });

      // Set to false so it won't update on assetsRefresh
      setTimeout(() => {
        setParams({ scrollToPrepaidCardsSection: false });
      }, 2500);
    }
  }, [params, sectionListRef, sections, setParams]);

  const goToBuyPrepaidCard = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();

      return;
    }

    if (Device.isIOS) {
      if (isLayer1(network)) {
        navigate(Routes.ADD_CASH_FLOW);
      } else {
        navigate(Routes.BUY_PREPAID_CARD);
      }
    } else {
      navigate(Routes.WYRE_WEBVIEW_NAVIGATOR, {
        params: {
          address: accountAddress,
        },
        screen: Routes.WYRE_WEBVIEW,
      });
    }
  }, [isDamaged, network, navigate, accountAddress]);

  if (loading) {
    return <AssetListLoading />;
  }

  if (isEmpty && isLayer1(network)) {
    return <AddFundsInterstitial />;
  }

  return (
    <>
      <SectionList
        onScrollToIndexFailed={onScrollToIndexFailed}
        ref={sectionListRef}
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
            currencyConversionRates={currencyConversionRates}
          />
        )}
        renderSectionHeader={({ section }) => {
          const {
            header: { type, title, count, showContextMenu, total },
            data,
          } = section;

          const isEditing = type === editing;

          const isEmptyPrepaidCard =
            type === PinnedHiddenSectionOption.PREPAID_CARDS &&
            data.length === 0;

          return (
            <>
              <Container
                alignItems="center"
                flexDirection="row"
                justifyContent="space-between"
                padding={4}
                paddingHorizontal={headerPaddingHorizontal}
                paddingVertical={headerPaddingVertical}
                backgroundColor={backgroundColor || 'backgroundBlue'}
              >
                <Container flexDirection="row">
                  <Text color={color || 'white'} size="medium">
                    {title}
                  </Text>
                  {count ? (
                    <Text color="tealDark" size="medium" marginLeft={2}>
                      {count}
                    </Text>
                  ) : null}
                </Container>
                <Container alignItems="center" flexDirection="row">
                  {total ? (
                    <Text
                      color="tealDark"
                      size="body"
                      weight="extraBold"
                      marginRight={showContextMenu ? 3 : 0}
                    >
                      {total}
                    </Text>
                  ) : null}
                  {isEmptyPrepaidCard ? (
                    <Button variant="tinyOpacity" onPress={goToBuyPrepaidCard}>
                      New Card
                    </Button>
                  ) : showContextMenu ? (
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
              {isEmptyPrepaidCard && (
                <Container marginHorizontal={4} alignItems="center">
                  <ListEmptyComponent
                    text={`You don't own any\nPrepaid Cards yet`}
                    width="100%"
                    hasRoundBox
                    textColor="blueText"
                  />
                  <Button onPress={goToBuyPrepaidCard} marginTop={4}>
                    Buy Prepaid Card
                  </Button>
                </Container>
              )}
            </>
          );
        }}
        contentContainerStyle={{ paddingBottom: 180 }}
      />
      <AssetFooter sections={sections} />
    </>
  );
};
