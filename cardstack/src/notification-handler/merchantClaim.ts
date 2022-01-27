import { MerchantSafe, NativeCurrency } from '@cardstack/cardpay-sdk';
import { Navigation } from '@rainbow-me/navigation';
import { MainRoutes } from '@cardstack/navigation/routes';
import { updateMerchantSafeWithCustomization } from '@cardstack/utils';
import Logger from 'logger';
import {
  getSafeData,
  getRevenuePoolBalances,
  updateSafeWithTokenPrices,
} from '@cardstack/services';
import { getNativeCurrency } from '@rainbow-me/handlers/localstorage/globalSettings';

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

      Navigation.handleAction(MainRoutes.MERCHANT_SCREEN, {
        merchantSafe: { ...extendedMerchantSafe, revenueBalances },
      });
    }
  } catch (e) {
    Logger.sentry('merchantClaimHandler handling failed - ', e);
  }
};
