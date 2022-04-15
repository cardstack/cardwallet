import { getAddressPreview } from '@cardstack/utils';

import { useAccountProfile } from '@rainbow-me/hooks';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

export const useNameOrPreviewFromAddress = (address: string) => {
  const merchantSafes = useRainbowSelector(state => state.data.merchantSafes);

  const { accountAddress, accountName } = useAccountProfile();

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
