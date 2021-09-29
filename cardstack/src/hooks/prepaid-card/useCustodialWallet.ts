import { useEffect, useState } from 'react';
import { useAuthToken } from '@cardstack/hooks/prepaid-card/useAuthToken';
import { useWorker } from '@cardstack/utils';
import logger from 'logger';

interface CustodialWalletAttrs {
  'wyre-wallet-id': string;
  'user-address': string;
  'deposit-address': string;
}

interface CustodialWallet {
  id: string;
  type: string;
  attributes: CustodialWalletAttrs;
}

export const useCustodialWallet = (hubURL?: string) => {
  const { authToken } = useAuthToken(hubURL);
  const [custodialWallet, setCustodialWallet] = useState<CustodialWallet>();

  const { callback: getCustodialWallet, error } = useWorker(async () => {
    const results = await fetch(`${hubURL}/api/custodial-wallet`, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer: ${authToken}`,
      },
    });

    if (results.ok) {
      const result = await results.json();
      setCustodialWallet(result.data);
    }
  }, [hubURL]);

  useEffect(() => {
    getCustodialWallet();
  }, [getCustodialWallet]);

  useEffect(() => {
    if (error) {
      logger.log('Error getting Wyre data', error);
    }
  }, [error]);

  return { custodialWallet };
};
