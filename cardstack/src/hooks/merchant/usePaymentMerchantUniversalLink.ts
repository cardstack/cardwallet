import { useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import Web3 from 'web3';
import { getSDK, MerchantSafe } from '@cardstack/cardpay-sdk';
import { PrepaidCard } from '@cardstack/cardpay-sdk/sdk/prepaid-card';
import { getHdSignedProvider } from '@cardstack/models';
import {
  PayMerchantDecodedData,
  TransactionConfirmationType,
} from '@cardstack/types';
import { getSafeData } from '@cardstack/services';
import { useWorker } from '@cardstack/utils';
import RainbowRoutes from '@rainbow-me/navigation/routesNames';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { useWallets } from '@rainbow-me/hooks';

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

const handleAlertError = (message: string) => {
  Alert.alert(`Oops!`, message);
};

export const usePaymentMerchantUniversalLink = () => {
  const {
    params: { merchantAddress, amount = '0', network, currency },
  } = useRoute<RouteType>();

  const { goBack, navigate } = useNavigation();

  const [infoDID, setInfoDID] = useState<string | undefined>();

  const prepaidCards = useRainbowSelector(state => state.data.prepaidCards);
  const { selectedWallet } = useWallets();

  const noPrepaidCard = !prepaidCards.length;
  const prepaidCardAddress = prepaidCards[0]?.address;
  const spendAmount = parseFloat(amount);

  const { isLoading, callback: getMerchantSafeData } = useWorker(async () => {
    const { infoDID: did } = (await getSafeData(
      merchantAddress
    )) as MerchantSafe;

    setInfoDID(did);
  }, [merchantAddress]);

  useEffect(() => {
    if (noPrepaidCard) {
      handleAlertError(
        `You don't own a Prepaid card!\nYou can create one at app.cardstack.com`
      );

      goBack();

      return;
    }

    getMerchantSafeData();
  }, [getMerchantSafeData, goBack, noPrepaidCard, prepaidCards.length]);

  const { isLoading: isLoadingTx, callback: onConfirm, error } = useWorker(
    async (updatedSpendAmount: number) => {
      const web3 = new Web3(
        await getHdSignedProvider({
          selectedWallet,
          network,
        })
      );

      const prepaidCard: PrepaidCard = await getSDK('PrepaidCard', web3);

      await prepaidCard.payMerchant(
        merchantAddress,
        prepaidCardAddress,
        updatedSpendAmount
      );

      navigate(RainbowRoutes.PROFILE_SCREEN);
    },
    [merchantAddress, prepaidCardAddress]
  );

  useEffect(() => {
    if (error) {
      handleAlertError(
        'Something went wrong, make sure you have enough balance'
      );
    }
  }, [error]);

  const data: PayMerchantDecodedData = useMemo(
    () => ({
      type: TransactionConfirmationType.PAY_MERCHANT,
      infoDID,
      spendAmount,
      prepaidCard: prepaidCardAddress,
      merchantSafe: merchantAddress,
      currency,
    }),
    [infoDID, merchantAddress, prepaidCardAddress, spendAmount, currency]
  );

  return { noPrepaidCard, goBack, onConfirm, isLoadingTx, isLoading, data };
};
