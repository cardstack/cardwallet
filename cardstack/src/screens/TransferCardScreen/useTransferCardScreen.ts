import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { useBooleanState, useMutationEffects } from '@cardstack/hooks';
import { useLoadingOverlay } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { useTransferPrepaidCardMutation } from '@cardstack/services';
import { layoutEasingAnimation } from '@cardstack/utils';

import { Alert } from '@rainbow-me/components/alerts';
import { useSendAddressValidation } from '@rainbow-me/components/send/SendSheet';
import { useWallets } from '@rainbow-me/hooks';
import haptics from '@rainbow-me/utils/haptics';

import { strings } from './strings';

interface NavParams {
  prepaidCardAddress: string;
}

export const useTransferCardScreen = () => {
  const {
    params: { prepaidCardAddress },
  } = useRoute<RouteType<NavParams>>();

  const { goBack } = useNavigation();

  const [newOwnerAddress, setNewOwnerAddress] = useState('');

  const isValidAddress = useSendAddressValidation(newOwnerAddress);

  const { accountAddress } = useWallets();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const [renderScanPage, showScanPage, dismissScanPage] = useBooleanState();

  useLayoutEffect(() => {
    layoutEasingAnimation();
  }, [renderScanPage]);

  const onChangeText = useCallback(text => {
    setNewOwnerAddress(text);
  }, []);

  const [
    transferPrepaidCard,
    { isSuccess, isError },
  ] = useTransferPrepaidCardMutation();

  const onTransferFinishedAlert = useCallback(
    ({ title, message }) => () => {
      dismissLoadingOverlay();

      Alert({
        message,
        title,
        buttons: [{ text: strings.alert.btnLabel, onPress: goBack }],
      });
    },
    [dismissLoadingOverlay, goBack]
  );

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isSuccess,
          callback: onTransferFinishedAlert({
            title: strings.alert.success.title,
            message: strings.alert.success.message,
          }),
        },
        error: {
          status: isError,
          callback: onTransferFinishedAlert({
            title: strings.alert.error.title,
            message: strings.alert.error.message,
          }),
        },
      }),
      [isError, isSuccess, onTransferFinishedAlert]
    )
  );

  const onTransferPress = useCallback(() => {
    showLoadingOverlay({ title: strings.loadingTitle });

    transferPrepaidCard({
      accountAddress,
      prepaidCardAddress,
      newOwner: newOwnerAddress,
    });
  }, [
    accountAddress,
    newOwnerAddress,
    prepaidCardAddress,
    showLoadingOverlay,
    transferPrepaidCard,
  ]);

  const onScanHandler = useCallback(
    (qrCodeAddress: string) => {
      haptics.notificationSuccess();
      setNewOwnerAddress(qrCodeAddress);

      dismissScanPage();
    },
    [dismissScanPage]
  );

  return {
    renderScanPage,
    isValidAddress,
    onChangeText,
    onTransferPress,
    onScanPress: showScanPage,
    goBack,
    dismissScanPage,
    onScanHandler,
    newOwnerAddress,
  };
};
