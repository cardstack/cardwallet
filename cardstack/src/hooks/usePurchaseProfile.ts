import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo } from 'react';
import { useIAP } from 'react-native-iap';

import { defaultErrorAlert } from '@cardstack/constants';
import { useProfileJobAwait } from '@cardstack/hooks/useProfileJobAwait';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import { useProfilePurchasesMutation } from '@cardstack/services';
import { CreateProfileInfoParams } from '@cardstack/services/hub/hub-types';
import { Device } from '@cardstack/utils';

import { Alert } from '@rainbow-me/components/alerts';
import logger from 'logger';

import { useMutationEffects } from '.';

// TODO: Fetch Product IDs from hub.
const skus = { profile: '0001' };

export const useInitIAPProducts = () => {
  const { getProducts } = useIAP();

  /**
   * Fetches IAPs descriptions and succesfull purchases.
   */
  useEffect(() => {
    getProducts(Object.values(skus));
  }, [getProducts]);
};

export const usePurchaseProfile = (profile: CreateProfileInfoParams) => {
  const { navigate } = useNavigation();

  const {
    products,
    currentPurchase,
    currentPurchaseError,
    finishTransaction,
    requestPurchase,
  } = useIAP();

  const [
    validateReceiptCreateProfile,
    { data, error, isSuccess, isError },
  ] = useProfilePurchasesMutation();

  const {
    handleAwaitForProfileCreation,
    profileSafeId,
    error: poolingRequestError,
  } = useProfileJobAwait();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isSuccess,
          callback: () => {
            if (currentPurchase) {
              // Valid purchases need to be finalized, otherwise they may reverse.
              finishTransaction(currentPurchase);
            }
          },
        },
        error: {
          status: isError,
          callback: () => {
            dismissLoadingOverlay();
            logger.sentry('Error updating profile purchase', error);
            Alert(defaultErrorAlert);
          },
        },
      }),
      [
        currentPurchase,
        dismissLoadingOverlay,
        error,
        finishTransaction,
        isError,
        isSuccess,
      ]
    )
  );

  const profileProduct = useMemo(
    () =>
      products.find(
        prod => prod.productId === skus.profile && prod.type === Device.iapType
      ),
    [products]
  );

  /**
   * Asks IAP service to start a purchase of a profile.
   */
  const purchaseProfile = useCallback(async () => {
    if (profileProduct) {
      try {
        showLoadingOverlay();
        await requestPurchase(profileProduct.productId);
      } catch (e) {
        dismissLoadingOverlay();
        logger.sentry('Error purchasing product', e);
      }
    }
  }, [
    dismissLoadingOverlay,
    profileProduct,
    requestPurchase,
    showLoadingOverlay,
  ]);

  /**
   * Handler for after a purchase occur.
   */
  useEffect(() => {
    if (currentPurchase) {
      showLoadingOverlay({ title: 'Creating profile' });

      logger.sentry('[IAP] Purchase successful');
      /**
       * Hub call that validates the receipt and creates the defined profile.
       */
      validateReceiptCreateProfile({
        iapReceipt: currentPurchase.transactionReceipt,
        provider: Device.iapProvider,
        profileInfo: profile,
      });
    }
  }, [
    currentPurchase,
    profile,
    showLoadingOverlay,
    validateReceiptCreateProfile,
  ]);

  useEffect(() => {
    if (
      currentPurchaseError &&
      currentPurchaseError?.code !== 'E_USER_CANCELLED'
    ) {
      Alert(defaultErrorAlert);
    }
  }, [currentPurchaseError]);

  useEffect(() => {
    const jobId = data?.included[0].id;

    if (jobId) {
      handleAwaitForProfileCreation(jobId);
    }
  }, [data, handleAwaitForProfileCreation]);

  useEffect(() => {
    if (profileSafeId) {
      setTimeout(dismissLoadingOverlay, 1000);

      Alert({
        title: 'Success',
        message: 'Your profile is ready! Pull down to refresh to see it.',
        buttons: [
          {
            text: 'Okay',
            onPress: () => navigate(Routes.WALLET_SCREEN),
          },
        ],
      });
    }
  }, [dismissLoadingOverlay, navigate, profileSafeId]);

  useEffect(() => {
    if (poolingRequestError) {
      setTimeout(dismissLoadingOverlay, 1000);

      Alert({
        title: 'Error',
        message:
          'Your purchase went through but creating your profile failed. Please reach out to support@cardstack.com for assitance.',
        buttons: [
          {
            text: 'Okay',
            onPress: () => navigate(Routes.WALLET_SCREEN),
          },
        ],
      });
    }
  }, [poolingRequestError, dismissLoadingOverlay, navigate]);

  return {
    purchaseProfile,
    profileProduct,
  };
};
