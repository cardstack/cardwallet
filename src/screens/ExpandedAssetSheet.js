import { useRoute } from '@react-navigation/native';
import React, { createElement } from 'react';
import { StatusBar } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import styled from 'styled-components';

import TouchableBackdrop from '../components/TouchableBackdrop';
import {
  AvailableBalancesExpandedState,
  ChartExpandedState,
  LifetimeEarningsExpandedState,
  LiquidityPoolExpandedState,
  MerchantTransactionExpandedState,
  PaymentConfirmationExpandedState,
  SupportAndFeedsState,
  UnclaimedRevenueExpandedState,
} from '../components/expanded-state';
import { Centered } from '../components/layout';
import { useAsset, useDimensions } from '../hooks';
import { useNavigation } from '../navigation/Navigation';
import { ExpandedMerchantRoutes } from '@cardstack/screen/MerchantScreen';
import { PaymentRequestExpandedState } from '@cardstack/screen/PaymentRequest';
import { position } from '@rainbow-me/styles';

const ScreenTypes = {
  token: ChartExpandedState,
  uniswap: LiquidityPoolExpandedState,
  [ExpandedMerchantRoutes.lifetimeEarnings]: LifetimeEarningsExpandedState,
  [ExpandedMerchantRoutes.unclaimedRevenue]: UnclaimedRevenueExpandedState,
  [ExpandedMerchantRoutes.availableBalances]: AvailableBalancesExpandedState,
  [ExpandedMerchantRoutes.paymentRequest]: PaymentRequestExpandedState,
  merchantTransaction: MerchantTransactionExpandedState,
  paymentConfirmationTransaction: PaymentConfirmationExpandedState,
  supportAndFees: SupportAndFeedsState,
};

const Container = styled(Centered).attrs({
  direction: 'column',
})`
  ${position.cover};
  ${({ deviceHeight, height }) =>
    height ? `height: ${height + deviceHeight}` : null};
`;

export default function ExpandedAssetSheet(props) {
  const { height: deviceHeight } = useDimensions();
  const insets = useSafeArea();
  const { goBack } = useNavigation();
  const { params } = useRoute();

  const selectedAsset = useAsset(params.asset);

  return (
    <Container
      deviceHeight={deviceHeight}
      height={params.longFormHeight}
      insets={insets}
    >
      <StatusBar barStyle="light-content" />
      {ios && <TouchableBackdrop onPress={goBack} />}
      {createElement(ScreenTypes[params.type], {
        asset: selectedAsset,
        safeAddress: params?.safeAddress,
        customFunction: params?.customFunction,
        ...props,
      })}
    </Container>
  );
}
