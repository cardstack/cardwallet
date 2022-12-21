import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
import { useGetWyreSupportedCountriesQuery } from '@cardstack/services/wyre-api';
import { GetProductsQueryResult } from '@cardstack/types';
import { createWyreOrderWithApplePay } from '@cardstack/utils/wyre-utils';

import { Alert } from '@rainbow-me/components/alerts';
import { useTimeout } from '@rainbow-me/hooks';
import useAccountSettings from '@rainbow-me/hooks/useAccountSettings';
import logger from 'logger';

export type CardProduct = GetProductsQueryResult[0];

const inventoryInitialState = Array(4).fill({});
const timeout = 60000 * 1.5;
const pollingInterval = 5000;

export default function useBuyPrepaidCard() {
  const { navigate } = useNavigation();

  const { network, nativeCurrencyInfo, nativeCurrency } = useAccountSettings();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const [selectedCard, setSelectedCard] = useState<CardProduct>();

  const {
    data: inventoryData = inventoryInitialState,
    isLoading,
    isUninitialized,
    isFetching,
  } = useGetProductsQuery(network, { refetchOnMountOrArgChange: true });

  const {
    data: custodialWalletData,
    isLoading: isCustodialWalletLoading,
  } = useGetCustodialWalletQuery();

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
      pollingInterval,
    }
  );

  const {
    data: supportedCountries = {},
    isLoading: isLoadingCountries,
  } = useGetWyreSupportedCountriesQuery();

  const onPressSupport = useCallback(
    () => navigate(Routes.SUPPORT_AND_FEES, { supportedCountries }),
    [navigate, supportedCountries]
  );

  const onSuccessAlertPress = useCallback(() => {
    navigate(Routes.WALLET_SCREEN, {
      scrollToPrepaidCardsSection: true,
      forceRefreshOnce: true,
    });
  }, [navigate]);

  // Handle local exiting polling, TODO: Replace with job polling
  const { startTimeout } = useTimeout();

  const hasStartedTimeout = useRef(false);

  useEffect(() => {
    if (orderStatus && !hasStartedTimeout.current) {
      hasStartedTimeout.current = true;

      startTimeout(() => {
        dismissLoadingOverlay();

        Alert({
          buttons: [
            {
              text: 'Okay',
              onPress: onSuccessAlertPress,
            },
          ],
          title: 'Timeout',
          message: `We couldn't confirm the card delivery, refresh the app after a couple of minutes to check if your PrepaidCard has arrived.
          ${defaultErrorAlert.message}\nOrder Id: ${order?.id}\nStatus: ${orderStatus}`,
        });
      }, timeout);
    }
  }, [
    dismissLoadingOverlay,
    onSuccessAlertPress,
    order,
    orderStatus,
    startTimeout,
  ]);

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
        supportedCountries,
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
    supportedCountries,
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

  const isInventoryLoading = useMemo(
    () =>
      isLoading ||
      isUninitialized ||
      isCustodialWalletLoading ||
      isFetching ||
      isLoadingCountries,
    [
      isCustodialWalletLoading,
      isFetching,
      isLoading,
      isLoadingCountries,
      isUninitialized,
    ]
  );

  return {
    onSelectCard: setSelectedCard,
    selectedCard,
    handlePurchase,
    isInventoryLoading,
    inventoryData,
    network,
    nativeBalance,
    nativeCurrencyInfo,
    onPressSupport,
  };
}
