import { useGetPrepaidCardsQuery } from '@cardstack/services';

import { useAccountSettings } from '@rainbow-me/hooks';

import { useSpendToNativeDisplay } from '../currencies/useSpendDisplay';

export const usePrepaidCard = (address: string) => {
  const { accountAddress, nativeCurrency } = useAccountSettings();

  const { prepaidCard } = useGetPrepaidCardsQuery(
    { accountAddress, nativeCurrency },
    {
      selectFromResult: ({ data }) => ({
        prepaidCard: data?.prepaidCards?.find(card => card.address === address),
      }),
    }
  );

  const { nativeBalanceDisplay } = useSpendToNativeDisplay({
    spendAmount: prepaidCard?.spendFaceValue || 0,
  });

  return {
    nativeBalanceDisplay,
    prepaidCard,
  };
};
