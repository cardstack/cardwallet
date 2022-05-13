import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React, { useRef } from 'react';

import { useAccountSettings, useChartThrottledPoints } from '../../hooks';
import {
  BuyActionButton,
  SendActionButton,
  SheetActionButtonRow,
  SheetDivider,
} from '../sheet';
import {
  TokenInfoBalanceValue,
  TokenInfoItem,
  TokenInfoRow,
  TokenInfoSection,
} from '../token-info';
import { Chart } from '../value-chart';
import { Container, Sheet } from '@cardstack/components';
import { ChartPathProvider } from '@rainbow-me/animated-charts';

export default function ChartExpandedState(props) {
  const currentAsset = props.asset;

  const asset = props.asset?.token
    ? {
        ...props.asset,
        ...props.asset.token,
      }
    : currentAsset;

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
  });

  const { network } = useAccountSettings();

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

  const hasNativeBalance = !!parseFloat(asset?.native?.balance?.amount);

  return (
    <Sheet scrollEnabled={false}>
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
          {hasNativeBalance && (
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
          <SendActionButton
            asset={currentAsset}
            color={color}
            safeAddress={props.safeAddress}
            small={false} //reenable once swap functionality is fixed
          />
        </Container>
      )}
    </Sheet>
  );
}
