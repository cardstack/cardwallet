import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';

import { defaultErrorAlert } from '@cardstack/constants';
import { useMutationEffects, useSpendToNativeDisplay } from '@cardstack/hooks';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import {
  getValueInNativeCurrency,
  useGetCustodialWalletQuery,
  useGetOrderStatusQuery,
  useGetProductsQuery,
  useMakeReservationMutation,
  useUpdateOrderMutation,
} from '@cardstack/services';
import { GetProductsQueryResult } from '@cardstack/types';
import { createWyreOrderWithApplePay } from '@cardstack/utils/wyre-utils';

import { Alert } from '@rainbow-me/components/alerts';
import useAccountSettings from '@rainbow-me/hooks/useAccountSettings';
import logger from 'logger';

export type CardProduct = GetProductsQueryResult[0];

const inventoryInitialState = Array(4).fill({});

export default function useBuyPrepaidCard() {
  const { goBack, navigate } = useNavigation();

  const { network, nativeCurrencyInfo, nativeCurrency } = useAccountSettings();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

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

  const [
    updateHubOrder,
    { data: order, isError: isUpdateOrderError },
  ] = useUpdateOrderMutation();

  const {
    data: orderStatus,
    isError: isGetOrderError,
  } = useGetOrderStatusQuery(
    {
      orderId: order?.id || '',
    },
    {
      skip: !order?.id,
      pollingInterval: 5000,
    }
  );

  const onSuccessAlertPress = useCallback(() => {
    goBack();

    navigate(Routes.WALLET_SCREEN, {
      scrollToPrepaidCardsSection: true,
      forceRefreshOnce: true,
    });
  }, [goBack, navigate]);

  // orderPolling
  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: orderStatus === 'complete',
          callback: () => {
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
          },
        },
        error: {
          status:
            isGetOrderError ||
            isUpdateOrderError ||
            orderStatus === 'error-provisioning',
          callback: () => {
            dismissLoadingOverlay();

            Alert({
              title: 'Something went wrong',
              message: `${defaultErrorAlert.message}\nOrder:${order?.id}\nStatus:${orderStatus} `,
            });
          },
        },
      }),
      [
        dismissLoadingOverlay,
        isGetOrderError,
        isUpdateOrderError,
        onSuccessAlertPress,
        order,
        orderStatus,
      ]
    )
  );

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

  const handlePurchase = useCallback(async () => {
    showLoadingOverlay({
      title: 'Requesting Apple Pay',
      subTitle: 'Payment sheet will pop-up shortly',
    });

    makeHubReservation({ sku: selectedCard?.sku || '' });
  }, [showLoadingOverlay, makeHubReservation, selectedCard]);

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
            dismissLoadingOverlay();

            Alert({
              title: 'Reservation Error',
              message: defaultErrorAlert.message,
            });
          },
        },
      }),
      [
        dismissLoadingOverlay,
        isReservationError,
        isReservationSuccess,
        triggerWyrePurchase,
      ]
    )
  );

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
