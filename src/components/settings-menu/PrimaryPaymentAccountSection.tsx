import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native';
import {
  Container,
  MerchantSafe,
  MerchantSafeProps,
  Skeleton,
  Text,
} from '@cardstack/components';
import usePrimaryMerchant from '@cardstack/redux/hooks/usePrimaryMerchant';
import { useGetSafesDataQuery } from '@cardstack/services';
import { colors } from '@cardstack/theme';
import { MerchantSafeType } from '@cardstack/types';
import { useAccountSettings } from '@rainbow-me/hooks';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';

const initialState = {
  merchantSafes: [],
};

const PrimaryPaymentAccountSection = () => {
  const [nativeCurrency] = useNativeCurrencyAndConversionRates();
  const { accountAddress } = useAccountSettings();
  const { changePrimaryMerchant, primaryMerchant } = usePrimaryMerchant();

  const { data = initialState, error } = useGetSafesDataQuery({
    address: accountAddress,
    nativeCurrency,
  });

  const { merchantSafes } = data;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MerchantSafeType>) => {
      return (
        <MerchantSafe
          isSelected={primaryMerchant?.address === item.address}
          setSelected={() => changePrimaryMerchant(item)}
          {...(item as MerchantSafeProps)}
        />
      );
    },
    [changePrimaryMerchant, primaryMerchant]
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

  const keyExtractor = (item: MerchantSafeType) => item.address;

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
    backgroundColor: colors.backgroundBlue,
  },
});

export default PrimaryPaymentAccountSection;
