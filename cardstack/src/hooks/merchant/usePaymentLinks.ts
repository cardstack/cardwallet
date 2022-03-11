import {
  generateMerchantPaymentUrl,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import { useCallback, useMemo } from 'react';
import { useAccountSettings } from '@rainbow-me/hooks';
import { MerchantInformation } from '@cardstack/types';
import { isLayer2, shareRequestPaymentLink } from '@cardstack/utils';
import logger from 'logger';

export interface usePaymentLinkParams {
  address: string;
  amountInNum?: number;
  nativeCurrency?: string;
  amountWithSymbol?: string;
  merchantInfo?: MerchantInformation;
}

export const usePaymentLinks = ({
  address,
  amountInNum,
  nativeCurrency,
  amountWithSymbol,
  merchantInfo,
}: usePaymentLinkParams) => {
  const { network } = useAccountSettings();

  const paymentRequestWebLink = useMemo(
    () =>
      isLayer2(network)
        ? generateMerchantPaymentUrl({
            domain: getConstantByNetwork('merchantUniLinkDomain', network),
            merchantSafeID: address,
            amount: amountInNum,
            network,
            currency: nativeCurrency,
          })
        : '',
    [address, amountInNum, nativeCurrency, network]
  );

  const paymentRequestDeepLink = useMemo(
    () =>
      isLayer2(network)
        ? generateMerchantPaymentUrl({
            merchantSafeID: address,
            amount: amountInNum,
            network,
            currency: nativeCurrency,
          })
        : '',
    [address, amountInNum, nativeCurrency, network]
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
