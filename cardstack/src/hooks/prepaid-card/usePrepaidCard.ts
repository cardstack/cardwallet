import { useGetPrepaidCardsQuery } from '@cardstack/services';

import { useAccountSettings } from '@rainbow-me/hooks';

import { useSpendToNativeDisplay } from '../currencies/useSpendDisplay';

export const usePrepaidCard = (address: string) => {
  const { accountAddress, nativeCurrency } = useAccountSettings();

  const { prepaidCard, isLoading } = useGetPrepaidCardsQuery(
    { accountAddress, nativeCurrency },
    {
      selectFromResult: ({ data, ...rest }) => ({
        prepaidCard: data?.prepaidCards?.find(card => card.address === address),
        ...rest,
      }),
    }
  );

  const { nativeBalanceDisplay } = useSpendToNativeDisplay({
    spendAmount: prepaidCard?.spendFaceValue || 0,
  });

  return {
    nativeBalanceDisplay,
    prepaidCard,
    isLoading,
  };
};
