import { getAddressByNetwork } from '@cardstack/cardpay-sdk';
import { useNavigation } from '@react-navigation/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { InteractionManager } from 'react-native';
import { useDispatch } from 'react-redux';

import { useAuthToken } from '@cardstack/hooks';
import { useLoadingOverlay } from '@cardstack/navigation';
import {
  getHubUrl,
  getInventories,
  getOrder,
  getValueInNativeCurrency,
  getWyrePrice,
  makeReservation,
  updateOrder,
} from '@cardstack/services';
import { useGetCustodialWalletQuery } from '@cardstack/services/hub/hub-api';
import { getPrepaidCardByAddress } from '@cardstack/services/prepaid-cards/prepaid-card-service';
import {
  PrepaidCardCustomization,
  Inventory,
  InventoryAttrs,
  ReservationData,
  WyrePriceData,
} from '@cardstack/types';
import { fetchCardCustomizationFromDID, useWorker } from '@cardstack/utils';
import {
  getOrderId,
  getReferenceId,
  getWalletOrderQuotation,
  PaymentRequestStatusTypes,
  reserveWyreOrder,
  showApplePayRequest,
} from '@cardstack/utils/wyre-utils';

import { Alert } from '@rainbow-me/components/alerts';
import useAccountSettings from '@rainbow-me/hooks/useAccountSettings';
import Routes from '@rainbow-me/navigation/routesNames';
import { addNewPrepaidCard } from '@rainbow-me/redux/data';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';
import logger from 'logger';

interface CardAttrs extends InventoryAttrs {
  customizationDID?: PrepaidCardCustomization | null;
  'source-currency'?: string;
  'dest-currency'?: string;
  'source-currency-price'?: number;
  'includes-fee'?: boolean;
}

export interface Card {
  id: string;
  type: string;
  isSelected: boolean;
  amount: number;
  attributes: CardAttrs;
}

const emptyInventory = {
  id: '',
  type: '',
  isSelected: false,
  amount: 0,
  attributes: undefined,
};

const inventoryInitialState = Array(4).fill(emptyInventory);

const hasSku = (inventory: Inventory, price: WyrePriceData[]): boolean =>
  price.filter(priceItem => priceItem?.id === inventory?.attributes?.sku)
    .length > 0;

