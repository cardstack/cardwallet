import React, {
  useState,
  useCallback,
  useEffect,
  createRef,
  useMemo,
  useRef,
} from 'react';
import {
  RefreshControl,
  SectionList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { BackgroundColorProps, ColorProps } from '@shopify/restyle';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useRoute } from '@react-navigation/core';
import AddFundsInterstitial from '../../../../src/components/AddFundsInterstitial';
import { Theme } from '../../theme';
import { PinnedHiddenSectionMenu } from '../PinnedHiddenSectionMenu';
import { AssetFooter } from './AssetFooter';
import { AssetListLoading } from './AssetListLoading';
import {
  DiscordPromoBanner,
  useDiscordPromoBanner,
} from '@cardstack/components/DiscordPromoBanner';
import {
  Button,
  Container,
  ListEmptyComponent,
  Text,
} from '@cardstack/components';
import { isLayer1, dateFormatter, Device } from '@cardstack/utils';
import {
  PinnedHiddenSectionOption,
  useAccountProfile,
  useRefreshAccountData,
  useWallets,
} from '@rainbow-me/hooks';
import showWalletErrorAlert from '@rainbow-me/helpers/support';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import logger from 'logger';
import { Network } from '@rainbow-me/helpers/networkTypes';
import {
  AssetWithNativeType,
  CollectibleType,
  DepotType,
  MerchantSafeType,
  PrepaidCardType,
} from '@cardstack/types';

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
  timestamp?: string;
};

type SectionType =
  | PrepaidCardType
  | DepotType
  | MerchantSafeType
  | AssetWithNativeType
  | CollectibleType;

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
  sections: AssetListSectionItem<SectionType>[];
  headerPaddingVertical?: number;
  headerPaddingHorizontal?: number;
  refetchSafes: () => void;
  isFetchingSafes: boolean;
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

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 180,
  },
});

const strings = {
  lastUpdatedAt: (timestamp: string) =>
    `Last updated at: ${dateFormatter(
      parseFloat(timestamp),
      'MM/dd/yy',
      'h:mm a',
      ', '
    )}`,
  newCardLabel: 'New Card',
  buyCardLabel: 'Buy Prepaid Card',
  emptyCardMessage: `You don't own any\nPrepaid Cards yet`,
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
    isFetchingSafes,
  } = props;

  const networkName = getConstantByNetwork('name', network);

  const {
    showPromoBanner,
    onPress: onDiscordPromoPress,
  } = useDiscordPromoBanner();

  const renderPromoBanner = useMemo(
    () =>
      showPromoBanner ? (
        <DiscordPromoBanner onPress={onDiscordPromoPress} />
      ) : null,
    [onDiscordPromoPress, showPromoBanner]
  );

  const onRefresh = useCallback(async () => {
    props.refetchSafes();

    setRefreshing(true);

    await refresh();

    setRefreshing(false);
  }, [props, refresh]);

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

    navigate(Routes.BUY_PREPAID_CARD);
  }, [isDamaged, navigate]);

  const prevAccount = useRef(null);

  useEffect(() => {
    if (accountAddress) {
      prevAccount.current = accountAddress;
    }
  }, [accountAddress]);

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <AssetSectionHeader
        section={section}
        onBuyCardPress={goToBuyPrepaidCard}
      />
    ),
    [goToBuyPrepaidCard]
  );

  const renderSectionFooter = useCallback(
    ({ section: { timestamp, data } }) =>
      timestamp && !!data.length ? (
        <Container
          paddingHorizontal={4}
          alignItems="flex-end"
          justifyContent="center"
        >
          {isFetchingSafes ? (
            <ActivityIndicator size={15} color="white" />
          ) : (
            <Text color="white" size="xs">
              {strings.lastUpdatedAt(timestamp)}
            </Text>
          )}
        </Container>
      ) : null,
    [isFetchingSafes]
  );

  // Account was switched so show loading skeleton
  const isLoadingSafesDiffAccount = useMemo(
    () => isFetchingSafes && prevAccount.current !== accountAddress,
    [accountAddress, isFetchingSafes, prevAccount]
  );

  if (loading || isLoadingSafesDiffAccount) {
    return <AssetListLoading />;
  }

  if (isEmpty && isLayer1(network)) {
    return <AddFundsInterstitial />;
  }

  return (
    <>
      <SectionList
        ListHeaderComponent={renderPromoBanner}
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
        renderSectionFooter={renderSectionFooter}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.contentContainer}
      />
      <AssetFooter />
    </>
  );
};

interface AssetSectionProps {
  section: AssetListSectionItem<SectionType>;
  onBuyCardPress: () => void;
}

const AssetSectionHeader = ({ section, onBuyCardPress }: AssetSectionProps) => {
  const {
    header: { type, title, count, showContextMenu, total },
    data,
  } = section;

  const isEmptyPrepaidCard =
    type === PinnedHiddenSectionOption.PREPAID_CARDS && data.length === 0;

  const renderNewCardButton = useMemo(
    () =>
      Device.isIOS && (
        <Button variant="tinyOpacity" onPress={onBuyCardPress}>
          {strings.newCardLabel}
        </Button>
      ),
    [onBuyCardPress]
  );

  return (
    <>
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
          {isEmptyPrepaidCard
            ? renderNewCardButton
            : showContextMenu && <PinnedHiddenSectionMenu type={type} />}
        </Container>
      </Container>
      {isEmptyPrepaidCard && (
        <Container marginHorizontal={4} alignItems="center">
          <ListEmptyComponent
            text={strings.emptyCardMessage}
            width="100%"
            hasRoundBox
            textColor="blueText"
          />
          {Device.isIOS && (
            <Button onPress={onBuyCardPress} marginTop={4}>
              {strings.buyCardLabel}
            </Button>
          )}
        </Container>
      )}
    </>
  );
};
