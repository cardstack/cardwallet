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
import { createWyreOrderWithApplePay } from '@cardstack/utils/wyre-utils';

import { Alert } from '@rainbow-me/components/alerts';
import useAccountSettings from '@rainbow-me/hooks/useAccountSettings';
import logger from 'logger';

type CardProduct = InventoryWithPrice;

const inventoryInitialState = Array(4).fill({});

export default function useBuyPrepaidCard() {
  const { goBack, navigate } = useNavigation();
  const dispatch = useDispatch();

  const { network, nativeCurrencyInfo, nativeCurrency } = useAccountSettings();

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

  const handlePurchase = useCallback(async () => {
    showLoadingOverlay({
      title: 'Requesting Apple Pay',
      subTitle: 'Payment sheet will pop-up shortly',
    });

    const amount = await getValueInNativeCurrency(
      selectedCard?.sourceCurrencyPrice || 0,
      nativeCurrency
    );

    makeReservation({ sku: selectedCard?.sku || '' });

    const wyreOrderIdData = await createWyreOrderWithApplePay({
      amount: amount.toString(),
      depositAddress: custodialWalletData?.depositAddress || '',
      sourceCurrency: nativeCurrency || selectedCard?.sourceCurrency,
      destCurrency: selectedCard?.destCurrency || 'DAI',
      network,
    });

    if (!wyreOrderIdData) {
      dismissLoadingOverlay();

      return;
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
    network,
    dismissLoadingOverlay,
    hubReservation,
    hubURL,
    authToken,
  ]);

  const { nativeBalanceDisplay: nativeBalance } = useSpendToNativeDisplay({
    spendAmount: selectedCard?.faceValue || 0,
  });

  return {
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
