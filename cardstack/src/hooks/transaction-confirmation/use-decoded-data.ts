import { useEffect, useState } from 'react';

import { useMessage } from './use-message';
import {
  decodeIssuePrepaidCardData,
  IssuePrepaidCardDecodedData,
} from '@cardstack/services';
import { TransactionConfirmationType } from '@cardstack/types';

export const useDecodedData = () => {
  const [loading, setLoading] = useState(true);

  const [
    decodedData,
    setDecodedData,
  ] = useState<IssuePrepaidCardDecodedData | null>(null);

  const [type, setType] = useState(TransactionConfirmationType.DEFAULT);

  const message = useMessage();

  useEffect(() => {
    const decodeData = async () => {
      const data = await decodeIssuePrepaidCardData(message);

      setDecodedData(data);
      setLoading(false);
    };

    decodeData();
  }, [message]);

  return {
    decodedData,
    loading,
    type,
  };
};
