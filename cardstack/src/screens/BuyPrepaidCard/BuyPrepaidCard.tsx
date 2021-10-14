/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import {
  CardContent,
  InventorySection,
  Subtitle,
  TopContent,
} from './Components';
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
  getOrder,
  Inventory,
  InventoryAttrs,
  makeReservation,
  updateOrder,
} from '@cardstack/services';
import { useBuyPrepaidCard } from '@rainbow-me/hooks';
import { getNativeBalanceFromSpend } from '@cardstack/utils';
import logger from 'logger';
import { Alert } from '@rainbow-me/components/alerts';
import { LoadingOverlay } from '@rainbow-me/components/modal';

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
  const { onPurchase, hubURL } = useBuyPrepaidCard();
  const { authToken } = useAuthToken(hubURL);

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const [card, setCard] = useState<InventoryAttrs>();
  const [inventoryData, setInventoryData] = useState<Inventory[]>();
  const [sku, setSku] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInventoryLoading, setIsInventoryLoading] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');

  const [
    custodialWalletData,
    setCustodialWalletData,
  ] = useState<CustodialWallet>();

  useEffect(() => {
    const orderStatusPolling = setInterval(async () => {
      if (orderId) {
        const orderData = await getOrder(hubURL, authToken, orderId);
        const status = orderData?.attributes?.status;

        if (status === 'complete') {
          setIsLoading(false);
          Alert({
            buttons: [{ text: 'Okay' }],
            message: 'Prepaid card purchased successfully',
          });

          clearInterval(orderStatusPolling);
        }
      }
    }, 2000);

    return () => clearInterval(orderStatusPolling);
  }, [authToken, orderId]);

  useEffect(() => {
    const getInventoryData = async () => {
      try {
        setIsInventoryLoading(true);
        const data = await getInventories(hubURL, authToken);

        setInventoryData(data);
      } catch (e) {
        return Alert({
          buttons: [{ text: 'Okay' }],
          message: 'Error while available cards',
        });
      } finally {
        setIsInventoryLoading(false);
      }
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
    let orderIdData;

    try {
      reservation = await makeReservation(hubURL, authToken, sku);
    } catch (e) {
      logger.sentry('Error while make reservation', e);

      return Alert({
        buttons: [{ text: 'Okay' }],
        message: 'Error while make reservation',
      });
    }

    try {
      orderIdData = await onPurchase({
        address: card?.['issuing-token-symbol'],
        value: amount.toString(),
        depositAddress: custodialWalletData?.attributes['deposit-address'],
      });
    } catch (e) {
      return Alert({
        buttons: [{ text: 'Okay' }],
        message: 'Purchase not completed',
      });
    }

    try {
      if (orderIdData) {
        setIsLoading(true);

        const wyreWalletId =
          custodialWalletData?.attributes['wyre-wallet-id'] || '';

        const reservationId = reservation?.id || '';

        const orderData = await updateOrder(
          hubURL,
          authToken,
          orderIdData,
          wyreWalletId,
          reservationId
        );

        if (orderData) {
          setOrderId(orderIdData);
        }
      }
    } catch (e) {
      logger.sentry('Error updating order', e);

      return Alert({
        buttons: [{ text: 'Okay' }],
        message: 'Purchase not completed',
      });
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
      {isLoading ? (
        <LoadingOverlay
          title={`Processing Transaction \nThis will take approximately \n10-15 seconds`}
        />
      ) : null}
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
              disabled={Object.keys(card || {}).length === 0}
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
            {!isInventoryLoading ? (
              <FlatList
                data={inventoryData}
                renderItem={renderItem}
                numColumns={2}
              />
            ) : (
              <InventorySection />
            )}
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
