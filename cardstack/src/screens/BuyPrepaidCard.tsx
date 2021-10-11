import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import {
  Button,
  Container,
  PrepaidCard,
  SheetHandle,
  Text,
} from '@cardstack/components';
import ApplePayButton from '@rainbow-me/components/add-cash/ApplePayButton';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';
import { useAuthToken } from '@cardstack/hooks';
import { SlackSheet } from '@rainbow-me/components/sheet';
import {
  CustodialWallet,
  getCustodialWallet,
  getInventories,
  Inventory,
  InventoryAttrs,
  makeReservation,
  ReservationData,
} from '@cardstack/services';
import { useBuyPrepaidCard } from '@rainbow-me/hooks';
import { getNativeBalanceFromSpend } from '@cardstack/utils';

const TopContent = () => {
  return (
    <Container marginTop={4}>
      <Text fontSize={26} color="white">
        Buy a{' '}
        <Text fontSize={26} color="teal">
          Prepaid Card
        </Text>{' '}
        via Apple Pay to get started
      </Text>
    </Container>
  );
};

const baseStyles = {
  marginRight: 4,
  marginBottom: 3,
  borderRadius: 10,
  width: '100%',
};

const CardContent = ({
  onPress,
  amount,
  isSelected,
  faceValue,
  quantity,
}: {
  onPress: () => void;
  amount: number;
  faceValue: number;
  isSelected: boolean;
  quantity: number;
}) => {
  return quantity > 0 ? (
    <Button
      borderColor={isSelected ? 'buttonPrimaryBorder' : 'buttonSecondaryBorder'}
      variant={isSelected ? 'squareSelected' : 'square'}
      onPress={onPress}
      {...baseStyles}
    >
      <Text
        color={isSelected ? 'black' : 'white'}
        fontSize={28}
        textAlign="center"
      >
        $ {amount}
      </Text>
      <Text
        color={isSelected ? 'black' : 'white'}
        fontSize={14}
        textAlign="center"
        fontWeight="500"
      >
        {`\n`}
        {faceValue} SPEND
      </Text>
    </Button>
  ) : (
    <Button
      borderColor="buttonDisabledBackground"
      variant="squareDisabled"
      {...baseStyles}
    >
      <Text color="blueText" fontSize={28} textAlign="center">
        ${amount}
      </Text>
      <Text
        color="buttonSecondaryBorder"
        fontSize={13}
        textAlign="center"
        fontFamily="OpenSans-Semibold"
      >
        {`\n`}
        SOLD OUT
      </Text>
    </Button>
  );
};

const Subtitle = ({ text }: { text: string }) => {
  return (
    <Text
      fontSize={13}
      color="underlineGray"
      weight="bold"
      marginBottom={5}
      letterSpacing={0.4}
    >
      {text}
    </Text>
  );
};

const DEFAULT_CARD_CONFIG = {
  background: 'linear-gradient(139.27deg, #00ebe5 34%, #c3fc33 70%)',
  issuerName: 'Cardstack',
  patternColor: 'white',
  patternUrl:
    'https://app.cardstack.com/images/prepaid-card-customizations/pattern-5.svg',
  textColor: 'black',
};

