import React, { useState } from 'react';
import { FlatList } from 'react-native';
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
import { convertSpendForBalanceDisplay } from '@cardstack/utils';
import { PrepaidCardType } from '@cardstack/types';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import MediumPrepaidCard from '@cardstack/components/PrepaidCard/MediumPrepaidCard';

export interface ChoosePrepaidCardProps {
  prepaidCards: PrepaidCardType[];
  onSelectPrepaidCard: (prepaidAddress: string) => void;
  spendAmount: number;
  onPressEditAmount: () => void;
}

const ChoosePrepaidCard = ({
  prepaidCards,
  onSelectPrepaidCard,
  spendAmount,
  onPressEditAmount,
}: ChoosePrepaidCardProps) => {
  const [showHeaderShadow, setShowHeaderShadow] = useState(false);

  const [selectedAddress, setAddress] = useState<string>(
    prepaidCards[0]?.address
  );

  const [network, nativeCurrency, currencyConversionRates] = useRainbowSelector<
    [string, string, { [key: string]: number }]
  >(state => [
    state.settings.network,
    state.settings.nativeCurrency,
    state.currencyConversion.rates,
  ]);

  const networkName = getConstantByNetwork('name', network);

  const onSelect = () => {
    onSelectPrepaidCard(selectedAddress);
  };

  return (
    <Container
      flex={1}
      backgroundColor="white"
      paddingTop={3}
      borderRadius={20}
      justifyContent="center"
    >
      <Header
        showHeaderShadow={showHeaderShadow}
        spendAmount={spendAmount}
        onPressEditAmount={onPressEditAmount}
      />
      <FlatList
        data={prepaidCards}
        removeClippedSubviews
        horizontal={false}
        renderItem={({ item }) => (
          <PrepaidCardItem
            item={item}
            setAddress={setAddress}
            selectedAddress={selectedAddress}
            networkName={networkName}
            nativeCurrency={nativeCurrency}
            currencyConversionRates={currencyConversionRates}
            spendAmount={spendAmount}
          />
        )}
        onScroll={event => {
          if (event.nativeEvent.contentOffset.y > 16) {
            setShowHeaderShadow(true);
          } else {
            setShowHeaderShadow(false);
          }
        }}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <SheetFooter onSelect={onSelect} />
    </Container>
  );
};

const PrepaidCardItem = ({
  item: {
    address,
    spendFaceValue,
    cardCustomization,
    reloadable,
    transferrable,
  },
  setAddress,
  selectedAddress,
  networkName,
  nativeCurrency,
  currencyConversionRates,
  spendAmount,
}: {
  item: PrepaidCardType;
  setAddress: (address: string) => void;
  selectedAddress: string;
  networkName: string;
  nativeCurrency: string;
  currencyConversionRates: {
    [key: string]: number;
  };
  spendAmount: number;
}) => {
  const itemBackground: ContainerProps =
    selectedAddress === address
      ? {
          backgroundColor: 'grayCardBackground',
        }
      : {};

  const { tokenBalanceDisplay } = convertSpendForBalanceDisplay(
    spendFaceValue.toString(),
    nativeCurrency,
    currencyConversionRates,
    true
  );

  const isInsufficientFund = spendFaceValue < spendAmount;

  return (
    <Touchable
      key={address}
      onPress={() => setAddress(address)}
      width="100%"
      disabled={isInsufficientFund}
    >
      <Container
        flexDirection="row"
        width="100%"
        borderBottomColor="borderGray"
        borderBottomWidth={1}
        paddingVertical={6}
        {...itemBackground}
      >
        <Container paddingTop={7} padding={5}>
          {isInsufficientFund ? (
            <Icon name="alert-circle" color="red" iconSize="medium" />
          ) : selectedAddress === address ? (
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
              <Text color="red" fontSize={10} fontWeight="600" paddingLeft={4}>
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
                {address.slice(0, address.length / 2)}
              </Text>
              <Text
                fontFamily="RobotoMono-Regular"
                color="blueText"
                fontSize={14}
              >
                {address.slice(-(address.length - address.length / 2))}
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
};

const Header = ({
  showHeaderShadow,
  spendAmount,
  onPressEditAmount,
}: {
  showHeaderShadow: boolean;
  spendAmount: number;
  onPressEditAmount: () => void;
}) => {
  const shadowProps: ContainerProps = showHeaderShadow
    ? {
        shadowColor: 'black',
        shadowOffset: {
          height: 5,
          width: 0,
        },
        shadowRadius: 2,
        shadowOpacity: 0.1,
      }
    : {};

  return (
    <Container
      alignItems="center"
      backgroundColor="white"
      width="100%"
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
      {...shadowProps}
    >
      <Text marginTop={4} weight="bold" size="body">
        Choose a Prepaid Card
      </Text>
      <Text variant="subText" weight="bold" marginTop={3}>
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
          hitSlop={{
            top: 5,
            bottom: 5,
            left: 5,
            right: 5,
          }}
        >
          <Text size="xxs">Edit Amount</Text>
        </Touchable>
      </Container>
      <HorizontalDivider height={2} marginTop={4} marginVertical={0} />
    </Container>
  );
};

type SheetFooterProps = {
  onSelect: () => void;
};

const SheetFooter = ({ onSelect }: SheetFooterProps) => {
  return (
    <Container
      width="100%"
      bottom={0}
      paddingBottom={10}
      borderBottomLeftRadius={20}
      borderBottomRightRadius={20}
      position="absolute"
      backgroundColor="white"
      alignItems="center"
      {...{
        shadowColor: 'black',
        shadowOffset: {
          height: 5,
          width: 0,
        },
        shadowRadius: 2,
        shadowOpacity: 0.1,
      }}
    >
      <HorizontalDivider height={2} marginBottom={4} marginVertical={0} />
      <Button onPress={onSelect}>Select Card</Button>
    </Container>
  );
};

export default ChoosePrepaidCard;
