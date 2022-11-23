import { useGetSafesDataQuery } from '@cardstack/services';
import { isCardPayCompatible } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

import { useSpendToNativeDisplay } from '../currencies/useSpendDisplay';

export const usePrepaidCard = (address: string) => {
  const { accountAddress, network, nativeCurrency } = useAccountSettings();

  const { isLoading = true, prepaidCard } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      refetchOnMountOrArgChange: 60,
      skip: !isCardPayCompatible(network) || !accountAddress,
      selectFromResult: ({
        data,
        isLoading: isLoadingCards,
        isUninitialized,
      }) => ({
        prepaidCard: data?.prepaidCards?.find(card => card.address === address),
        isLoading: isLoadingCards || isUninitialized,
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
