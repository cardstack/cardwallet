import { useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import { getSDK, MerchantSafe } from '@cardstack/cardpay-sdk';
import { PrepaidCard } from '@cardstack/cardpay-sdk/sdk/prepaid-card';
import { TransactionReceipt } from 'web3-core';
import {
  PayMerchantDecodedData,
  PrepaidCardType,
  TransactionConfirmationType,
} from '@cardstack/types';
import { getSafeData, syncPrepaidCardFaceValue } from '@cardstack/services';
import { useWorker } from '@cardstack/utils';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { fetchAssetsBalancesAndPrices } from '@rainbow-me/redux/fallbackExplorer';
import { useAssetListData, useWallets } from '@rainbow-me/hooks';
import Web3Instance from '@cardstack/models/web3-instance';
import HDProvider from '@cardstack/models/hd-provider';
import { MainRoutes } from '@cardstack/navigation';

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

  const networkName: Network = ['sokol', 'xdai'].includes(network)
    ? network
    : Network.sokol;

  const currencyName = currency || 'SPD';

  const { goBack, navigate } = useNavigation();

  const [infoDID, setInfoDID] = useState<string | undefined>();

  const prepaidCards: PrepaidCardType[] = useRainbowSelector(
    state => state.data.prepaidCards
  );

  const { isLoadingAssets } = useAssetListData();

  const { selectedWallet } = useWallets();

  const { isLoading, callback: getMerchantSafeData } = useWorker(async () => {
    const { infoDID: did } = (await getSafeData(
      merchantAddress
    )) as MerchantSafe;

    setInfoDID(did);
  }, [merchantAddress]);

  useEffect(() => {
    getMerchantSafeData();
  }, [getMerchantSafeData]);

  useEffect(() => {
    if (!isLoadingAssets && prepaidCards.length === 0) {
      handleAlertError(
        `You don't own a Prepaid card!\nYou can create one at app.cardstack.com`
      );

      goBack();

      return;
    }
  }, [isLoadingAssets, goBack, prepaidCards.length]);

  const { isLoading: isLoadingTx, callback: onConfirm, error } = useWorker(
    async (
      updatedSpendAmount: number,
      prepaidCardAddress: string,
      onSuccess: (receipt: TransactionReceipt) => void
    ) => {
      const web3 = await Web3Instance.get({
        selectedWallet,
        network: networkName,
      });

      navigate(MainRoutes.LOADING_OVERLAY, {
        title: 'Processing Transaction',
        subTitle: `This will take approximately\n10-15 seconds`,
      });

      const prepaidCardInstance: PrepaidCard = await getSDK(
        'PrepaidCard',
        web3
      );

      const receipt = await prepaidCardInstance.payMerchant(
        merchantAddress,
        prepaidCardAddress,
        updatedSpendAmount
      );

      onSuccess(receipt);

      // resets signed provider and web3 instance to kill poller
      await HDProvider.reset();

      // update prepaidcard facevalue almost instantly
      await syncPrepaidCardFaceValue(prepaidCardAddress);

      // refetch all assets to sync
      await fetchAssetsBalancesAndPrices();
    },
    [merchantAddress, prepaidCards.length]
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
      amount: parseFloat(amount),
      merchantSafe: merchantAddress,
      currency: currencyName,
    }),
    [infoDID, amount, merchantAddress, currencyName]
  );

  return {
    prepaidCards,
    goBack,
    onConfirm,
    isLoadingTx,
    isLoading: isLoading || isLoadingAssets,
    data,
  };
};
