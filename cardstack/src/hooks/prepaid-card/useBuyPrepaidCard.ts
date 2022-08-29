import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { InteractionManager } from 'react-native';
import { useDispatch } from 'react-redux';

import { useAuthToken, useSpendToNativeDisplay } from '@cardstack/hooks';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import {
  getHubUrl,
  getOrder,
  getValueInNativeCurrency,
  updateOrder,
  useGetCustodialWalletQuery,
  useGetProductsQuery,
  useMakeReservationMutation,
} from '@cardstack/services';
import { InventoryWithPrice } from '@cardstack/types';
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
import logger from 'logger';

type CardProduct = InventoryWithPrice;

const inventoryInitialState = Array(4).fill({});

export default function useBuyPrepaidCard() {
  const { goBack, navigate } = useNavigation();
  const dispatch = useDispatch();

  const {
    accountAddress,
    network,
    nativeCurrencyInfo,
    nativeCurrency,
  } = useAccountSettings();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const hubURL = useMemo(() => getHubUrl(network), [network]);

  const { authToken } = useAuthToken();

  const [selectedCard, setSelectedCard] = useState<CardProduct>();

  const [wyreOrderId, setWyreOrderId] = useState<string>('');

  const {
    data: inventoryData = inventoryInitialState,
    isLoading,
    isUninitialized,
  } = useGetProductsQuery(network, { refetchOnMountOrArgChange: true });

  const [
    makeReservation,
    { data: hubReservation },
  ] = useMakeReservationMutation();

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

        const status = orderData?.attributes.status;

        if (!orderData || currentTime - startTime > 60000 * 1.5) {
          dismissLoadingOverlay();
          clearInterval(orderStatusPolling);

          Alert({
            title: 'Timeout',
            message: `We couldn't confirm the card delivery, refresh the app after a couple of minutes, if your prepaid card doesn't appear, try again.\nOrder Id: ${wyreOrderId}\nStatus: ${status}`,
          });

          return;
        }

        if (status === 'complete') {
          clearInterval(orderStatusPolling);

          // TODO invalidate safes tag once status is true
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
    wyreOrderId,
  ]);

  const { data: custodialWalletData } = useGetCustodialWalletQuery();

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
          applePayResponse.complete(PaymentRequestStatusTypes.SUCCESS);

          return orderId;
        } else {
          applePayResponse.complete(PaymentRequestStatusTypes.FAIL);
          dismissLoadingOverlay();

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
      } else {
        dismissLoadingOverlay();
      }
    },
    [accountAddress, dismissLoadingOverlay, network]
  );

  const handlePurchase = useCallback(async () => {
    showLoadingOverlay({
      title: 'Requesting Apple Pay',
      subTitle: 'Payment sheet will pop-up shortly',
    });

    const amount = await getValueInNativeCurrency(
      selectedCard?.sourceCurrencyPrice || 0,
      nativeCurrency
    );

    let wyreOrderIdData;

    makeReservation({ sku: selectedCard?.sku || '' });

    try {
      wyreOrderIdData = await onPurchase({
        value: amount.toString(),
        depositAddress: custodialWalletData?.depositAddress,
        sourceCurrency: nativeCurrency || selectedCard?.sourceCurrency,
        destCurrency: selectedCard?.destCurrency || 'DAI',
      });
    } catch (error) {
      logger.sentry('Error while make wyre reservation', {
        error,
      });
    }

    const wyreWalletId = custodialWalletData?.wyreWalletId || '';

    try {
      if (wyreOrderIdData) {
        showLoadingOverlay({
          title: 'Purchasing Prepaid Card',
          subTitle: 'This may take up to a minute.',
        });

        const reservationId = hubReservation?.id || '';

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
      dismissLoadingOverlay();

      logger.sentry('Error updating order', {
        error,
        reservationData: hubReservation,
        wyreWalletId,
        wyreOrderIdData,
      });

      Alert({
        buttons: [{ text: 'Okay' }],
        message: `Purchase not completed \nReservation Id: ${hubReservation?.id}`,
      });
    }
  }, [
    showLoadingOverlay,
    selectedCard,
    nativeCurrency,
    makeReservation,
    custodialWalletData,
    onPurchase,
    hubReservation,
    hubURL,
    authToken,
    dismissLoadingOverlay,
  ]);

  const { nativeBalanceDisplay: nativeBalance } = useSpendToNativeDisplay({
    spendAmount: selectedCard?.faceValue || 0,
  });

  return {
    onPurchase,
    hubURL,
    onSelectCard: setSelectedCard,
    selectedCard,
    handlePurchase,
    isInventoryLoading: isLoading || isUninitialized,
    inventoryData,
    network,
    nativeBalance,
    nativeCurrencyInfo,
  };
}
