import { useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert, AlertButton, InteractionManager } from 'react-native';
import { MerchantSafe, isSupportedCurrency } from '@cardstack/cardpay-sdk';
import {
  PayMerchantDecodedData,
  TransactionConfirmationType,
} from '@cardstack/types';
import { isLayer1, useWorker } from '@cardstack/utils';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { networkInfo } from '@rainbow-me/helpers/networkInfo';
import { useAccountSettings } from '@rainbow-me/hooks';
import { getSafeData, useGetSafesDataQuery } from '@cardstack/services';
import {
  useNativeCurrencyAndConversionRates,
  useRainbowSelector,
} from '@rainbow-me/redux/hooks';
import { RouteType } from '@cardstack/navigation/types';

interface Params {
  merchantAddress: string;
  network: Network;
  amount?: string;
  currency?: string;
}

export const handleAlertError = (
  message: string,
  title = 'Oops!',
  buttons?: AlertButton[]
) => Alert.alert(title, message, buttons);

export const usePaymentMerchantUniversalLink = () => {
  const {
    params: { merchantAddress, amount = '0', network: qrCodeNetwork, currency },
  } = useRoute<RouteType<Params>>();

  const [accountCurrency] = useNativeCurrencyAndConversionRates();

  const { goBack } = useNavigation();

  const currencyName =
    currency && isSupportedCurrency(currency) ? currency : accountCurrency;

  const [infoDID, setInfoDID] = useState<string | undefined>();

  const walletReady = useRainbowSelector(state => state.appState.walletReady);

  const {
    accountAddress,
    network: accountNetwork,
    nativeCurrency,
  } = useAccountSettings();

  const { isLoading = true, prepaidCards } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      refetchOnMountOrArgChange: 60,
      skip: isLayer1(accountNetwork) || !accountAddress || !walletReady,
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

  const { callback: getMerchantSafeData } = useWorker(async () => {
    const { infoDID: did } = (await getSafeData(
      merchantAddress
    )) as MerchantSafe;

    setInfoDID(did);
  }, [merchantAddress]);

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
  }, [goBack, prepaidCards.length, isLoading]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (qrCodeNetwork && accountNetwork && qrCodeNetwork !== accountNetwork) {
      InteractionManager.runAfterInteractions(() => {
        handleAlertError(
          `This is a ${networkInfo[qrCodeNetwork].name} request, please confirm your device is on ${networkInfo[qrCodeNetwork].name}.`,
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
  }, [accountNetwork, qrCodeNetwork, goBack, isLoading]);

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