export default function useBuyPrepaidCard() {
  const { goBack, navigate } = useNavigation();
  const dispatch = useDispatch();

  const { accountAddress, network } = useAccountSettings();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const hubURL = useMemo(() => getHubUrl(network), [network]);

  const { authToken } = useAuthToken();

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const [order, setOrder] = useState<string>('');
  const [card, setCard] = useState<CardAttrs>();

  const [inventoryData, setInventoryData] = useState<Inventory[] | undefined>(
    inventoryInitialState
  );

  const [sku, setSku] = useState<string>('');
  const [wyreOrderId, setWyreOrderId] = useState<string>('');

  const [wyrePriceData, setWyrePriceData] = useState<
    WyrePriceData[] | undefined
  >();

  const [isPurchaseInProgress, setIsPurchaseInProgress] = useState(false);

  const updatePrepaidCardsState = useCallback(
    async (address: string) => {
      try {
        const newPrepaidCard = await getPrepaidCardByAddress(address);

        if (newPrepaidCard) {
          await dispatch(addNewPrepaidCard(newPrepaidCard));
        }
      } catch (e) {
        logger.sentry('Error updating card on state');
      }
    },
    [dispatch]
  );

  const onSuccessAlertPress = useCallback(() => {
    goBack();

    InteractionManager.runAfterInteractions(() => {
      navigate(Routes.WALLET_SCREEN, {
        scrollToPrepaidCardsSection: true,
        forceRefreshOnce: true,
      });
    });
  }, [goBack, navigate]);

  useEffect(() => {
    const startTime = new Date().getTime();

    const orderStatusPolling = setInterval(async () => {
      const currentTime = new Date().getTime();

      if (wyreOrderId) {
        const orderData = await getOrder(hubURL, authToken, wyreOrderId);

        if (!orderData || currentTime - startTime > 60000) {
          dismissLoadingOverlay();
          clearInterval(orderStatusPolling);

          Alert({
            title: 'Error',
            message: `Something went wrong! Please try again. \nOrder Id: ${wyreOrderId}`,
          });

          return;
        }

        const status = orderData?.attributes.status;
        const prepaidCardAddress = orderData?.prepaidCardAddress;

        if (status === 'complete') {
          clearInterval(orderStatusPolling);

          if (prepaidCardAddress) {
            await updatePrepaidCardsState(prepaidCardAddress);
          }

          dismissLoadingOverlay();

          Alert({
            buttons: [
              {
                text: 'Okay',
                onPress: onSuccessAlertPress,
              },
            ],
            title: 'Success',
            message: 'Your Prepaid Card has arrived!',
          });
        }
      }
    }, 1000);

    return () => clearInterval(orderStatusPolling);
  }, [
    authToken,
    dismissLoadingOverlay,
    dispatch,
    goBack,
    hubURL,
    navigate,
    onSuccessAlertPress,
    updatePrepaidCardsState,
    wyreOrderId,
  ]);

  const {
    isLoading: isInventoryLoading,
    setIsLoading: setIsInventoryLoading,
    callback: getInventoryData,
    error: inventoryError,
  } = useWorker(async () => {
    const issuerAddress = getAddressByNetwork('wyreIssuer', network);

    const inventoryItems = await getInventories(
      hubURL,
      authToken,
      issuerAddress
    );

    if (inventoryItems) {
      const priceData = await getWyrePrice(hubURL, authToken);
      setWyrePriceData(priceData);

      if (priceData) {
        const formattedData = inventoryItems.filter(inventoryItem =>
          hasSku(inventoryItem, priceData)
        );

        setInventoryData(formattedData);
      }
    }
  }, [authToken, currencyConversionRates, hubURL, nativeCurrency, network]);

  useEffect(() => {
    if (authToken) {
      getInventoryData();
    }
  }, [authToken, getInventoryData]);

  useEffect(() => {
    if (inventoryError) {
      Alert({
        buttons: [{ text: 'Okay' }],
        message: 'Error loading inventory',
      });
    }
  }, [inventoryError]);

  const { data: custodialWalletData } = useGetCustodialWalletQuery();

  const onSelectCard = useCallback(
    async (item, index) => {
      const modifiedCards =
        inventoryData !== undefined
          ? inventoryData.map((cardItem: Card) => {
              return { ...cardItem, isSelected: false };
            })
          : [];

      modifiedCards[index].isSelected = true;

      const priceAttributes = wyrePriceData?.find(
        priceDataItem =>
          priceDataItem.id === modifiedCards[index].attributes.sku
      );

      const customizationDID = modifiedCards[index].attributes[
        'customization-DID'
      ]
        ? await fetchCardCustomizationFromDID(
            modifiedCards[index].attributes['customization-DID']
          )
        : null;

      const formattedCard = modifiedCards
        .filter((cardItem: Card) => cardItem.isSelected)
        .map((carditem: Card) => {
          return {
            ...carditem,
          };
        })[0].attributes;

      setInventoryData(modifiedCards);

      setCard({
        ...formattedCard,
        ...priceAttributes?.attributes,
        customizationDID,
      });

      setSku(modifiedCards[index].attributes.sku);
    },
    [inventoryData, wyrePriceData]
  );

  const onPurchase = useCallback(
    async ({ value, depositAddress, sourceCurrency, destCurrency }) => {
      const referenceInfo = {
        referenceId: getReferenceId(accountAddress),
      };

      const { reservation: reservationId } = await reserveWyreOrder(
        value,
        destCurrency,
        depositAddress,
        network,
        null,
        sourceCurrency
      );

      if (!reservationId) {
        logger.sentry('Error while making reservation on Wyre', {
          value,
          destCurrency,
          depositAddress,
          network,
          sourceCurrency,
        });

        Alert({
          buttons: [{ text: 'Okay' }],
          message:
            'We were unable to reserve your purchase order. Please try again later.',
          title: `Something went wrong!`,
        });

        return;
      }

      const quotation = await getWalletOrderQuotation(
        value,
        destCurrency,
        depositAddress,
        network,
        sourceCurrency
      );

      if (!quotation) {
        logger.sentry('Error while getting quotation on Wyre', {
          value,
          destCurrency,
          depositAddress,
          network,
          sourceCurrency,
        });

        Alert({
          buttons: [{ text: 'Okay' }],
          message:
            'We were unable to get a quote on your purchase order. Please try again later.',
          title: `Something went wrong!`,
        });

        return;
      }

      const { sourceAmountWithFees, purchaseFee } = quotation;

      const applePayResponse = await showApplePayRequest(
        referenceInfo,
        depositAddress,
        destCurrency,
        sourceAmountWithFees,
        purchaseFee,
        value,
        network,
        sourceCurrency
      );

      if (applePayResponse) {
        logger.log('[buy prepaid card] - get order id');

        const { orderId } = await getOrderId(
          referenceInfo,
          applePayResponse,
          sourceAmountWithFees,
          depositAddress,
          destCurrency,
          network,
          reservationId,
          sourceCurrency
        );

        if (orderId) {
          setOrder(orderId);
          applePayResponse.complete(PaymentRequestStatusTypes.SUCCESS);

          return orderId;
        } else {
          applePayResponse.complete(PaymentRequestStatusTypes.FAIL);

          logger.sentry(
            'Error getting order id',
            referenceInfo,
            applePayResponse,
            sourceAmountWithFees,
            depositAddress,
            destCurrency,
            network,
            reservationId
          );
        }
      }
    },
    [accountAddress, network]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  const handlePurchase = useCallback(async () => {
    setIsPurchaseInProgress(true);

    const amount = await getValueInNativeCurrency(
      card?.['source-currency-price'] || 0,
      nativeCurrency
    );

    let reservation: ReservationData | undefined;
    let wyreOrderIdData;

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
      wyreOrderIdData = await onPurchase({
        value: amount.toString(),
        depositAddress: custodialWalletData?.depositAddress,
        sourceCurrency: nativeCurrency || card?.['source-currency'],
        destCurrency: card?.['dest-currency'] || 'DAI',
      });
    } catch (error) {
      logger.sentry('Error while make reservation', {
        error,
        reservationData: reservation,
      });

      Alert({
        buttons: [{ text: 'Okay' }],
        message: `Purchase not completed \nReservation Id: ${reservation?.id}`,
      });
    }

    const wyreWalletId = custodialWalletData?.wyreWalletId || '';

    try {
      if (wyreOrderIdData) {
        showLoadingOverlay({
          title: 'Purchasing Prepaid Card',
          subTitle: 'This may take up to a minute.',
        });

        const reservationId = reservation?.id || '';

        const orderData = await updateOrder(
          hubURL,
          authToken,
          wyreOrderIdData,
          wyreWalletId,
          reservationId
        );

        if (orderData) {
          setWyreOrderId(wyreOrderIdData);
        }
      }
    } catch (error) {
      logger.sentry('Error updating order', {
        error,
        reservationData: reservation,
        wyreWalletId,
        wyreOrderIdData,
      });

      Alert({
        buttons: [{ text: 'Okay' }],
        message: `Purchase not completed \nReservation Id: ${reservation?.id}`,
      });
    }

    setIsPurchaseInProgress(false);
  }, [
    card,
    nativeCurrency,
    currencyConversionRates,
    hubURL,
    authToken,
    sku,
    onPurchase,
    custodialWalletData,
  ]);

  return {
    onPurchase,
    order,
    hubURL,
    onSelectCard,
    card,
    setCard,
    handlePurchase,
    isPurchaseInProgress,
    setIsInventoryLoading,
    isInventoryLoading,
    inventoryData,
    network,
    nativeCurrency,
    currencyConversionRates,
  };
}
