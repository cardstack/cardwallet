import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { strings } from './strings';
import { Header, PrepaidCardItem } from '.';
import {
  Button,
  Container,
  ContainerProps,
  HorizontalDivider,
} from '@cardstack/components';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';
import { PrepaidCardType } from '@cardstack/types';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

export interface ChoosePrepaidCardProps {
  prepaidCards: PrepaidCardType[];
  selectedCard?: PrepaidCardType;
  onSelectPrepaidCard: (prepaidCard: PrepaidCardType) => void;
  spendAmount: number;
  onPressEditAmount?: () => void;
  onConfirmSelectedCard: () => void;
}

const shadowStyles: ContainerProps = {
  shadowColor: 'black',
  shadowOffset: {
    height: 5,
    width: 0,
  },
  shadowRadius: 2,
  shadowOpacity: 0.1,
};

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    bottom: 0,
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'absolute',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  listContainer: { paddingBottom: 75 },
});

export const ChoosePrepaidCard = memo(
  ({
    prepaidCards,
    selectedCard,
    onSelectPrepaidCard,
    onConfirmSelectedCard,
    spendAmount,
    onPressEditAmount,
  }: ChoosePrepaidCardProps) => {
    const [
      network,
      nativeCurrency,
      currencyConversionRates,
    ] = useRainbowSelector<[string, string, { [key: string]: number }]>(
      state => [
        state.settings.network,
        state.settings.nativeCurrency,
        state.currencyConversion.rates,
      ]
    );

    const networkName = getConstantByNetwork('name', network);

    const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
      spendAmount,
      nativeCurrency,
      currencyConversionRates
    );

    const onSelect = useCallback(
      (item: PrepaidCardType) => {
        onSelectPrepaidCard(item);
      },
      [onSelectPrepaidCard]
    );

    const renderItem = useCallback(
      ({ item, index }: { item: PrepaidCardType; index: number }) => (
        <PrepaidCardItem
          item={item}
          onPress={onSelect}
          selectedAddress={selectedCard?.address}
          networkName={networkName}
          nativeCurrency={nativeCurrency}
          currencyConversionRates={currencyConversionRates}
          spendAmount={spendAmount}
          isLastItem={index === prepaidCards.length - 1}
        />
      ),
      [
        currencyConversionRates,
        nativeCurrency,
        networkName,
        onSelect,
        prepaidCards.length,
        selectedCard,
        spendAmount,
      ]
    );

    return (
      <Container
        flex={1}
        backgroundColor="white"
        paddingTop={3}
        borderRadius={20}
        justifyContent="center"
      >
        <Header
          nativeBalanceDisplay={nativeBalanceDisplay}
          onPressEditAmount={onPressEditAmount}
        />
        <FlatList
          data={prepaidCards}
          removeClippedSubviews
          horizontal={false}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
        <Container style={styles.footerContainer} {...shadowStyles}>
          <HorizontalDivider height={2} marginBottom={4} marginVertical={0} />
          <Container>
            <Button
              onPress={onConfirmSelectedCard}
              disabled={
                !selectedCard || selectedCard.spendFaceValue < spendAmount
              }
            >
              {strings.selectCard}
            </Button>
          </Container>
        </Container>
      </Container>
    );
  }
);
