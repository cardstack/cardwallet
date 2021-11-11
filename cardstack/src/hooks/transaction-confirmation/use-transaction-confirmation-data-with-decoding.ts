import { useEffect, useState } from 'react';

import { TransactionConfirmationContext } from '../../transaction-confirmation-strategies/context';
import { usePayloadParams } from './use-payload-params';
import { logger } from '@rainbow-me/utils';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import {
  TransactionConfirmationData,
  TransactionConfirmationType,
} from '@cardstack/types';

export const useTransactionConfirmationDataWithDecoding = () => {
  const [network, nativeCurrency] = useRainbowSelector(state => [
    state.settings.network,
    state.settings.nativeCurrency,
  ]);

  const [loading, setLoading] = useState(false);

  const [data, setStateData] = useState<TransactionConfirmationData>({
    type: TransactionConfirmationType.GENERIC,
  });

  const {
    message,
    primaryType,
    domain: { verifyingContract },
  } = usePayloadParams();

  useEffect(() => {
    const setData = async () => {
      try {
        setLoading(true);

        const transactionConfirmationContext = new TransactionConfirmationContext(
          message,
          verifyingContract,
          primaryType,
          network,
          nativeCurrency
        );

        const result = await transactionConfirmationContext.getDecodedData();

        setStateData(result);
      } catch (error) {
        logger.error(`Decoding data error - ${error}`);
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
