import { useCallback, useEffect } from 'react';
import { requestPurchase, useIAP, Product, Purchase } from 'react-native-iap';

import { useProfilePurchasesMutation } from '@cardstack/services';
import { Device } from '@cardstack/utils';

import logger from 'logger';

import { useProfileCreationData } from './useProfileCreationData';

// TODO: Product ID will be fetched from hub.
const testSKUs = ['0001'];

const testReceipt =
  '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';

const PROVIDER = Device.isIOS ? 'apple' : 'google';

export const usePurchaseProfile = () => {
  const {
    profile,
    profileAttributes,
    updateProfileInfo,
    onPressBusinessColor,
  } = useProfileCreationData();

  const {
    connected: iapAvailable,
    availablePurchases,
    products,
    currentPurchase,
    currentPurchaseError,
    getProducts,
    finishTransaction,
    getAvailablePurchases,
  } = useIAP();

  const [
    updateProfilePurchases,
    { data, error },
  ] = useProfilePurchasesMutation();

  // TODO: remove this
  const fakeTestPurchase = useCallback(async () => {
    await updateProfilePurchases({
      iapReceipt: testReceipt,
      provider: 'apple',
      merchantDID: profileAttributes,
    });
  }, [updateProfilePurchases, profileAttributes]);

  /**
   * Asks stores for available product descriptions.
   */
  const fetchProducts = useCallback(async () => {
    logger.log('💰 Loading Products available for purchase.');

    try {
      const response = await getProducts(testSKUs);
      logger.log('💰 Products response', response);
    } catch (e) {
      logger.sentry('Error fetching products:', e);
    }
  }, [getProducts]);

  /**
   * Asks stores for completed purchases.
   *
   * TODO: We need to handle this response in case the user has completed a
   * purchase but for some reason still doen't has the profile.
   */
  const fetchAvailablePurchases = useCallback(async () => {
    try {
      const response = await getAvailablePurchases();
      logger.log('💰 Available Purchases response', response);
    } catch (e) {
      logger.sentry('Error fetching available purchases:', e);
    }
  }, [getAvailablePurchases]);

  /**
   * Hub call that validates the receipt and creates the defined profile.
   */
  const validateReceiptCreateProfile = useCallback(
    async (purchase: Purchase) => {
      await updateProfilePurchases({
        iapReceipt: purchase.transactionReceipt,
        provider: PROVIDER,
        merchantDID: profileAttributes,
      });

      // Valid purchases need to be finalized, otherwise they may reverse.
      finishTransaction(purchase);
    },
    [updateProfilePurchases, profileAttributes, finishTransaction]
  );

  /**
   * Asks IAP service to start a purchase of a IAP Product.
   */
  const purchaseProduct = useCallback(async (product: Product) => {
    if (product.type === 'iap') {
      requestPurchase(product.productId);
    }
  }, []);

  /**
   * Handler for after a purchase occur.
   */
  useEffect(() => {
    if (currentPurchase) {
      console.log(':::💰 Purchase successful');
      console.log(currentPurchase.transactionReceipt);

      validateReceiptCreateProfile(currentPurchase);
    }
  }, [currentPurchase, validateReceiptCreateProfile]);

  useEffect(() => {
    if (data || error) {
      // Todo: Create pooling for querying until task finishes successfully.
      console.log('::: 💰 HUB Profile Purchase Mutation response', {
        data,
        error: JSON.stringify(error, null, 2),
      });
    }
  }, [data, error]);

  /**
   * Fetches IAPs descriptions and succesfull purchases.
   */
  useEffect(() => {
    fetchProducts();
    fetchAvailablePurchases();
  }, [fetchProducts, fetchAvailablePurchases]);

  return {
    profile,
    products,
    iapAvailable,
    currentPurchase,
    purchaseProduct,
    finishTransaction,
    updateProfileInfo,
    availablePurchases,
    onPressBusinessColor,
    currentPurchaseError,
    fakeTestPurchase,
  };
};
