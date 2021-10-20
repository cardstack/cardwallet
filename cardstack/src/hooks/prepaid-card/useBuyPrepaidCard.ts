import { useCallback, useEffect, useState } from 'react';
import { getAddressByNetwork } from '@cardstack/cardpay-sdk';
import { Alert } from '@rainbow-me/components/alerts';
import {
  getOrderId,
  getReferenceId,
  getWalletOrderQuotation,
  PaymentRequestStatusTypes,
  reserveWyreOrder,
  showApplePayRequest,
} from '@cardstack/utils/wyre-utils';
import useAccountSettings from '@rainbow-me/hooks/useAccountSettings';
import { getTokenMetadata } from '@rainbow-me/utils';
import logger from 'logger';
import { Network } from '@rainbow-me/networkTypes';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';
import { useAuthToken } from '@cardstack/hooks';
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
import {
  fetchCardCustomizationFromDID,
  getNativeBalanceFromSpend,
  useWorker,
} from '@cardstack/utils';
import { PrepaidCardCustomization } from '@cardstack/types';

const HUB_URL_STAGING = 'https://hub-staging.stack.cards';
const HUB_URL_PROD = 'https://hub.cardstack.com';

const getHubUrl = (network: Network) =>
  network === Network.xdai ? HUB_URL_PROD : HUB_URL_STAGING;

interface CardAttrs extends InventoryAttrs {
  customizationDID?: PrepaidCardCustomization | null;
}
export interface Card {
  id: string;
  type: string;
  isSelected: boolean;
  amount: number;
  attributes: CardAttrs;
}

export default function useBuyPrepaidCard() {
  const [order, setOrder] = useState<string>('');
  const { accountAddress, network } = useAccountSettings();

  const hubURL = getHubUrl(network);

  const { authToken } = useAuthToken(hubURL);

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const [card, setCard] = useState<CardAttrs>();
  const [inventoryData, setInventoryData] = useState<Inventory[]>();
  const [sku, setSku] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wyreOrderId, setWyreOrderId] = useState<string>('');

  const [
    custodialWalletData,
    setCustodialWalletData,
  ] = useState<CustodialWallet>();

  useEffect(() => {
    const orderStatusPolling = setInterval(async () => {
      if (wyreOrderId) {
        const orderData = await getOrder(hubURL, authToken, wyreOrderId);
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
  }, [authToken, hubURL, wyreOrderId]);

  const {
    isLoading: isInventoryLoading,
    setIsLoading: setIsInventoryLoading,
    callback: getInventoryData,
    error: inventoryError,
  } = useWorker(async () => {
    const issuerAddress = getAddressByNetwork('wyreIssuer', network);
    const data = await getInventories(hubURL, authToken, issuerAddress);
    setInventoryData(data);
  }, [authToken, currencyConversionRates, hubURL, nativeCurrency, network]);

  useEffect(() => {
    getInventoryData();
  }, [getInventoryData]);

  useEffect(() => {
    if (inventoryError) {
      Alert({
        buttons: [{ text: 'Okay' }],
        message: 'Error loading inventory',
      });
    }
  }, [inventoryError]);

  useEffect(() => {
    const getCustodialWalletData = async () => {
      const data = await getCustodialWallet(hubURL, authToken);
      setCustodialWalletData(data);
    };

    getCustodialWalletData();
  }, [authToken, hubURL]);

  const onSelectCard = useCallback(
    async (item, index) => {
      const modifiedCards =
        inventoryData !== undefined
          ? inventoryData.map((cardItem: Card) => {
              return { ...cardItem, isSelected: false };
            })
          : [];

      modifiedCards[index].isSelected = true;

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
      setCard({ ...formattedCard, customizationDID });

      setSku(modifiedCards[index].attributes.sku);
    },
    [inventoryData]
  );

  const onPurchase = useCallback(
    async ({ address, value, depositAddress, sourceCurrency }) => {
      const metadata = getTokenMetadata(address);
      const currency = metadata?.symbol || '';

      const referenceInfo = {
        referenceId: getReferenceId(accountAddress),
      };

      const { reservation: reservationId } = await reserveWyreOrder(
        value,
        currency,
        depositAddress,
        network,
        null,
        sourceCurrency
      );

      if (!reservationId) {
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
        currency,
        depositAddress,
        network,
        sourceCurrency
      );

      if (!quotation) {
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
        currency,
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
          currency,
          network,
          reservationId
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
            currency,
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
    const amount = getNativeBalanceFromSpend(
      card?.['face-value'] || 0,
      nativeCurrency,
      currencyConversionRates
    );

    let reservation;
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
        address: card?.['issuing-token-symbol'],
        value: amount.toString(),
        depositAddress: custodialWalletData?.attributes['deposit-address'],
      });
    } catch (e) {
      Alert({
        buttons: [{ text: 'Okay' }],
        message: 'Purchase not completed',
      });
    }

    try {
      if (wyreOrderIdData) {
        setIsLoading(true);

        const wyreWalletId =
          custodialWalletData?.attributes['wyre-wallet-id'] || '';

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
    } catch (e) {
      logger.sentry('Error updating order', e);

      Alert({
        buttons: [{ text: 'Okay' }],
        message: 'Purchase not completed',
      });
    }
  }, [
    card,
    nativeCurrency,
    currencyConversionRates,
    hubURL,
    authToken,
    sku,
    onPurchase,
    custodialWalletData?.attributes,
  ]);

  return {
    onPurchase,
    order,
    hubURL,
    onSelectCard,
    isLoading,
    card,
    setCard,
    handlePurchase,
    setIsInventoryLoading,
    isInventoryLoading,
    inventoryData,
    network,
    nativeCurrency,
    currencyConversionRates,
  };
}
