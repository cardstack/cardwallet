import { useCallback, useEffect } from 'react';
import { requestPurchase, useIAP, Product } from 'react-native-iap';

// TODO: Product ID will be fetched from hub.
const skus = ['0001', '1'];

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

  useEffect(() => {
    getProducts(skus);
  }, [getProducts]);

  useEffect(() => {
    if (currentPurchase) {
      // todo here we'll validate currentPurchase.transactionReceipt in the HUB.
      // if valid, we need to finish the transaction, otherwise it may reverse.
      console.log('::: purchase successful');
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
    purchaseProduct,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
  };
};
