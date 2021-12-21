import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import {
  Button,
  Container,
  ContainerProps,
  HorizontalDivider,
  NetworkBadge,
  Icon,
  Touchable,
  Text,
} from '@cardstack/components';
import {
  convertSpendForBalanceDisplay,
  Device,
  splitAddress,
} from '@cardstack/utils';
import { PrepaidCardType } from '@cardstack/types';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import MediumPrepaidCard from '@cardstack/components/PrepaidCard/MediumPrepaidCard';
import { hitSlop } from '@cardstack/utils/layouts';

export interface ChoosePrepaidCardProps {
  prepaidCards: PrepaidCardType[];
  selectedCard?: PrepaidCardType;
  onSelectPrepaidCard: (prepaidCard: PrepaidCardType) => void;
  spendAmount: number;
  onPressEditAmount: () => void;
  onConfirmSelectedCard: () => void;
}

const ChoosePrepaidCard = ({
  prepaidCards,
  selectedCard,
  onSelectPrepaidCard,
  onConfirmSelectedCard,
  spendAmount,
  onPressEditAmount,
}: ChoosePrepaidCardProps) => {
  const [network, nativeCurrency, currencyConversionRates] = useRainbowSelector<
    [string, string, { [key: string]: number }]
  >(state => [
    state.settings.network,
    state.settings.nativeCurrency,
    state.currencyConversion.rates,
  ]);

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
        spendAmount={spendAmount}
        nativeBalanceDisplay={nativeBalanceDisplay}
        onPressEditAmount={onPressEditAmount}
      />
      <FlatList
        data={prepaidCards}
        removeClippedSubviews
        horizontal={false}
        renderItem={renderItem}
        scrollEventThrottle={16}
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
            Select Card
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

const Header = memo(
  ({
    spendAmount,
    nativeBalanceDisplay,
    onPressEditAmount,
  }: {
    spendAmount: number;
    nativeBalanceDisplay: string;
    onPressEditAmount: () => void;
  }) => (
    <Container
      alignItems="center"
      backgroundColor="white"
      width="100%"
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
    >
      <Text marginTop={4} weight="bold" size="body">
        Choose a Prepaid Card
      </Text>
      <Text variant="subText" weight="bold" marginTop={3} marginBottom={1}>
        To Pay This Amount
      </Text>
      <Container width="100%" alignItems="center">
        <Touchable onPress={onPressEditAmount}>
          <Text weight="bold" size="body">
            {`§${spendAmount} SPEND`}
          </Text>
        </Touchable>
        <Touchable
          position="absolute"
          right={20}
          paddingTop={1}
          onPress={onPressEditAmount}
          hitSlop={hitSlop.small}
        >
          <Text size="xxs">Edit Amount</Text>
        </Touchable>
      </Container>
      <Container width="100%" alignItems="center">
        <Text size="xxs">{nativeBalanceDisplay}</Text>
      </Container>
      <HorizontalDivider height={2} marginVertical={0} marginTop={1} />
    </Container>
  )
);

interface PrepaidCardItemProps {
  item: PrepaidCardType;
  onPress: (item: PrepaidCardType) => void;
  selectedAddress?: string;
  networkName: string;
  nativeCurrency: string;
  currencyConversionRates: {
    [key: string]: number;
  };
  spendAmount: number;
  isLastItem: boolean;
}

// Android has a shadow issue,
// the default opacity adds a weird shadow on press
const activeOpacity = Device.isAndroid ? 0.85 : undefined;

const PrepaidCardItem = memo(
  ({
    item,
    onPress,
    selectedAddress,
    networkName,
    nativeCurrency,
    currencyConversionRates,
    spendAmount,
    isLastItem,
  }: PrepaidCardItemProps) => {
    const {
      address,
      spendFaceValue,
      cardCustomization,
      reloadable,
      transferrable,
    } = item;

    const { tokenBalanceDisplay } = convertSpendForBalanceDisplay(
      spendFaceValue.toString(),
      nativeCurrency,
      currencyConversionRates,
      true
    );

    const { twoLinesAddress } = splitAddress(address);

    const isInsufficientFund = spendFaceValue < spendAmount;
    const isSelected = selectedAddress === address;

    const handleOnPress = useCallback(() => {
      onPress(item);
    }, [item, onPress]);

    return (
      <Touchable
        key={address}
        onPress={handleOnPress}
        width="100%"
        disabled={isInsufficientFund}
        activeOpacity={activeOpacity}
      >
        <Container
          flexDirection="row"
          width="100%"
          borderBottomColor="borderGray"
          borderBottomWidth={isLastItem ? 0 : 1}
          paddingVertical={6}
          backgroundColor={isSelected ? 'grayCardBackground' : 'white'}
        >
          <Container paddingTop={7} padding={5}>
            {isInsufficientFund ? (
              <Icon name="alert-circle" color="red" iconSize="medium" />
            ) : isSelected ? (
              <Icon name="check-circle" color="lightGreen" iconSize="medium" />
            ) : (
              <Container
                width={22}
                height={22}
                borderRadius={11}
                borderColor="buttonSecondaryBorder"
                borderWidth={1}
              />
            )}
          </Container>
          <Container flexGrow={1} paddingRight={16}>
            <Container flexDirection="row">
              <NetworkBadge text={`ON ${networkName.toUpperCase()}`} />
              {isInsufficientFund && (
                <Text
                  color="red"
                  fontSize={10}
                  fontWeight="600"
                  paddingLeft={4}
                >
                  INSUFFICIENT FUNDS
                </Text>
              )}
            </Container>
            <Container opacity={isInsufficientFund ? 0.5 : 1}>
              <Container maxWidth={230} marginTop={2}>
                <Text
                  fontFamily="RobotoMono-Regular"
                  color="blueText"
                  fontSize={14}
                >
                  {twoLinesAddress}
                </Text>
              </Container>
              <Container marginTop={1} marginBottom={4}>
                <Text color="black" fontWeight="bold" fontSize={14}>
                  {tokenBalanceDisplay}
                </Text>
              </Container>
              <MediumPrepaidCard
                cardCustomization={cardCustomization}
                address={address}
                networkName={networkName}
                spendFaceValue={spendFaceValue}
                reloadable={reloadable}
                nativeCurrency={nativeCurrency}
                currencyConversionRates={currencyConversionRates}
                transferrable={transferrable}
              />
            </Container>
          </Container>
        </Container>
      </Touchable>
    );
  }
);

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

export default memo(ChoosePrepaidCard);
