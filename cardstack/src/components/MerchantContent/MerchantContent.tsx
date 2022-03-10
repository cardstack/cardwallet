import React, { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { strings } from './strings';
import { useClaimAllRevenue } from '@cardstack/screens/sheets/UnclaimedRevenue/useClaimAllRevenue';
import {
  Button,
  Container,
  HorizontalDivider,
  ScrollView,
  MerchantHeader,
  MerchantTokensList,
} from '@cardstack/components';
import { MerchantSafeType } from '@cardstack/types';
import Routes from '@rainbow-me/routes';

const HORIZONTAL_PADDING = 5;
// For avoiding occlusing the network tag.
// This needs to be removed once we're good with the new tab bar.
const BOTTOM_PADDING = 260;

export enum ExpandedMerchantRoutes {
  lifetimeEarnings = 'lifetimeEarnings',
  availableBalances = 'availableBalances',
}

export interface MerchantContentProps {
  merchantSafe: MerchantSafeType;
  isRefreshingBalances: boolean;
  isPrimarySafe: boolean;
  showSafePrimarySelection: boolean;
  changeToPrimarySafe?: () => void;
}

export const MerchantContent = memo(
  ({
    merchantSafe,
    isRefreshingBalances,
    isPrimarySafe,
    changeToPrimarySafe,
    showSafePrimarySelection = false,
  }: MerchantContentProps) => {
    const { navigate } = useNavigation();

    const onClaimAllPress = useClaimAllRevenue({
      merchantSafe,
      isRefreshingBalances,
    });

    const onPressGoTo = useCallback(
      (type: ExpandedMerchantRoutes) => () => {
        navigate(Routes.EXPANDED_ASSET_SHEET, {
          asset: merchantSafe,
          type,
        });
      },
      [merchantSafe, navigate]
    );

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

    return (
      <Container height="100%" justifyContent="flex-end" paddingBottom={4}>
        <ScrollView
          width="100%"
          contentContainerStyle={styles.contentContainer}
          paddingHorizontal={HORIZONTAL_PADDING}
        >
          <MerchantHeader
            showSafePrimarySelection={showSafePrimarySelection}
            isPrimarySafe={isPrimarySafe}
            changeToPrimarySafe={changeToPrimarySafe}
            merchantInfo={merchantSafe.merchantInfo}
          />
          <Button
            marginTop={2}
            marginBottom={4}
            onPress={goToMerchantPaymentRequest}
          >
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
            onPress={onPressGoTo(ExpandedMerchantRoutes.availableBalances)}
            emptyText={strings.noAvailableBalance}
            tokens={merchantSafe.tokens}
          />
        </ScrollView>
      </Container>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    paddingBottom: BOTTOM_PADDING,
  },
});
