import React, { memo, useCallback } from 'react';
import {
  Container,
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
import MediumPrepaidCard from '@cardstack/components/PrepaidCard/MediumPrepaidCard';

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
const activeOpacity = (Device || {}).isAndroid ? 0.85 : undefined; // added ( || {}) because Device is undefined in test only, works fine other than tests

export const PrepaidCardItem = memo(
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

    const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
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
                <Text color="red" fontSize={10} weight="bold" paddingLeft={4}>
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
                <Text color="black" weight="bold" fontSize={14}>
                  {nativeBalanceDisplay}
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
