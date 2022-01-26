import { Navigation } from '@rainbow-me/navigation';
import { MainRoutes } from '@cardstack/navigation/routes';
import store from '@rainbow-me/redux/store';
import Logger from 'logger';
import { MerchantSafeType } from '@cardstack/types';

export type MerchantClaimNotificationBody = {
  merchantId: string;
};

export const merchantClaimHandler = async (
  data: MerchantClaimNotificationBody
) => {
  try {
    const { merchantSafes } = store.getState().data;

    const merchantData = merchantSafes.find(
      (merchantSafe: MerchantSafeType) =>
        merchantSafe.address === data.merchantId
    );

    if (merchantData) {
      Navigation.handleAction(MainRoutes.MERCHANT_SCREEN, {
        merchantSafe: merchantData,
      });
    }
  } catch (e) {
    Logger.sentry('merchantClaimHandler handling failed - ', e);
  }
};
