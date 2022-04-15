import { MerchantSafe, NativeCurrency } from '@cardstack/cardpay-sdk';

import { MainRoutes } from '@cardstack/navigation/routes';
import {
  getSafeData,
  getRevenuePoolBalances,
  updateSafeWithTokenPrices,
} from '@cardstack/services';
import { MerchantSafeType } from '@cardstack/types';
import { updateMerchantSafeWithCustomization } from '@cardstack/utils';

import { getNativeCurrency } from '@rainbow-me/handlers/localstorage/globalSettings';
import { Navigation } from '@rainbow-me/navigation';
import store from '@rainbow-me/redux/store';
import Logger from 'logger';

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

      return;
    }

    const merchantSafe = (await getSafeData(data.merchantId)) as MerchantSafe;

    if (merchantSafe) {
      const nativeCurrency = await getNativeCurrency();

      const extendedMerchantSafe = await updateSafeWithTokenPrices(
        await updateMerchantSafeWithCustomization(merchantSafe),
        nativeCurrency || NativeCurrency.USD
      );

      const revenueBalances = await getRevenuePoolBalances(
        merchantSafe.address,
        nativeCurrency
      );

      Navigation.handleAction(MainRoutes.MERCHANT_SCREEN, {
        merchantSafe: { ...extendedMerchantSafe, revenueBalances },
      });
    }
  } catch (e) {
    Logger.sentry('merchantClaimHandler handling failed - ', e);
  }
};
