import { useRoute } from '@react-navigation/native';
import React, { createElement } from 'react';
import { StatusBar } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import styled from 'styled-components';

import TouchableBackdrop from '../components/TouchableBackdrop';
import {
  ChartExpandedState,
  LifetimeEarningsExpandedState,
  LiquidityPoolExpandedState,
  UnclaimedRevenueExpandedState,
  UniqueTokenExpandedState,
} from '../components/expanded-state';
import { Centered } from '../components/layout';
import { useAsset, useDimensions } from '../hooks';
import { useNavigation } from '../navigation/Navigation';
import { position } from '@rainbow-me/styles';

const ScreenTypes = {
  token: ChartExpandedState,
  unique_token: UniqueTokenExpandedState,
  uniswap: LiquidityPoolExpandedState,
  lifetimeEarnings: LifetimeEarningsExpandedState,
  unclaimedRevenue: UnclaimedRevenueExpandedState,
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
        ...props,
      })}
    </Container>
  );
}
