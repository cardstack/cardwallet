import { useEffect, useState } from 'react';
import { useWorker } from '@cardstack/utils';
import logger from 'logger';
import { axiosInstance } from '@cardstack/models/axios-instance';

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

export const useCustodialWallet = (hubURL: string, authToken: string) => {
  const [custodialWallet, setCustodialWallet] = useState<CustodialWallet>();

  const { callback: getCustodialWallet, error } = useWorker(async () => {
    const results = await axiosInstance(authToken).get(
      `${hubURL}/api/custodial-wallet`
    );

    if (results.data?.data) {
      const result = await results.data?.data;
      setCustodialWallet(result);
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
