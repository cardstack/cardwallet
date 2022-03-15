import React, { memo, useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator, Alert } from 'react-native';
import { useAccountSettings } from '@rainbow-me/hooks';
import {
  CenteredContainer,
  ChoosePrepaidCard,
  SafeAreaView,
} from '@cardstack/components';
import { isLayer1 } from '@cardstack/utils';
import { useGetSafesDataQuery } from '@cardstack/services';
import { PrepaidCardType } from '@cardstack/types';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

type ChoosePrepaidCardSheetRouteParams = {
  params: {
    spendAmount: number;
    onConfirmChoosePrepaidCard: (selectedPrepaidCard: PrepaidCardType) => void;
  };
};

const ChoosePrepaidCardSheet = () => {
  const {
    params: { spendAmount = 0, onConfirmChoosePrepaidCard },
  } = useRoute() as ChoosePrepaidCardSheetRouteParams;

  const [selectedPrepaidCard, selectPrepaidCard] = useState<PrepaidCardType>();
  const { accountAddress, network, nativeCurrency } = useAccountSettings();
  const { goBack } = useNavigation();

  const walletReady = useRainbowSelector(state => state.appState.walletReady);

  const { isLoading = true, prepaidCards } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      refetchOnMountOrArgChange: 60,
      skip: isLayer1(network) || !accountAddress || !walletReady,
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
        'Ooops!',
        `You don't own a Prepaid card!\nYou can create one at app.cardstack.com`
      );

      goBack();
    }
  }, [goBack, prepaidCards.length, isLoading]);

  const onSelectPrepaidCard = useCallback(
    (prepaidCardItem: PrepaidCardType) => {
      selectPrepaidCard(prepaidCardItem);
    },
    []
  );

  const onConfirmSelectedCard = useCallback(() => {
    if (selectedPrepaidCard) {
      onConfirmChoosePrepaidCard(selectedPrepaidCard);
      goBack();
    }
  }, [selectedPrepaidCard, onConfirmChoosePrepaidCard, goBack]);

  return (
    <SafeAreaView flex={1} width="100%" backgroundColor="black">
      {isLoading ? (
        <CenteredContainer flex={1}>
          <ActivityIndicator size="large" />
        </CenteredContainer>
      ) : (
        <ChoosePrepaidCard
          selectedCard={selectedPrepaidCard}
          onConfirmSelectedCard={onConfirmSelectedCard}
          prepaidCards={prepaidCards}
          onSelectPrepaidCard={onSelectPrepaidCard}
          spendAmount={spendAmount}
        />
      )}
    </SafeAreaView>
  );
};

export default memo(ChoosePrepaidCardSheet);
