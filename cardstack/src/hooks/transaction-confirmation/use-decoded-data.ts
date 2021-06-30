import { useEffect, useState } from 'react';
import { useMessage } from './use-message';
import { logger } from '@rainbow-me/utils';
import { DecodedData, TransactionConfirmationType } from '@cardstack/types';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { decodeData } from '@cardstack/services';

/* 
  scenario 1: to is prepaid cardmanager -> create prepaid card 

  scenario 2: to is action dispatcher
    a: actionName === 'registerMerchant' -> register merchant
    b: actionName === 'payMerchant' -> pay merchant
    c: actionName === 'split' -> split prepaid card
    d: actionName === 'transfer' -> transfer prepaid card

  scenario 3: to is revenue pool -> claim revenue
*/
export const useDecodedData = () => {
  const [loading, setLoading] = useState(false);
  const network = useRainbowSelector(state => state.settings.network);

  const [decodedData, setDecodedData] = useState<DecodedData | null>(null);

  const [type, setType] = useState(TransactionConfirmationType.DEFAULT);

  const message = useMessage();

  useEffect(() => {
    const setData = async () => {
      try {
        setLoading(true);

        const result = await decodeData(message, network);

        setDecodedData(result.decodedData);
        setType(result.type);
      } catch (error) {
        logger.log(`Decoding data error - ${error}`);
      }

      setLoading(false);
    };

    setData();
  }, [message, network]);

  console.log({ decodedData, type });

  return {
    decodedData,
    loading,
    type,
  };
};
