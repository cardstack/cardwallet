import {
  generateMerchantPaymentUrl,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import { useCallback, useMemo } from 'react';

import { MerchantInformation } from '@cardstack/types';
import { isCardPayCompatible, shareRequestPaymentLink } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';
import logger from 'logger';

export interface usePaymentLinkParams {
  address: string;
  amountInNum?: number;
  paymentCurrency?: string;
  amountWithSymbol?: string;
  merchantInfo?: MerchantInformation;
}

export const usePaymentLinks = ({
  address,
  amountInNum,
  paymentCurrency,
  amountWithSymbol,
  merchantInfo,
}: usePaymentLinkParams) => {
  const { network } = useAccountSettings();

  const paymentRequestWebLink = useMemo(
    () =>
      isCardPayCompatible(network)
        ? generateMerchantPaymentUrl({
            domain: getConstantByNetwork('merchantUniLinkDomain', network),
            merchantSafeID: address,
            amount: amountInNum,
            network,
            currency: paymentCurrency,
          })
        : '',
    [address, amountInNum, paymentCurrency, network]
  );

  const paymentRequestDeepLink = useMemo(
    () =>
      isCardPayCompatible(network)
        ? generateMerchantPaymentUrl({
            merchantSafeID: address,
            amount: amountInNum,
            network,
            currency: paymentCurrency,
          })
        : '',
    [address, amountInNum, paymentCurrency, network]
  );

  const handleShareLink = useCallback(async () => {
    try {
      await shareRequestPaymentLink(
        paymentRequestWebLink,
        merchantInfo?.name || '',
        amountWithSymbol
      );
    } catch (e) {
      logger.sentry('Payment Request Link share failed', e);
    }
  }, [amountWithSymbol, merchantInfo, paymentRequestWebLink]);

  return {
    paymentRequestWebLink,
    paymentRequestDeepLink,
    handleShareLink,
  };
};
