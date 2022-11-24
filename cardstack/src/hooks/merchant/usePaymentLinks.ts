import {
  CardPayCapableNetworks,
  generateMerchantPaymentUrl,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import { useCallback, useMemo } from 'react';

import { MerchantInformation } from '@cardstack/types';
import { shareRequestPaymentLink } from '@cardstack/utils';

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
  const { isOnCardPayNetwork, network } = useAccountSettings();

  const generatePaymentUrl = useCallback(
    ({ isWebLink } = {}) => {
      if (!isOnCardPayNetwork) {
        return '';
      }

      const domain = isWebLink
        ? getConstantByNetwork(
            'merchantUniLinkDomain',
            network as CardPayCapableNetworks
          )
        : undefined;

      return generateMerchantPaymentUrl({
        domain,
        merchantSafeID: address,
        amount: amountInNum,
        network,
        currency: paymentCurrency,
      });
    },
    [address, amountInNum, isOnCardPayNetwork, network, paymentCurrency]
  );

  const paymentRequestWebLink = useMemo(
    () => generatePaymentUrl({ isWebLink: true }),
    [generatePaymentUrl]
  );

  const paymentRequestDeepLink = useMemo(() => generatePaymentUrl(), [
    generatePaymentUrl,
  ]);

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
