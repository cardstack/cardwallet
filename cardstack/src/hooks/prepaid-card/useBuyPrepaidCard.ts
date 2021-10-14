import { useCallback, useState } from 'react';
import { Alert } from '@rainbow-me/components/alerts';
import {
  getOrderId,
  getReferenceId,
  getWalletOrderQuotation,
  PaymentRequestStatusTypes,
  reserveWyreOrder,
  showApplePayRequest,
} from '@cardstack/utils/wyre-utils';
import useAccountSettings from '@rainbow-me/hooks/useAccountSettings';
import usePurchaseTransactionStatus from '@rainbow-me/hooks/usePurchaseTransactionStatus';
import useTimeout from '@rainbow-me/hooks/useTimeout';
import { getTokenMetadata } from '@rainbow-me/utils';
import logger from 'logger';
import NetworkTypes, { Network } from '@rainbow-me/networkTypes';

const HUB_URL_STAGING = 'https://hub-staging.stack.cards';
const HUB_URL_PROD = 'https://hub.cardstack.com';

const getHubUrl = (network: Network) =>
  network === NetworkTypes.mainnet ? HUB_URL_PROD : HUB_URL_STAGING;

export default function useBuyPrepaidCard() {
  const [order, setOrder] = useState<string>('');
  const { accountAddress, network } = useAccountSettings();

  const [isPaymentComplete, setPaymentComplete] = useState(false);
  const [orderCurrency] = useState(null);
  const [hubURL] = useState<string>(getHubUrl(network));

  const { error, orderStatus, transferStatus } = usePurchaseTransactionStatus();

  const [startPaymentCompleteTimeout] = useTimeout();

  const handlePaymentCallback = useCallback(() => {
    // In order to have the UI appear to be in-sync with the Apple Pay modal's
    // animation, we need to artificially delay before marking a purchase as pending.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    startPaymentCompleteTimeout(() => setPaymentComplete(true), 1500);
  }, [startPaymentCompleteTimeout]);

  const onPurchase = useCallback(
    async ({ address, value, depositAddress, sourceCurrency }) => {
      const metadata = getTokenMetadata(address);
      const currency = metadata?.symbol || '';

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
          setOrder(orderId);
          referenceInfo.orderId = orderId;
          applePayResponse.complete(PaymentRequestStatusTypes.SUCCESS);
          handlePaymentCallback();

          return orderId;
        } else {
          applePayResponse.complete(PaymentRequestStatusTypes.FAIL);

          logger.sentry(
            'Error getting order id',
            referenceInfo,
            applePayResponse,
            sourceAmountWithFees,
            depositAddress,
            currency,
            network,
            reservationId
          );

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
    order,
    hubURL,
  };
}
