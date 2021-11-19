import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, SectionList } from 'react-native';
import { SlackSheet } from '../sheet';
import {
  Container,
  FilterOption,
  HorizontalDivider,
  Icon,
  ListEmptyComponent,
  Text,
  TransactionItem,
  TransactionListLoading,
} from '@cardstack/components';
import {
  ChartFilterOptions,
  useLifetimeEarningsData,
  useMerchantTransactions,
} from '@cardstack/hooks';
import { palette } from '@cardstack/theme';
import { MerchantSafeType } from '@cardstack/types';
import { convertSpendForBalanceDisplay, screenHeight } from '@cardstack/utils';
import { sectionStyle } from '@cardstack/utils/layouts';
import { ChartPath } from '@rainbow-me/animated-charts';
import { useDimensions } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const CHART_HEIGHT = screenHeight * 0.25;
const HEIGHT = screenHeight * 0.85;

export default function LifetimeEarningsExpandedState({
  asset: merchantSafe,
}: {
  asset: MerchantSafeType;
}) {
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      longFormHeight: HEIGHT,
    });
  }, [setOptions]);

  return useMemo(
    () => (
      <SlackSheet bottomInset={42} height="100%" scrollEnabled>
        <ChartSection merchantSafe={merchantSafe} />
        <Container paddingHorizontal={5}>
          <HorizontalDivider />
        </Container>
        <ActivitiesSection address={merchantSafe.address} />
      </SlackSheet>
    ),
    [merchantSafe]
  );
}

const ChartSection = ({ merchantSafe }: { merchantSafe: MerchantSafeType }) => {
  const [selectedFilterOption, setSelectedFilterOption] = useState(
    ChartFilterOptions.MONTH
  );
  const { width: screenWidth } = useDimensions();
  const { accumulatedSpendValue, address } = merchantSafe;

  const { data } = useLifetimeEarningsData(address, selectedFilterOption);

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
        <Text size="medium">Earnings history</Text>
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

const renderItem = (props: any) => (
  <TransactionItem {...props} includeBorder isFullWidth />
);

const renderSectionHeader = ({ section: { title } }: any) => (
  <Container backgroundColor="white" paddingVertical={2} width="100%">
    <Text color="blueText" size="medium">
      {title}
    </Text>
  </Container>
);

const ActivitiesSection = ({ address }: { address: string }) => {
  const {
    sections,
    isFetchingMore,
    onEndReached,
    refetchLoading,
    refetch,
    isLoadingTransactions,
  } = useMerchantTransactions(address, 'lifetimeEarnings');

  return (
    <Container paddingHorizontal={5} paddingVertical={3}>
      <Text size="medium">Activities</Text>
      <Container flexDirection="column" marginTop={7} width="100%">
        {isLoadingTransactions ? (
          <TransactionListLoading light />
        ) : (
          <SectionList
            ListEmptyComponent={<ListEmptyComponent text="No activity" />}
            ListFooterComponent={
              isFetchingMore ? <ActivityIndicator color="white" /> : null
            }
            contentContainerStyle={sectionStyle.contentContainerStyle}
            onEndReached={onEndReached}
            onEndReachedThreshold={1}
            refreshControl={
              <RefreshControl
                onRefresh={refetch}
                refreshing={refetchLoading}
                tintColor="white"
              />
            }
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            sections={sections}
            style={sectionStyle.sectionList}
          />
        )}
      </Container>
    </Container>
  );
};
