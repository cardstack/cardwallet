import { useEffect, useMemo, useState } from 'react';
import { MerchantInformation } from '@cardstack/types';
import { fetchMerchantInfoFromDID } from '@cardstack/utils/merchant-utils';
import logger from 'logger';

export const useMerchantInfoDID = (DID: string) => {
  const [merchantInfoDID, setMerchantInfoDID] = useState<MerchantInformation>();

  useEffect(() => {
    const getMerchantInfoDID = async () => {
      try {
        const info = await fetchMerchantInfoFromDID(DID);
        setMerchantInfoDID(info);
      } catch (e) {
        logger.log('Error on getMerchantInfoDID', e);
      }
    };

    getMerchantInfoDID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(
    () => ({
      merchantInfoDID,
    }),
    [merchantInfoDID]
  );
};
