import { useCallback, useState } from 'react';
import { Alert } from '../components/alerts';
import {
  getOrderId,
  getReferenceId,
  getWalletOrderQuotation,
  PaymentRequestStatusTypes,
  reserveWyreOrder,
  showApplePayRequest,
} from '../handlers/buyCardWyre';
import useAccountSettings from './useAccountSettings';
import usePurchaseTransactionStatus from './usePurchaseTransactionStatus';
import useTimeout from './useTimeout';
import { getTokenMetadata } from '@rainbow-me/utils';
import logger from 'logger';

export default function useBuyPrepaidCard() {
  const [orderId, setOrderId] = useState<string>('');
  const { accountAddress, network } = useAccountSettings();

  const [isPaymentComplete, setPaymentComplete] = useState(false);
  const [orderCurrency] = useState(null);

  const { error, orderStatus, transferStatus } = usePurchaseTransactionStatus();

  const [startPaymentCompleteTimeout] = useTimeout();

  const handlePaymentCallback = useCallback(() => {
    // In order to have the UI appear to be in-sync with the Apple Pay modal's
    // animation, we need to artificially delay before marking a purchase as pending.
    // @ts-ignore
    startPaymentCompleteTimeout(() => setPaymentComplete(true), 1500);
  }, [startPaymentCompleteTimeout]);

  const onPurchase = useCallback(
    async ({ address, value, depositAddress, sourceCurrency }) => {
      const metadata = getTokenMetadata(address);
      const currency = metadata?.symbol;

      const referenceInfo = {
        referenceId: getReferenceId(accountAddress),
        orderId: undefined,
      };

      const { reservation: reservationId } = await reserveWyreOrder(
        value,
        currency,
        depositAddress,
        network,
        null,
        sourceCurrency
      );

      if (!reservationId) {
        Alert({
          buttons: [{ text: 'Okay' }],
          message:
            'We were unable to reserve your purchase order. Please try again later.',
          title: `Something went wrong!`,
        });
        return;
      }
      const quotation = await getWalletOrderQuotation(
        value,
        currency,
        depositAddress,
        network,
        sourceCurrency
      );

      if (!quotation) {
        Alert({
          buttons: [{ text: 'Okay' }],
          message:
            'We were unable to get a quote on your purchase order. Please try again later.',
          title: `Something went wrong!`,
        });
        return;
      }

      const { sourceAmountWithFees, purchaseFee } = quotation;

      const applePayResponse = await showApplePayRequest(
        referenceInfo,
        depositAddress,
        currency,
        sourceAmountWithFees,
        purchaseFee,
        value,
        network,
        sourceCurrency
      );

      if (applePayResponse) {
        logger.log('[add cash] - get order id');
        const { orderId } = await getOrderId(
          referenceInfo,
          applePayResponse,
          sourceAmountWithFees,
          depositAddress,
          currency,
          network,
          reservationId
        );
        if (orderId) {
          setOrderId(orderId);
          referenceInfo.orderId = orderId;
          applePayResponse.complete(PaymentRequestStatusTypes.SUCCESS);
          handlePaymentCallback();
          return orderId;
          // TODO: Sentry?
          // dispatch(
          //   addCashGetOrderStatus(
          //     referenceInfo,
          //     currency,
          //     orderId,
          //     applePayResponse,
          //     value
          //   )
          // );
        } else {
          // TODO: Sentry?
          // dispatch(
          //   addCashOrderCreationFailure({
          //     errorCategory,
          //     errorCode,
          //     errorMessage,
          //   })
          // );
          applePayResponse.complete(PaymentRequestStatusTypes.FAIL);
          handlePaymentCallback();
        }
      }
    },
    [accountAddress, handlePaymentCallback, network]
  );

  return {
    error,
    isPaymentComplete,
    onPurchase,
    orderCurrency,
    orderStatus,
    transferStatus,
    orderId,
  };
}
