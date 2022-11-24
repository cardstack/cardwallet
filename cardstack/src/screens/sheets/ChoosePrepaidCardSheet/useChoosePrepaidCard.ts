import { useNavigation, useRoute } from '@react-navigation/native';
import { orderBy } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { RouteType } from '@cardstack/navigation/types';
import { useGetSafesDataQuery } from '@cardstack/services';
import { PrepaidCardType } from '@cardstack/types';

import { useAccountSettings } from '@rainbow-me/hooks';

import { strings } from './strings';

type RouteParams = {
  spendAmount: number;
  onConfirmChoosePrepaidCard: (selectedPrepaidCard: PrepaidCardType) => void;
  payCostDesc?: string;
};

export const useChoosePrepaidCard = () => {
  const {
    params: { spendAmount = 0, onConfirmChoosePrepaidCard, payCostDesc },
  } = useRoute<RouteType<RouteParams>>();

  const [selectedPrepaidCard, selectPrepaidCard] = useState<PrepaidCardType>();

  const {
    accountAddress,
    nativeCurrency,
    noCardPayAccount,
  } = useAccountSettings();

  const { goBack } = useNavigation();

  const { isLoading = true, prepaidCards } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      refetchOnMountOrArgChange: 60,
      skip: noCardPayAccount,
      selectFromResult: ({
        data,
        isLoading: isLoadingCards,
        isUninitialized,
      }) => ({
        prepaidCards:
          orderBy(data?.prepaidCards, 'spendFaceValue', 'desc') || [],
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

      return;
    }

    // automatically select if only one prepaid card is available
    if (
      !isLoading &&
      prepaidCards.length === 1 &&
      prepaidCards[0].spendFaceValue > spendAmount
    ) {
      selectPrepaidCard(prepaidCards[0]);
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
    payCostDesc,
  };
};
