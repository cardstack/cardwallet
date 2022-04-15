import { useRoute, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { RouteType } from '@cardstack/navigation/types';
import { TransactionConfirmationData } from '@cardstack/types';
import { useWorker } from '@cardstack/utils';

interface Params {
  data: TransactionConfirmationData;
  onConfirm: () => Promise<void>;
  onCancel?: () => void;
}

export const useTransactionConfirmationSheet = () => {
  const {
    params: { data, onConfirm, onCancel },
  } = useRoute<RouteType<Params>>();

  const { goBack } = useNavigation();

  const {
    callback: onConfirmCallback,
    isLoading: onConfirmLoading,
  } = useWorker(async () => {
    await onConfirm();
  }, []);

  const onCancelPressed = useCallback(() => {
    goBack();
  }, [goBack]);

  return {
    data,
    onCancel: onCancel || onCancelPressed,
    loading: false,
    onConfirm: onConfirmCallback,
    onConfirmLoading,
  };
};
