import { useCallback, useEffect } from 'react';
import { requestPurchase, useIAP, Product } from 'react-native-iap';

// TODO: Product ID will be fetched from hub.
const skus = ['0001', '1'];

export const usePurchaseProfile = () => {
  const {
    connected: iapAvailable,
    products,
    getProducts,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
  } = useIAP();

  useEffect(() => {
    getProducts(skus);
  }, [getProducts]);

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
