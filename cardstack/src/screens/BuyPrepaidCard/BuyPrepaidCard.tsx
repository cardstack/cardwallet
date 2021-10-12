import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { CardContent, Subtitle, TopContent } from './Components';
import { Container, PrepaidCard, SheetHandle } from '@cardstack/components';
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
  updateOrder,
} from '@cardstack/services';
import { useBuyPrepaidCard } from '@rainbow-me/hooks';
import { getNativeBalanceFromSpend } from '@cardstack/utils';
import logger from 'logger';
import { Alert } from '@rainbow-me/components/alerts';

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
  const [sku, setSku] = useState<string>('');

  const [
    custodialWalletData,
    setCustodialWalletData,
  ] = useState<CustodialWallet>();

  const { onPurchase } = useBuyPrepaidCard();

  useEffect(() => {
    const getInventoryData = async () => {
      const data = await getInventories(hubURL, authToken);
      setInventoryData(data);
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

  const onSelectCard = useCallback(
    async (item, index) => {
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

      setSku(modifiedCards[index].attributes.sku);
    },
    [inventoryData]
  );

  const handlePurchase = useCallback(async () => {
    const amount = getNativeBalanceFromSpend(
      card?.['face-value'] || 0,
      nativeCurrency,
      currencyConversionRates
    );

    let reservation;

    try {
      reservation = await makeReservation(hubURL, authToken, sku);
    } catch (e) {
      logger.sentry('Error while make reservation', e);
      Alert({
        buttons: [{ text: 'Okay' }],
        message: 'Error while make reservation',
      });
    }

    try {
      const purchaseData = await onPurchase({
        address: card?.['issuing-token-symbol'],
        value: amount.toString(),
        depositAddress: custodialWalletData?.attributes['deposit-address'],
      });

      const wireWalletId =
        custodialWalletData?.attributes['wyre-wallet-id'] || '';

      const reservationId = reservation?.id || '';

      try {
        const orderId = await updateOrder(
          hubURL,
          authToken,
          purchaseData,
          wireWalletId,
          reservationId
        );

        if (orderId) {
          Alert({
            buttons: [{ text: 'Okay' }],
            message: 'Purchase completed successfully',
            title: `OrderId: ${purchaseData}`,
          });
        }

        // console.log('UPDATE ORDER SUCESS', JSON.stringify(data));
        //
        // const orderData = await getOrder(
        //   hubURL,
        //   authToken,
        //   data?.attributes['order-id']
        // );

        // console.log('GET ORDER', JSON.stringify(orderData));
      } catch (e) {
        logger.sentry('Error updating order', e);
        Alert({
          buttons: [{ text: 'Okay' }],
          message: 'Purchase not completed',
        });
      }
    } catch (e) {
    } finally {
    }
  }, [
    card,
    nativeCurrency,
    currencyConversionRates,
    onPurchase,
    authToken,
    sku,
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
