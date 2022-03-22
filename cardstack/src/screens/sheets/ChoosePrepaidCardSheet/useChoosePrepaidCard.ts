import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { strings } from './strings';
import { useAccountSettings } from '@rainbow-me/hooks';
import { isLayer1 } from '@cardstack/utils';
import { useGetSafesDataQuery } from '@cardstack/services';
import { PrepaidCardType } from '@cardstack/types';
import { RouteType } from '@cardstack/navigation/types';

type RouteParams = {
  spendAmount: number;
  onConfirmChoosePrepaidCard: (selectedPrepaidCard: PrepaidCardType) => void;
};

export const useChoosePrepaidCard = () => {
  const {
    params: { spendAmount = 0, onConfirmChoosePrepaidCard },
  } = useRoute<RouteType<RouteParams>>();

  const [selectedPrepaidCard, selectPrepaidCard] = useState<PrepaidCardType>();
  const { accountAddress, network, nativeCurrency } = useAccountSettings();
  const { goBack } = useNavigation();

  const { isLoading = true, prepaidCards } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      refetchOnMountOrArgChange: 60,
      skip: isLayer1(network) || !accountAddress,
      selectFromResult: ({
        data,
        isLoading: isLoadingCards,
        isUninitialized,
      }) => ({
        prepaidCards: data?.prepaidCards || [],
        isLoading: isLoadingCards || isUninitialized,
      }),
    }
  );

  useEffect(() => {
    if (!isLoading && prepaidCards.length === 0) {
      Alert.alert(
        strings.noPrepaidCardErrorTitle,
        strings.noPrepaidCardErrorMessage
      );

      goBack();
    }
  }, [
    goBack,
    isLoading,
    onConfirmChoosePrepaidCard,
    prepaidCards,
    spendAmount,
  ]);

  const onSelectPrepaidCard = useCallback(
    (prepaidCardItem: PrepaidCardType) => {
      selectPrepaidCard(prepaidCardItem);
    },
    []
  );

  const onConfirmSelectedCard = useCallback(() => {
    if (selectedPrepaidCard) {
      onConfirmChoosePrepaidCard(selectedPrepaidCard);
    }
  }, [selectedPrepaidCard, onConfirmChoosePrepaidCard]);

  return {
    isLoading,
    prepaidCards,
    spendAmount,
    selectedPrepaidCard,
    onSelectPrepaidCard,
    onConfirmSelectedCard,
  };
};