const BuyPrepaidCard = () => {
  const network = useRainbowSelector(state => state.settings.network);
  const hubURL = 'https://hub-staging.stack.cards';
  const { authToken } = useAuthToken(hubURL);

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const [card, setCard] = useState<InventoryAttrs>();

  const [inventoryData, setInventoryData] = useState<Inventory[]>();
  const [, setReservationData] = useState<ReservationData>();
  const [paymentSheetVisible, setPaymentSheetVisible] = useState(false);

  const [
    custodialWalletData,
    setCustodialWalletData,
  ] = useState<CustodialWallet>();

  // const {
  //   error,
  //   isPaymentComplete,
  //   onPurchase,
  //   orderCurrency,
  //   orderStatus,
  //   resetAddCashForm,
  //   transferStatus,
  // } = useBuyPrepaidCard();
  const { onPurchase } = useBuyPrepaidCard();

  useEffect(() => {
    const getInventoryData = async () => {
      const data = await getInventories(hubURL, authToken);

      const formattedData =
        data !== undefined
          ? data.map(item => {
              const amountFormatter =
                (item.attributes['face-value'] / 100) *
                currencyConversionRates[nativeCurrency];

              return {
                ...item,
                amount: amountFormatter,
              };
            })
          : [];

      setInventoryData(formattedData);
    };

    getInventoryData();
  }, [authToken, currencyConversionRates, nativeCurrency]);

  useEffect(() => {
    const getCustodialWalletData = async () => {
      const data = await getCustodialWallet(hubURL, authToken);
      setCustodialWalletData(data);
    };

    getCustodialWalletData();
  }, [authToken]);

  const reserveCard = useCallback(
    async (sku: string) => {
      const data = await makeReservation(hubURL, authToken, sku);
      setReservationData(data);
    },
    [authToken]
  );

  const onSelectCard = useCallback(
    (item, index) => {
      const modifiedCards =
        inventoryData !== undefined
          ? inventoryData.map((cardItem: Inventory) => {
              return { ...cardItem, isSelected: false };
            })
          : [];

      modifiedCards[index].isSelected = true;

      setInventoryData(modifiedCards);
      setCard(
        modifiedCards.filter((cardItem: Inventory) => cardItem.isSelected)[0]
          .attributes
      );

      reserveCard(modifiedCards[index].attributes.sku);
    },
    [inventoryData, reserveCard]
  );

  // const handlePurchase = useCallback(async () => {
  //   try {
  //     await onPurchase({
  //       address: card?.['issuing-token-symbol'],
  //       value: '1',
  //       symbol: card?.['issuing-token-symbol'],
  //     });
  //   } catch (e) {
  //     console.log('ERROR DATA: ', e)
  //   } finally {
  //   }
  // }, [card, custodialWalletData, onPurchase]);

  const handlePurchase = useCallback(async () => {
    if (paymentSheetVisible) return;

    const amount = getNativeBalanceFromSpend(
      card?.['face-value'] || 0,
      nativeCurrency,
      currencyConversionRates
    );

    try {
      setPaymentSheetVisible(true);
      await onPurchase({
        address: card?.['issuing-token-symbol'],
        value: amount.toString(),
        depositAddress: custodialWalletData?.attributes['deposit-address'],
        sourceCurrency: nativeCurrency,
      });
    } catch (e) {
    } finally {
      setPaymentSheetVisible(false);
    }
  }, [
    paymentSheetVisible,
    card,
    nativeCurrency,
    currencyConversionRates,
    onPurchase,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    custodialWalletData?.attributes,
  ]);

  const renderItem = useCallback(
    ({ item, index }: { item: Inventory; index: number }) => (
      <CardContent
        onPress={() => onSelectCard(item, index)}
        isSelected={item?.isSelected}
        amount={item?.amount}
        faceValue={item?.attributes['face-value']}
        quantity={item.attributes?.quantity}
      />
    ),
    [onSelectCard]
  );

  return (
    <Container backgroundColor="backgroundBlue" flex={1}>
      <SlackSheet
        backgroundColor="transparent"
        renderHeader={() => (
          <Container
            backgroundColor="backgroundBlue"
            paddingTop={16}
            paddingHorizontal={2}
            alignItems="center"
          >
            <SheetHandle />
            <TopContent />
          </Container>
        )}
        renderFooter={() => (
          <Container
            padding={8}
            backgroundColor="grayButtonBackground"
            justifyContent="center"
          >
            <ApplePayButton
              onSubmit={handlePurchase}
              onDisabledPress={() => console.log('onDisablePress')}
            />
          </Container>
        )}
        scrollEnabled
      >
        <Container backgroundColor="backgroundBlue" height="100%" flex={1}>
          <Container backgroundColor="backgroundBlue" width="100%" padding={4}>
            <Subtitle text="CHOOSE AMOUNT" />
            <FlatList
              data={inventoryData}
              renderItem={renderItem}
              numColumns={2}
            />
          </Container>
          {card ? (
            <Container width="100%" marginBottom={16} padding={4}>
              <Subtitle text="PREVIEW" />
              <PrepaidCard
                disabled
                networkName={network}
                nativeCurrency={nativeCurrency}
                currencyConversionRates={currencyConversionRates}
                address="0xXXXX…XXXX"
                issuer="Cardstack"
                issuingToken={card['issuing-token-symbol']}
                spendFaceValue={card['face-value'] || 0}
                tokens={[]}
                type="prepaid-card"
                reloadable={card.reloadable}
                transferrable={card.transferrable}
                cardCustomization={
                  card['customization-DID']
                    ? card['customization-DID']
                    : DEFAULT_CARD_CONFIG
                }
              />
            </Container>
          ) : null}
        </Container>
      </SlackSheet>
    </Container>
  );
};

export default BuyPrepaidCard;
