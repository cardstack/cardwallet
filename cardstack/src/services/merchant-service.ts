import { MerchantSafe } from '@cardstack/cardpay-sdk';
import logger from 'logger';
import { fetchMerchantInfoFromDID } from '@cardstack/utils';

export const updateMerchantWithCustomization = async (
  merchantSafe: MerchantSafe
) => {
  try {
    const merchantInfo = await fetchMerchantInfoFromDID(merchantSafe.infoDID);

    return {
      ...merchantSafe,
      merchantInfo,
    };
  } catch (e) {
    logger.sentry('Error getting cardCustomization', e);
  }

  return merchantSafe;
};
