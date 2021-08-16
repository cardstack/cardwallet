import React, { useEffect } from 'react';
import { useLifetimeEarningsData } from '../../../cardstack/src/hooks/use-lifetime-earnings-data';
import { SlackSheet } from '../sheet';
import {
  Container,
  HorizontalDivider,
  Icon,
  Text,
} from '@cardstack/components';
import { palette } from '@cardstack/theme';
import { MerchantSafeType } from '@cardstack/types';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';
import { ChartPath } from '@rainbow-me/animated-charts';
import { useNavigation } from '@rainbow-me/navigation';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const CHART_HEIGHT = 350;
const HEIGHT = CHART_HEIGHT + 250;

export default function LifetimeEarningsExpandedState(props: {
  asset: MerchantSafeType;
}) {
  const merchantSafe = props.asset;
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      longFormHeight: HEIGHT,
    });
  }, [setOptions]);

  const { accumulatedSpendValue } = merchantSafe;

  const { data } = useLifetimeEarningsData(merchantSafe.address);

  const [nativeCurrency, currencyConversionRates] = useRainbowSelector<
    [string, { [key: string]: number }]
  >(state => [state.settings.nativeCurrency, state.currencyConversion.rates]);

  const {
    tokenBalanceDisplay,
    nativeBalanceDisplay,
  } = convertSpendForBalanceDisplay(
    accumulatedSpendValue,
    nativeCurrency,
    currencyConversionRates
  );

  return (
    <SlackSheet bottomInset={42} contentHeight={HEIGHT} scrollEnabled>
      <Container height="100%" paddingHorizontal={5} paddingVertical={3}>
        <Text size="medium">Lifetime earnings</Text>
        <Container alignItems="flex-start" flexDirection="row" marginTop={8}>
          <Icon name="spend" size={40} />
          <Container flexDirection="column" marginLeft={4}>
            <Text size="largeBalance" weight="extraBold">
              {tokenBalanceDisplay}
            </Text>
            <Text weight="extraBold">
              SPEND <Text weight="regular">to date</Text>
            </Text>
            <Text variant="subText">{nativeBalanceDisplay}</Text>
          </Container>
        </Container>
        <Container width="100%">
          <ChartPath
            data={{ points: data, smoothingStrategy: 'bezier' }}
            gestureEnabled={false}
            height={CHART_HEIGHT}
            stroke={palette.tealDark}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3.5}
            width={325}
          >
            <Container height={CHART_HEIGHT} />
          </ChartPath>
        </Container>
        <HorizontalDivider />
        <Text size="medium">Activities</Text>
        <Container alignItems="center" marginTop={4} width="100%">
          <Text>No activity data</Text>
        </Container>
      </Container>
    </SlackSheet>
  );
}
