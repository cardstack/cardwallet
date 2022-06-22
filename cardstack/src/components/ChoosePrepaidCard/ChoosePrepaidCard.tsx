import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Button, Container, HorizontalDivider } from '@cardstack/components';
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

const styles = StyleSheet.create({
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
    const { goBack } = useNavigation();

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
        <Container
          width="100%"
          paddingBottom={5}
          borderBottomLeftRadius={20}
          borderBottomRightRadius={20}
          backgroundColor="white"
        >
          <HorizontalDivider height={2} marginBottom={4} marginVertical={0} />
          <Container
            paddingHorizontal={5}
            flexDirection="row"
            justifyContent="space-between"
          >
            <Button variant="smallWhite" onPress={goBack}>
              {strings.cancel}
            </Button>
            <Button
              variant="small"
              onPress={onConfirmSelectedCard}
              disabled={
                !selectedCard || selectedCard.spendFaceValue < spendAmount
              }
            >
              {strings.continue}
            </Button>
          </Container>
        </Container>
      </Container>
    );
  }
);
