import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Switch } from 'react-native';
import {
  Container,
  Skeleton,
  Text,
  MerchantSafe,
  MerchantSafeProps,
} from '@cardstack/components';
import { useGetSafesDataQuery } from '@cardstack/services';
import { isLayer1 } from '@cardstack/utils';
import { useAccountSettings, useMerchantSafeSection } from '@rainbow-me/hooks';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';

const safesInitialState = {
  prepaidCards: [],
  depots: [],
  merchantSafes: [],
  timestamp: '',
};

const PrimaryPaymentAccountSection = () => {
  const [nativeCurrency] = useNativeCurrencyAndConversionRates();
  const { network, accountAddress } = useAccountSettings();
  const walletReady = useRainbowSelector(state => state.appState.walletReady);

  const {
    isFetching,
    isLoading,
    refetch,
    data = safesInitialState,
    isUninitialized,
    error,
  } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      skip: isLayer1(network) || !accountAddress || !walletReady,
    }
  );

  const { merchantSafes, timestamp } = data;

  const merchantSafesSection = useMerchantSafeSection(merchantSafes, timestamp);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MerchantSafeProps>) => {
      return <MerchantSafe {...item} />;
    },
    [onUpdateOptionStatus]
  );

  const ListError = useMemo(
    () => (
      <Container alignItems="center" flex={1} justifyContent="center">
        <Text>{error}</Text>
      </Container>
    ),
    [error]
  );

  const ListLoading = useMemo(
    () => (
      <Container
        flexDirection="column"
        paddingHorizontal={6}
        paddingVertical={2}
      >
        {[...Array(2)].map((v, i) => (
          <Skeleton
            height={100}
            key={`${i}`}
            light
            marginBottom={1}
            width="100%"
          />
        ))}
      </Container>
    ),
    []
  );

  const keyExtractor = (item: MerchantSafeProps, index: number) => `${index}`;

  return (
    <FlatList
      ListEmptyComponent={error ? ListError : ListLoading}
      contentContainerStyle={styles.contentContainer}
      data={merchantSafes}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 16,
  },
});

export default PrimaryPaymentAccountSection;
