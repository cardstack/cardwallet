import { useCallback } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteType } from '@cardstack/navigation/types';
import { TransactionConfirmationData } from '@cardstack/types';
import { useWorker } from '@cardstack/utils';

interface Params {
  data: TransactionConfirmationData;
  onConfirm: () => Promise<void>;
}

export const useTransactionConfirmationSheet = () => {
  const {
    params: { data, onConfirm },
  } = useRoute<RouteType<Params>>();

  const { goBack } = useNavigation();

  const {
    callback: onConfirmCallback,
    isLoading: onConfirmLoading,
  } = useWorker(onConfirm, []);

  const onCancel = useCallback(() => {
    goBack();
  }, [goBack]);

  return {
    data,
    onCancel,
    loading: false,
    onConfirm: onConfirmCallback,
    onConfirmLoading,
  };
};
