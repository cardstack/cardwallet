import { useMemo, useCallback } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteType } from '@cardstack/navigation/types';
import {
  MerchantInformation,
  RegisterMerchantDecodedData,
  TransactionConfirmationType,
} from '@cardstack/types';
import { useWorker } from '@cardstack/utils';
import { useAccountSettings } from '@rainbow-me/hooks';

interface Params {
  prepaidCard: string;
  spendAmount: number;
  currency?: string;
  merchantInfo?: MerchantInformation;
  onConfirm: () => Promise<string>;
}

export const useTransactionConfirmationSheet = () => {
  const {
    params: { prepaidCard, spendAmount, merchantInfo, onConfirm },
  } = useRoute<RouteType<Params>>();

  const { goBack } = useNavigation();

  const { nativeCurrency } = useAccountSettings();

  const data: RegisterMerchantDecodedData = useMemo(
    () => ({
      type: TransactionConfirmationType.REGISTER_MERCHANT,
      spendAmount,
      prepaidCard: prepaidCard,
      merchantInfo,
      currency: nativeCurrency,
      isProfile: true,
    }),
    [spendAmount, prepaidCard, merchantInfo, nativeCurrency]
  );

  const {
    callback: onConfirmCallback,
    isLoading: onConfirmLoading,
  } = useWorker(async () => {
    const result = await onConfirm();

    if (result) {
      return result;
    }

    goBack();
  }, []);

  const onCancel = useCallback(() => {
    goBack();
  }, [goBack]);

  return {
    data,
    loading: false,
    onCancel: onCancel,
    onConfirm: onConfirmCallback,
    onConfirmLoading,
  };
};
