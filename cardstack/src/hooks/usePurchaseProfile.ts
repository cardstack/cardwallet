import { useCallback, useEffect, useState } from 'react';
import { requestPurchase, useIAP, Product } from 'react-native-iap';

import { useProfilePurchasesQuery } from '@cardstack/services';
import { CreateBusinessInfoDIDParams } from '@cardstack/types';

import logger from 'logger';

// TODO: Product ID will be fetched from hub.
const skus = ['0001'];

const provider = 'apple';

const defaultMerchantInfo = {
  name: '',
  color: '000000',
  'text-color': 'ffffff',
};

export const usePurchaseProfile = () => {
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

  const [iapReceipt, setIapReceipt] = useState<string>('');

  const [profile, setProfileInfo] = useState<CreateBusinessInfoDIDParams>();

  const { data } = useProfilePurchasesQuery(
    { iapReceipt, merchantDID: profile, provider },
    { skip: !iapReceipt || !profile }
  );

  const updateProfileInfo = useCallback(
    (values: Partial<CreateBusinessInfoDIDParams>) => {
      setProfileInfo({ ...profile, ...values });
    },
    [profile, setProfileInfo]
  );

  const purchaseProduct = useCallback((product: Product) => {
    if (product.type === 'iap') {
      requestPurchase(product.productId);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    logger.log('💰 Loading Products available for purchase.');

    try {
      const response = await getProducts(skus);
      logger.log('💰 Products response', response);
    } catch (error) {
      logger.sentry('Error fetching products:', error);
    }
  }, [getProducts]);

  const fetchAvailablePurchases = useCallback(async () => {
    try {
      const response = await getAvailablePurchases();
      logger.log('💰 Available Purchases response', response);
    } catch (error) {
      logger.sentry('Error fetching available purchases:', error);
    }
  }, [getAvailablePurchases]);

  useEffect(() => {
    fetchProducts();
    fetchAvailablePurchases();

    if (data) console.log('::: Profile Purchases Query Response', { data });
  }, [fetchProducts, fetchAvailablePurchases, data]);

  useEffect(() => {
    if (currentPurchase) {
      // todo here we'll validate currentPurchase.transactionReceipt in the HUB.
      // if valid, we need to finish the transaction, otherwise it may reverse.
      console.log(':::💰 Purchase successful');
      console.log(currentPurchase.transactionReceipt);

      setIapReceipt(currentPurchase.transactionReceipt);
      finishTransaction(currentPurchase);
    }
  }, [currentPurchase, finishTransaction]);

  return {
    iapAvailable,
    products,
    availablePurchases,
    purchaseProduct,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
    profile,
    updateProfileInfo,
  };
};
