import {
  MerchantSafe,
  isSupportedCurrency,
  NativeCurrency,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import { useNavigation, useRoute } from '@react-navigation/native';
import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Alert, AlertButton, InteractionManager } from 'react-native';

import { RouteType } from '@cardstack/navigation/types';
import { getSafeData, useGetPrepaidCardsQuery } from '@cardstack/services';
import {
  NetworkType,
  PayMerchantDecodedData,
  TransactionConfirmationType,
} from '@cardstack/types';
import { isCardPayCompatible, useWorker } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

interface Params {
  merchantAddress: string;
  network: NetworkType;
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
    params: { merchantAddress, amount = '', network: qrCodeNetwork, currency },
  } = useRoute<RouteType<Params>>();

  const {
    accountAddress,
    network: accountNetwork,
    nativeCurrency,
  } = useAccountSettings();

  const networkName = getConstantByNetwork('name', accountNetwork);

  const { goBack } = useNavigation();

  const { currencyName, validAmount } = useMemo(() => {
    const isValidCurrency = currency && isSupportedCurrency(currency);
    return {
      currencyName: (isValidCurrency
        ? currency
        : nativeCurrency) as NativeCurrency,
      validAmount: isValidCurrency ? amount : '',
    };
  }, [amount, currency, nativeCurrency]);

  const [infoDID, setInfoDID] = useState<string | undefined>();

  const { isLoading = true, prepaidCards } = useGetPrepaidCardsQuery(
    { accountAddress, nativeCurrency },
    {
      refetchOnMountOrArgChange: 60,
      skip: !isCardPayCompatible(accountNetwork) || !accountAddress,
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
          `This is a ${networkName} request, please confirm your device is on ${networkName}.`,
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
  }, [accountNetwork, qrCodeNetwork, goBack, isLoading, networkName]);

  const data: PayMerchantDecodedData & { qrCodeNetwork: string } = useMemo(
    () => ({
      type: TransactionConfirmationType.PAY_MERCHANT,
      infoDID,
      qrCodeNetwork,
      amount: validAmount,
      merchantSafe: merchantAddress,
      currency: currencyName,
    }),
    [infoDID, qrCodeNetwork, validAmount, merchantAddress, currencyName]
  );

  return {
    prepaidCards,
    isLoading,
    data,
  };
};
