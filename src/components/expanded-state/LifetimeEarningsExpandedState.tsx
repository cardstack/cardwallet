import React, { useEffect } from 'react';
import { SlackSheet } from '../sheet';
import {
  Container,
  HorizontalDivider,
  Icon,
  Text,
} from '@cardstack/components';
import { MerchantSafeType } from '@cardstack/types';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';
import { useNavigation } from '@rainbow-me/navigation';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const CHART_HEIGHT = 350;

export default function LifetimeEarningsExpandedState(props: {
  asset: MerchantSafeType;
}) {
  const merchantSafe = props.asset;
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      longFormHeight: CHART_HEIGHT,
    });
  }, [setOptions]);

  const { accumulatedSpendValue } = merchantSafe;

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
    <>
      {/* @ts-ignore */}
      <SlackSheet bottomInset={42} height="100%" scrollEnabled>
        <Container paddingHorizontal={5} paddingVertical={3}>
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
          <HorizontalDivider />
          <Text size="medium">Activities</Text>
          <Container alignItems="center" marginTop={4} width="100%">
            <Text>No activity data</Text>
          </Container>
        </Container>
      </SlackSheet>
    </>
  );
}
