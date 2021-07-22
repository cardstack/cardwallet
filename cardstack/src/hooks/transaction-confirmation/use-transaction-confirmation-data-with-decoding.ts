import { useEffect, useState } from 'react';
import { useMessage } from './use-message';
import { useVerifyingContract } from './use-verifying-contract';
import { usePrimaryType } from './use-primary-type';
import { decodeData } from '@cardstack/services';
import {
  TransactionConfirmationData,
  TransactionConfirmationType,
} from '@cardstack/types';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { logger } from '@rainbow-me/utils';

export const useTransactionConfirmationDataWithDecoding = () => {
  const [network, nativeCurrency] = useRainbowSelector(state => [
    state.settings.network,
    state.settings.nativeCurrency,
  ]);

  const [loading, setLoading] = useState(false);

  const [data, setStateData] = useState<TransactionConfirmationData>({
    type: TransactionConfirmationType.GENERIC,
  });

  const message = useMessage();
  const verifyingContract = useVerifyingContract();
  const primaryType = usePrimaryType();

  useEffect(() => {
    const setData = async () => {
      try {
        setLoading(true);

        const result = await decodeData(
          message,
          verifyingContract,
          primaryType,
          network,
          nativeCurrency
        );

        setStateData(result);
      } catch (error) {
        logger.log(`Decoding data error - ${error}`);
      }

      setLoading(false);
    };

    setData();
  }, [message, verifyingContract, network, nativeCurrency, primaryType]);

  return {
    data,
    loading,
  };
};
