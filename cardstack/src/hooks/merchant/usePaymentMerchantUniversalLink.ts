import { useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert, AlertButton, InteractionManager } from 'react-native';
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
import { networkInfo } from '@rainbow-me/helpers/networkInfo';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { fetchAssetsBalancesAndPrices } from '@rainbow-me/redux/fallbackExplorer';
import {
  useAccountSettings,
  useAssetListData,
  useWallets,
} from '@rainbow-me/hooks';
import Web3Instance from '@cardstack/models/web3-instance';
import HDProvider from '@cardstack/models/hd-provider';
import { useLoadingOverlay } from '@cardstack/navigation';
import logger from 'logger';

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

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const { goBack } = useNavigation();

  const currencyName = currency || 'SPD';

  const [infoDID, setInfoDID] = useState<string | undefined>();

  const prepaidCards: PrepaidCardType[] = useRainbowSelector(
    state => state.data.prepaidCards
  );

  const { isLoadingAssets } = useAssetListData();

  const { selectedWallet } = useWallets();
  const { accountAddress, network: accountNetwork } = useAccountSettings();

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

  useEffect(() => {
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
  }, [accountNetwork, qrCodeNetwork, goBack]);

  const { isLoading: isLoadingTx, callback: onConfirm, error } = useWorker(
    async (
      updatedSpendAmount: number,
      prepaidCardAddress: string,
      onSuccess: (receipt: TransactionReceipt) => void
    ) => {
      showLoadingOverlay({
        title: 'Processing Transaction',
        subTitle: `This will take approximately\n10-15 seconds`,
      });

      const web3 = await Web3Instance.get({
        selectedWallet,
        network: qrCodeNetwork,
      });

      const prepaidCardInstance: PrepaidCard = await getSDK(
        'PrepaidCard',
        web3
      );

      const receipt = await prepaidCardInstance.payMerchant(
        merchantAddress,
        prepaidCardAddress,
        updatedSpendAmount,
        undefined,
        { from: accountAddress }
      );

      // update prepaidcard facevalue almost instantly
      await syncPrepaidCardFaceValue(prepaidCardAddress);

      // refetch all assets to sync
      await fetchAssetsBalancesAndPrices();

      // resets signed provider and web3 instance to kill poller
      await HDProvider.reset();

      onSuccess(receipt);
    },
    [
      merchantAddress,
      prepaidCards.length,
      accountAddress,
      showLoadingOverlay,
      selectedWallet,
    ]
  );

  useEffect(() => {
    if (error) {
      dismissLoadingOverlay();
      logger.sentry('Pay Merchant failed!', error);
      handleAlertError(
        'Something unexpected happened! Please try again. If this error persists please contact support@cardstack.com'
      );
    }
  }, [dismissLoadingOverlay, error]);

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
