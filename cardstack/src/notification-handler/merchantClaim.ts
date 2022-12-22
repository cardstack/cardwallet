import { MerchantSafe, NativeCurrency } from '@cardstack/cardpay-sdk';

import { Navigation, Routes } from '@cardstack/navigation';
import {
  getSafeData,
  getRevenuePoolBalances,
  updateSafeWithTokenPrices,
} from '@cardstack/services';
import { updateMerchantSafeWithCustomization } from '@cardstack/utils';

import { getNativeCurrency } from '@rainbow-me/handlers/localstorage/globalSettings';
import Logger from 'logger';

export type MerchantClaimNotificationBody = {
  merchantId: string;
};

export const merchantClaimHandler = async (
  data: MerchantClaimNotificationBody
) => {
  try {
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

      Navigation.handleAction(Routes.MERCHANT_SCREEN, {
        merchantSafe: { ...extendedMerchantSafe, revenueBalances },
      });
    }
  } catch (e) {
    Logger.sentry('merchantClaimHandler handling failed - ', e);
  }
};
