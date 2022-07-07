import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { Routes } from '@cardstack/navigation';
import { useGetEoaClaimedQuery } from '@cardstack/services/hub/hub-api';
import { remoteFlags } from '@cardstack/services/remote-config';
import { isLayer2 } from '@cardstack/utils';

import { useWallets, useAccountSettings } from '@rainbow-me/hooks';

import { useCtaBanner } from '.';

const WELCOME_BANNER_KEY = 'WELCOME_BANNER_KEY';

export const useWelcomeCtaBanner = () => {
  const { selectedAccount } = useWallets();
  const { accountAddress, network } = useAccountSettings();

  const {
    data: emailDropGetData = { showBanner: false },
  } = useGetEoaClaimedQuery(
    {
      eoa: accountAddress,
    },
    { skip: !accountAddress }
  );

  const { showBanner: showBannerUserDecision, dismissBanner } = useCtaBanner(
    WELCOME_BANNER_KEY
  );

  const { navigate } = useNavigation();

  const onPress = useCallback(() => {
    navigate(Routes.REQUEST_PREPAID_CARD);
  }, [navigate]);

  // We only consider an address for the drop if its the first address of an EOA.
  // Derived addresses are not elegible.
  const isFirstAddressForCurrentWallet = useMemo(
    () => selectedAccount?.index === 0 || false,
    [selectedAccount]
  );

  const showBanner = useMemo(
    () =>
      isLayer2(network) &&
      remoteFlags().featurePrepaidCardDrop &&
      showBannerUserDecision &&
      isFirstAddressForCurrentWallet &&
      emailDropGetData?.showBanner,
    [
      showBannerUserDecision,
      isFirstAddressForCurrentWallet,
      network,
      emailDropGetData,
    ]
  );

  return {
    showBanner,
    dismissBanner,
    onPress,
  };
};
