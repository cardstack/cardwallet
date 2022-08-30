import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { InteractionManager } from 'react-native';
import { useDispatch } from 'react-redux';

import {
  useAuthToken,
  useMutationEffects,
  useSpendToNativeDisplay,
} from '@cardstack/hooks';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import {
  getHubUrl,
  getOrder,
  getValueInNativeCurrency,
  useGetCustodialWalletQuery,
  useGetProductsQuery,
  useMakeReservationMutation,
  useUpdateOrderMutation,
} from '@cardstack/services';
import { GetProductsQueryResult } from '@cardstack/types';
import { createWyreOrderWithApplePay } from '@cardstack/utils/wyre-utils';

import { Alert } from '@rainbow-me/components/alerts';
import useAccountSettings from '@rainbow-me/hooks/useAccountSettings';
import logger from 'logger';

type CardProduct = GetProductsQueryResult;

const inventoryInitialState = Array(4).fill({});

export default function useBuyPrepaidCard() {
  const { goBack, navigate } = useNavigation();
  const dispatch = useDispatch();

  const { network, nativeCurrencyInfo, nativeCurrency } = useAccountSettings();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const hubURL = useMemo(() => getHubUrl(network), [network]);

  const { authToken } = useAuthToken();

  const [selectedCard, setSelectedCard] = useState<CardProduct>();

  const {
    data: inventoryData = inventoryInitialState,
    isLoading,
    isUninitialized,
  } = useGetProductsQuery(network, { refetchOnMountOrArgChange: true });

  const { data: custodialWalletData } = useGetCustodialWalletQuery();

  const [
    makeHubReservation,
    {
      data: hubReservation,
      isSuccess: isReservationSuccess,
      isError: isReservationError,
    },
  ] = useMakeReservationMutation();

  const [updateHubOrder, { data: order }] = useUpdateOrderMutation();

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

      if (order) {
        const orderData = await getOrder(hubURL, authToken, order?.id);

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
    order,
  ]);

  const triggerWyrePurchase = useCallback(async () => {
    if (!custodialWalletData || !hubReservation) return;

    try {
      const amount = await getValueInNativeCurrency(
        selectedCard?.sourceCurrencyPrice || 0,
        nativeCurrency
      );

      const wyreOrderId = await createWyreOrderWithApplePay({
        amount: amount.toString(),
        depositAddress: custodialWalletData.depositAddress,
        sourceCurrency: nativeCurrency || selectedCard?.sourceCurrency,
        destCurrency: selectedCard?.destCurrency || 'DAI',
        network,
      });

      if (!wyreOrderId) {
        dismissLoadingOverlay();

        return;
      }

      showLoadingOverlay({
        title: 'Purchasing Prepaid Card',
        subTitle: 'This may take up to a minute.',
      });

      updateHubOrder({
        wyreOrderId,
        walletId: custodialWalletData.wyreWalletId,
        reservationId: hubReservation.id,
      });
    } catch (error) {
      logger.sentry('Error purchasing prepaid card', error);
      dismissLoadingOverlay();
    }
  }, [
    custodialWalletData,
    dismissLoadingOverlay,
    hubReservation,
    nativeCurrency,
    network,
    selectedCard,
    showLoadingOverlay,
    updateHubOrder,
  ]);

  // makeHubReservation
  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isReservationSuccess,
          callback: triggerWyrePurchase,
        },
        error: {
          status: isReservationError,
          callback: () => {
            //ALert?
          },
        },
      }),
      [isReservationError, isReservationSuccess, triggerWyrePurchase]
    )
  );

  const handlePurchase = useCallback(async () => {
    showLoadingOverlay({
      title: 'Requesting Apple Pay',
      subTitle: 'Payment sheet will pop-up shortly',
    });

    makeHubReservation({ sku: selectedCard?.sku || '' });
  }, [showLoadingOverlay, makeHubReservation, selectedCard]);

  const { nativeBalanceDisplay: nativeBalance } = useSpendToNativeDisplay({
    spendAmount: selectedCard?.faceValue || 0,
  });

  return {
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
