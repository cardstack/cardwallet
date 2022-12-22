import { useGetSafesDataQuery } from '@cardstack/services';
import { getAddressPreview } from '@cardstack/utils';

import { useAccountProfile, useAccountSettings } from '@rainbow-me/hooks';

export const useNameOrPreviewFromAddress = (address: string) => {
  const { accountAddress, nativeCurrency } = useAccountSettings();
  const { accountName } = useAccountProfile();

  const { merchantSafes } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      selectFromResult: ({ data }) => ({
        merchantSafes: data?.merchantSafes || [],
      }),
    }
  );

  if (address === accountAddress) {
    return { name: `${accountName}` };
  }

  const merchantSafe = merchantSafes.find(
    ({ address: merchantAddress }) => merchantAddress === address
  );

  if (merchantSafe) {
    return {
      name: `${merchantSafe.merchantInfo?.name || getAddressPreview(address)}`,
    };
  }

  return { name: getAddressPreview(address) };
};
