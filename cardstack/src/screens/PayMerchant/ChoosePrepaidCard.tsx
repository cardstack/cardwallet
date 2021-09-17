import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import {
  Button,
  Container,
  ContainerProps,
  HorizontalDivider,
  NetworkBadge,
  PrepaidCardInnerTop,
  PrepaidCardInnerBottom,
  Icon,
  Touchable,
  Text,
} from '@cardstack/components';
import { CustomizableBackground } from '@cardstack/components/PrepaidCard/CustomizableBackground';
import { convertSpendForBalanceDisplay } from '@cardstack/utils';
import { PrepaidCardType } from '@cardstack/types';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

export interface ChoosePrepaidCardProps {
  prepaidCards: PrepaidCardType[];
  onSelectPrepaidCard: (prepaidAddress: string) => void;
  spendAmount: number;
}

const ChoosePrepaidCard = ({
  prepaidCards,
  onSelectPrepaidCard,
  spendAmount,
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
      <Header showHeaderShadow={showHeaderShadow} spendAmount={spendAmount} />
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
  item,
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
    selectedAddress === item.address
      ? {
          backgroundColor: 'grayCardBackground',
        }
      : {};

  const { tokenBalanceDisplay } = convertSpendForBalanceDisplay(
    item.spendFaceValue.toString(),
    nativeCurrency,
    currencyConversionRates,
    true
  );

  const isInsufficientFund = item.spendFaceValue < spendAmount;

  return (
    <Touchable
      key={item.address}
      onPress={() => setAddress(item.address)}
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
          ) : selectedAddress === item.address ? (
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
                {item.address.slice(0, item.address.length / 2)}
              </Text>
              <Text
                fontFamily="RobotoMono-Regular"
                color="blueText"
                fontSize={14}
              >
                {item.address.slice(
                  -(item.address.length - item.address.length / 2)
                )}
              </Text>
            </Container>
            <Container marginTop={1} marginBottom={4}>
              <Text color="black" fontWeight="bold" fontSize={14}>
                {tokenBalanceDisplay}
              </Text>
            </Container>
            <Container
              borderRadius={10}
              {...{
                backgroundColor: 'white',
                shadowColor: 'overlay',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowRadius: 2,
                shadowOpacity: 1,
                borderStyle: 'solid',
                borderColor: 'whiteOverlay',
              }}
            >
              <Container borderRadius={10} overflow="hidden">
                <CustomizableBackground
                  cardCustomization={item.cardCustomization}
                  address={item.address}
                  isEditing={false}
                  variant="medium"
                />
                <PrepaidCardInnerTop
                  address={item.address}
                  cardCustomization={item.cardCustomization}
                  networkName={networkName}
                  smallCard
                />
                <PrepaidCardInnerBottom
                  {...item}
                  nativeCurrency={nativeCurrency}
                  networkName={networkName}
                  currencyConversionRates={currencyConversionRates}
                  smallCard
                />
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>
    </Touchable>
  );
};

const Header = ({
  showHeaderShadow,
  spendAmount,
}: {
  showHeaderShadow: boolean;
  spendAmount: number;
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
      <Text weight="bold" size="body">
        {`§${spendAmount} SPEND`}
      </Text>
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
