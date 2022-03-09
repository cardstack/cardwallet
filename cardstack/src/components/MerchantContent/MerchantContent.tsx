import React, { memo, useCallback } from 'react';
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
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';

const HORIZONTAL_PADDING = 5;

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
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 260 }}
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

const strings = {
  requestPayment: 'Request Payment',
  readyToClaim: 'Ready to Claim',
  noPendingPayment: 'No pending payments',
  availableBalance: 'Your Available Balance',
  noAvailableBalance: 'No balance available',
};
