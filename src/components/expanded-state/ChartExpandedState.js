import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React, { useRef } from 'react';

import { useAccountSettings, useChartThrottledPoints } from '../../hooks';
import {
  BuyActionButton,
  SendActionButton,
  SheetActionButtonRow,
  SheetDivider,
  SlackSheet,
  SwapActionButton,
} from '../sheet';
import {
  TokenInfoBalanceValue,
  TokenInfoItem,
  TokenInfoRow,
  TokenInfoSection,
} from '../token-info';
import { Chart } from '../value-chart';
import { Container } from '@cardstack/components';
import { ChartPathProvider } from '@rainbow-me/animated-charts';
import AssetInputTypes from '@rainbow-me/helpers/assetInputTypes';

const heightWithoutChart = 309;
const heightWithChart = heightWithoutChart + 310;

export const initialChartExpandedStateSheetHeight = heightWithChart;

export default function ChartExpandedState(props) {
  // const nativeCurrency = useSelector(state => state.settings.nativeCurrency);

  const asset = props.asset.token
    ? {
        ...props.asset,
        ...props.asset.token,
      }
    : props.asset;

  const {
    chart,
    chartData,
    chartType,
    color,
    fetchingCharts,
    initialChartDataLabels,
    showChart,
    throttledData,
  } = useChartThrottledPoints({
    asset,
    heightWithChart,
    heightWithoutChart,
  });

  const { network } = useAccountSettings();
  /* disable for beta */
  const showSwapButton = false;
  // const { uniswapAssetsInWallet } = useUniswapAssetsInWallet();
  // const showSwapButton = isLayer1(network)
  //   ? find(uniswapAssetsInWallet, ['uniqueId', asset.uniqueId])
  //   : false;

  const nativeTokenAddress = getConstantByNetwork(
    'nativeTokenAddress',
    network
  );
  const needsEth =
    asset.address === nativeTokenAddress && asset.balance.amount === '0';

  const duration = useRef(0);

  if (duration.current === 0) {
    duration.current = 300;
  }
  const ChartExpandedStateSheetHeight =
    ios || showChart ? heightWithChart : heightWithoutChart;

  return (
    <SlackSheet
      additionalTopPadding={android}
      contentHeight={ChartExpandedStateSheetHeight}
      scrollEnabled={false}
    >
      <ChartPathProvider data={throttledData}>
        <Chart
          {...chartData}
          {...initialChartDataLabels}
          asset={asset}
          chart={chart}
          chartType={chartType}
          color={color}
          fetchingCharts={fetchingCharts}
          nativePoints={chart}
          showChart={showChart}
          throttledData={throttledData}
        />
      </ChartPathProvider>
      <SheetDivider />
      <TokenInfoSection>
        <TokenInfoRow>
          <TokenInfoItem asset={asset} title="Balance">
            <TokenInfoBalanceValue />
          </TokenInfoItem>
          {asset?.native?.price.display && (
            <TokenInfoItem align="right" title="Value" weight="bold">
              {`${asset?.native?.balance.display}`}
            </TokenInfoItem>
          )}
        </TokenInfoRow>
      </TokenInfoSection>
      {needsEth ? (
        <SheetActionButtonRow>
          <BuyActionButton color={color} fullWidth />
        </SheetActionButtonRow>
      ) : (
        <Container
          alignItems="center"
          flexDirection="row"
          justifyContent="space-around"
          paddingTop={2}
          width="100%"
        >
          {showSwapButton && (
            <SwapActionButton color={color} inputType={AssetInputTypes.in} />
          )}
          <SendActionButton
            asset={asset}
            color={color}
            small={showSwapButton} //reenable once swap functionality is fixed
          />
        </Container>
      )}
    </SlackSheet>
  );
}
