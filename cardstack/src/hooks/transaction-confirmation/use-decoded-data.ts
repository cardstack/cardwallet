import { useEffect, useState } from 'react';
import { useMessage } from './use-message';
import { TransactionConfirmationType } from '@cardstack/types';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { decodeData, DecodedData } from '@cardstack/services';

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
  const [loading, setLoading] = useState(true);
  const network = useRainbowSelector(state => state.settings.network);

  const [decodedData, setDecodedData] = useState<DecodedData | null>(null);

  const [type, setType] = useState(TransactionConfirmationType.DEFAULT);

  const message = useMessage();

  useEffect(() => {
    const setData = async () => {
      const result = await decodeData(message, network);

      setDecodedData(result.decodedData);
      setType(result.type);
      setLoading(false);
    };

    setData();
  }, [message, network]);

  return {
    decodedData,
    loading,
    type,
  };
};
