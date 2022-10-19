import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { useCopyWithFeedback } from '@cardstack/hooks/useCopyWithFeedback';
import { Routes } from '@cardstack/navigation';
import { getAddressPreview } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

export const useWalletAddressScreen = () => {
  const { accountAddress } = useAccountSettings();
  const { navigate } = useNavigation();

  const addressPreview = useMemo(() => getAddressPreview(accountAddress), [
    accountAddress,
  ]);

  const { copyToClipboard } = useCopyWithFeedback({
    dataToCopy: accountAddress,
    customCopyLabel: addressPreview,
  });

  const onAddressPress = useCallback(() => {
    navigate(Routes.CHANGE_WALLET_SHEET);
  }, [navigate]);

  return {
    onAddressPress,
    copyToClipboard,
    addressPreview,
    accountAddress,
  };
};
