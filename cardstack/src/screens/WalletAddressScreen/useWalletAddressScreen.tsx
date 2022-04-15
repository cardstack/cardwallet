import { useNavigation } from '@react-navigation/core';
import { useCallback, useMemo } from 'react';

import { useCopyToast } from '@cardstack/hooks/useCopyToast';
import { getAddressPreview } from '@cardstack/utils';

import { useAccountProfile } from '@rainbow-me/hooks';
import Routes from '@rainbow-me/navigation/routesNames';

export const useWalletAddressScreen = () => {
  const { accountAddress } = useAccountProfile();
  const { navigate } = useNavigation();

  const addressPreview = useMemo(() => getAddressPreview(accountAddress), [
    accountAddress,
  ]);

  const { CopyToastComponent, copyToClipboard } = useCopyToast({
    dataToCopy: accountAddress,
    customCopyLabel: addressPreview,
  });

  const onAddressPress = useCallback(() => {
    navigate(Routes.CHANGE_WALLET_SHEET);
  }, [navigate]);

  return {
    onAddressPress,
    CopyToastComponent,
    copyToClipboard,
    addressPreview,
    accountAddress,
  };
};
