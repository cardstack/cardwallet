import { useEffect, useState } from 'react';
import { MerchantInformation } from '@cardstack/types';
import { fetchMerchantInfoFromDID } from '@cardstack/utils/merchant-utils';
import logger from 'logger';
import { useWorker } from '@cardstack/utils/hooks-utilities';

export const useMerchantInfoFromDID = (DID?: string) => {
  const [merchantInfoDID, setMerchantInfoDID] = useState<MerchantInformation>();

  const {
    callback: getMerchantInfoDID,
    error,
    isLoading,
  } = useWorker(async () => {
    const info = await fetchMerchantInfoFromDID(DID);
    setMerchantInfoDID(info);
  }, [DID]);

  useEffect(() => {
    if (DID) {
      getMerchantInfoDID();
    }
  }, [getMerchantInfoDID, DID]);

  useEffect(() => {
    if (error) {
      logger.log('Error on getMerchantInfoDID', error);
    }
  }, [error]);

  return {
    merchantInfoDID,
    isLoading,
  };
};
