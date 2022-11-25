import { useRoute } from '@react-navigation/native';
import React, { useRef } from 'react';

import { Container, Sheet } from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';
import { AssetWithNativeType } from '@cardstack/types';

import { ChartPathProvider } from '@rainbow-me/animated-charts';
import { SendActionButton } from '@rainbow-me/components/sheet';
import { Chart } from '@rainbow-me/components/value-chart';
import { useChartThrottledPoints } from '@rainbow-me/hooks';

import AmountWithCoin from './components/AmountWithCoin';
import NativeAmount from './components/NativeAmount';
import { strings } from './strings';

type RouteParams = {
  asset: AssetWithNativeType;
  safeAddress?: string;
};

export default function TokenWithChartSheet() {
  const { params } = useRoute<RouteType<RouteParams>>();

  const { asset, safeAddress } = params;

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

  const duration = useRef(0);

  if (duration.current === 0) {
    duration.current = 300;
  }

  const hasNativeBalance = !!parseFloat(asset.native?.balance.amount);

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
          isPool={false}
          nativePoints={chart}
          showChart={showChart}
          throttledData={throttledData}
        />
      </ChartPathProvider>
      <Container
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        marginVertical={2}
        paddingHorizontal={5}
      >
        <AmountWithCoin title={strings.balance} asset={asset} />
        {hasNativeBalance && (
          <NativeAmount title={strings.value} asset={asset} />
        )}
      </Container>
      <Container
        alignItems="center"
        flexDirection="row"
        justifyContent="space-around"
        paddingTop={2}
        width="100%"
      >
        <SendActionButton
          asset={asset}
          safeAddress={safeAddress}
          small={false}
        />
      </Container>
    </Sheet>
  );
}
