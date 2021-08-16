import { useRoute } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import {
  ChartFilterOptions,
  useLifetimeEarningsData,
} from '../../../cardstack/src/hooks/use-lifetime-earnings-data';
import { SlackSheet } from '../sheet';
import {
  Container,
  FilterOption,
  HorizontalDivider,
  Icon,
  Text,
} from '@cardstack/components';
import { useMerchantTransactions } from '@cardstack/hooks';
import { palette } from '@cardstack/theme';
import { MerchantSafeType } from '@cardstack/types';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';
import { ChartPath } from '@rainbow-me/animated-charts';
import { useDimensions } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const CHART_HEIGHT = 200;
const HEIGHT = CHART_HEIGHT + 310;

const useMerchantSafe = (address: string) => {
  const merchantSafes = useRainbowSelector(state => state.data.merchantSafes);

  const merchantSafe = merchantSafes.find(
    safe => safe.address === address
  ) as MerchantSafeType;

  return merchantSafe;
};

export default function LifetimeEarningsExpandedState(props: {
  asset: MerchantSafeType;
}) {
  const { address } = props.asset;
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      longFormHeight: HEIGHT,
    });
  }, [setOptions]);

  return (
    // @ts-ignore doesn't understand the JS props
    <SlackSheet bottomInset={42} contentHeight={HEIGHT} scrollEnabled>
      <ChartSection address={address} />
      <Container paddingHorizontal={5}>
        <HorizontalDivider />
      </Container>
      <ActivitiesSection address={address} />
    </SlackSheet>
  );
}

const ChartSection = ({ address }: { address: string }) => {
  const [selectedFilterOption, setSelectedFilterOption] = useState(
    ChartFilterOptions.MONTH
  );
  const { width: screenWidth } = useDimensions();
  const merchantSafe = useMerchantSafe(address);
  const { accumulatedSpendValue } = merchantSafe;

  const { data } = useLifetimeEarningsData(
    merchantSafe.address,
    selectedFilterOption
  );

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
      <Container paddingHorizontal={5} paddingTop={3}>
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
          width={screenWidth}
        >
          <Container height={CHART_HEIGHT} />
        </ChartPath>
        <Container
          flexDirection="row"
          justifyContent="space-between"
          marginVertical={2}
          paddingHorizontal={10}
        >
          {Object.values(ChartFilterOptions).map(option => (
            <FilterOption
              isSelected={selectedFilterOption === option}
              key={option}
              onPress={() => setSelectedFilterOption(option)}
              text={option}
            />
          ))}
        </Container>
      </Container>
    </>
  );
};

const ActivitiesSection = () => {
  return (
    <Container paddingHorizontal={5}>
      <Text size="medium">Activities</Text>
      <Container alignItems="center" marginTop={4} width="100%">
        <Text>No activity data</Text>
      </Container>
    </Container>
  );
};
