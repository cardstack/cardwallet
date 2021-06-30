import { useEffect, useState } from 'react';
import { useMessage } from './use-message';
import { useVerifyingContract } from './use-verifying-contract';
import { decodeData } from '@cardstack/services';
import {
  TransactionConfirmationData,
  TransactionConfirmationType,
} from '@cardstack/types';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { logger } from '@rainbow-me/utils';

export const useTransactionConfirmationDataWithDecoding = () => {
  const network = useRainbowSelector(state => state.settings.network);
  const [loading, setLoading] = useState(false);

  const [data, setStateData] = useState<TransactionConfirmationData>({
    type: TransactionConfirmationType.GENERIC,
  });

  const message = useMessage();
  const verifyingContract = useVerifyingContract();

  useEffect(() => {
    const setData = async () => {
      try {
        setLoading(true);

        const result = await decodeData(message, verifyingContract, network);

        setStateData(result);
      } catch (error) {
        logger.log(`Decoding data error - ${error}`);
      }

      setLoading(false);
    };

    setData();
  }, [message, verifyingContract, network]);

  return {
    data,
    loading,
  };
};
