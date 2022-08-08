import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';

import {
  Button,
  HorizontalDivider,
  ScrollView,
  MerchantHeader,
  MerchantTokensList,
} from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import { useClaimAllRevenue } from '@cardstack/screens/sheets/UnclaimedRevenue/useClaimAllRevenue';
import { MerchantSafeType, PrimarySafeUpdateProps } from '@cardstack/types';

import { strings } from './strings';

export interface MerchantContentProps extends PrimarySafeUpdateProps {
  merchantSafe: MerchantSafeType;
  isRefreshingBalances: boolean;
  refetch?: () => void;
}

export const MerchantContent = memo(
  ({
    merchantSafe,
    isRefreshingBalances,
    isPrimarySafe,
    changeToPrimarySafe,
    showSafePrimarySelection = false,
    refetch,
  }: MerchantContentProps) => {
    const { navigate } = useNavigation();

    const onClaimAllPress = useClaimAllRevenue({
      merchantSafe,
      isRefreshingBalances,
    });

    const goToMerchantPaymentRequest = useCallback(
      () =>
        navigate(Routes.MERCHANT_PAYMENT_REQUEST_SHEET, {
          address: merchantSafe.address,
          merchantInfo: merchantSafe.merchantInfo,
        }),
      [merchantSafe, navigate]
    );

    const goToUnclaimedRevenue = useCallback(
      () =>
        navigate(Routes.UNCLAIMED_REVENUE_SHEET, {
          merchantSafe,
          onClaimAllPress,
        }),
      [onClaimAllPress, merchantSafe, navigate]
    );

    const goToAvailableBalance = useCallback(
      () =>
        navigate(Routes.AVAILABLE_BALANCE_SHEET, {
          merchantSafe,
        }),
      [merchantSafe, navigate]
    );

    return (
      <ScrollView
        paddingHorizontal={5}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            tintColor="blueText"
            refreshing={isRefreshingBalances}
            onRefresh={refetch}
          />
        }
      >
        <MerchantHeader
          showSafePrimarySelection={showSafePrimarySelection}
          isPrimarySafe={isPrimarySafe}
          changeToPrimarySafe={changeToPrimarySafe}
          merchantInfo={merchantSafe.merchantInfo}
        />
        <Button marginBottom={15} onPress={goToMerchantPaymentRequest}>
          {strings.requestPayment}
        </Button>
        <HorizontalDivider />
        <MerchantTokensList
          title={strings.readyToClaim}
          onPress={goToUnclaimedRevenue}
          emptyText={strings.noPendingPayment}
          tokens={merchantSafe.revenueBalances}
        />
        <MerchantTokensList
          title={strings.availableBalance}
          onPress={goToAvailableBalance}
          emptyText={strings.noAvailableBalance}
          tokens={merchantSafe.tokens}
        />
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
