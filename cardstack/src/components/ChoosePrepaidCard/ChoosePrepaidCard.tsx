import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import {
  Button,
  Container,
  ContainerProps,
  HorizontalDivider,
} from '@cardstack/components';
import { useSpendToNativeDisplay } from '@cardstack/hooks/currencies/useSpendDisplay';
import { PrepaidCardType } from '@cardstack/types';

import { useAccountSettings } from '@rainbow-me/hooks';

import { strings } from './strings';

import { Header, PrepaidCardItem } from '.';

export interface ChoosePrepaidCardProps {
  prepaidCards: PrepaidCardType[];
  selectedCard?: PrepaidCardType;
  onSelectPrepaidCard: (prepaidCard: PrepaidCardType) => void;
  spendAmount: number;
  onPressEditAmount?: () => void;
  onConfirmSelectedCard: () => void;
  payCostDesc?: string;
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
    payCostDesc,
  }: ChoosePrepaidCardProps) => {
    const { nativeBalanceDisplay } = useSpendToNativeDisplay({ spendAmount });

    const { network, nativeCurrencyInfo } = useAccountSettings();

    const networkName = useMemo(() => getConstantByNetwork('name', network), [
      network,
    ]);

    const renderItem = useCallback(
      ({ item, index }: { item: PrepaidCardType; index: number }) => (
        <PrepaidCardItem
          item={{
            ...item,
            nativeCurrencyInfo,
          }}
          onPress={onSelectPrepaidCard}
          selectedAddress={selectedCard?.address}
          networkName={networkName}
          spendAmount={spendAmount}
          isLastItem={index === prepaidCards.length - 1}
        />
      ),
      [
        nativeCurrencyInfo,
        networkName,
        onSelectPrepaidCard,
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
          payCostDesc={payCostDesc}
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
