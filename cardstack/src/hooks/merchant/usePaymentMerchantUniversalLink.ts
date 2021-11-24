import { useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert, AlertButton, InteractionManager } from 'react-native';
import { MerchantSafe } from '@cardstack/cardpay-sdk';
import {
  PayMerchantDecodedData,
  TransactionConfirmationType,
} from '@cardstack/types';
import { isLayer1, useWorker } from '@cardstack/utils';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { networkInfo } from '@rainbow-me/helpers/networkInfo';
import { useAccountSettings } from '@rainbow-me/hooks';
import { getSafeData, useGetSafesDataQuery } from '@cardstack/services';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

interface RouteType {
  params: {
    merchantAddress: string;
    network: Network;
    amount?: string;
    currency?: string;
  };
  key: string;
  name: string;
}

export const handleAlertError = (
  message: string,
  title = 'Oops!',
  buttons?: AlertButton[]
) => Alert.alert(title, message, buttons);

export const usePaymentMerchantUniversalLink = () => {
  const {
    params: { merchantAddress, amount = '0', network: qrCodeNetwork, currency },
  } = useRoute<RouteType>();

  const { goBack } = useNavigation();

  const currencyName = currency || 'SPD';

  const [infoDID, setInfoDID] = useState<string | undefined>();

  const walletReady = useRainbowSelector(state => state.appState.walletReady);

  const {
    accountAddress,
    network: accountNetwork,
    nativeCurrency,
  } = useAccountSettings();

  const { isLoadingCards, prepaidCards } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      refetchOnMountOrArgChange: 60,
      skip: isLayer1(accountNetwork) || !accountAddress || !walletReady,
      selectFromResult: ({ data, isLoading, isUninitialized }) => ({
        prepaidCards: data?.prepaidCards || [],
        isLoadingCards: isLoading || isUninitialized,
      }),
    }
  );

  const {
    isLoading: isLoadingMerchantInfo,
    callback: getMerchantSafeData,
  } = useWorker(async () => {
    const { infoDID: did } = (await getSafeData(
      merchantAddress
    )) as MerchantSafe;

    setInfoDID(did);
  }, [merchantAddress]);

  const isLoading = !infoDID || isLoadingMerchantInfo || isLoadingCards;

  useEffect(() => {
    getMerchantSafeData();
  }, [getMerchantSafeData]);

  useEffect(() => {
    if (!isLoading && prepaidCards.length === 0) {
      handleAlertError(
        `You don't own a Prepaid card!\nYou can create one at app.cardstack.com`
      );

      goBack();
    }
  }, [isLoadingCards, goBack, prepaidCards.length, isLoading]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (qrCodeNetwork && accountNetwork && qrCodeNetwork !== accountNetwork) {
      InteractionManager.runAfterInteractions(() => {
        handleAlertError(
          `This is a ${networkInfo[qrCodeNetwork].name} QR Code, please confirm your device is on ${networkInfo[qrCodeNetwork].name}.`,
          'Oops!',
          [
            {
              text: 'OK',
              onPress: () => goBack(),
            },
          ]
        );
      });

      return;
    }
  }, [accountNetwork, qrCodeNetwork, goBack, isLoading, isLoadingCards]);

  const data: PayMerchantDecodedData & { qrCodeNetwork: string } = useMemo(
    () => ({
      type: TransactionConfirmationType.PAY_MERCHANT,
      infoDID,
      qrCodeNetwork,
      amount: parseFloat(amount),
      merchantSafe: merchantAddress,
      currency: currencyName,
    }),
    [infoDID, qrCodeNetwork, amount, merchantAddress, currencyName]
  );

  return {
    prepaidCards,
    isLoading,
    data,
  };
};
