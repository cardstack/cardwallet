import { useCallback, useEffect } from 'react';
import { requestPurchase, useIAP, Product } from 'react-native-iap';

import logger from 'logger';

// TODO: Product ID will be fetched from hub.
const skus = ['0001'];

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
  }, [fetchProducts]);

  useEffect(() => {
    fetchAvailablePurchases();
  }, [fetchAvailablePurchases]);

  useEffect(() => {
    if (currentPurchase) {
      // todo here we'll validate currentPurchase.transactionReceipt in the HUB.
      // if valid, we need to finish the transaction, otherwise it may reverse.
      console.log(':::💰 Purchase successful');
      console.log(currentPurchase.transactionReceipt);
      finishTransaction(currentPurchase);
    }
  }, [currentPurchase, finishTransaction]);

  const purchaseProduct = useCallback((product: Product) => {
    if (product.type === 'iap') {
      requestPurchase(product.productId);
    }
  }, []);

  return {
    iapAvailable,
    products,
    availablePurchases,
    purchaseProduct,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
  };
};
