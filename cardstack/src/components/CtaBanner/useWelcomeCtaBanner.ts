import { useNavigation } from '@react-navigation/core';
import { useCallback, useMemo } from 'react';

import { useGetEoaClaimedQuery } from '@cardstack/services/hub/hub-api';
import { isLayer2 } from '@cardstack/utils';

import { useWallets, useAccountSettings } from '@rainbow-me/hooks';
import Routes from '@rainbow-me/navigation/routesNames';

import { useCtaBanner } from '.';

const WELCOME_BANNER_KEY = 'WELCOME_BANNER_KEY';

export const useWelcomeCtaBanner = () => {
  const { selectedAccount } = useWallets();
  const { accountAddress, network } = useAccountSettings();

  const { data: claimedResponse = true } = useGetEoaClaimedQuery(
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
  // Derivated addresses are not elegible.
  const isFirstAddressForCurrentWallet = useMemo(
    () => selectedAccount?.index === 0 || false,
    [selectedAccount]
  );

  const showBanner = useMemo(
    () =>
      isLayer2(network) &&
      showBannerUserDecision &&
      isFirstAddressForCurrentWallet &&
      !claimedResponse,
    [
      showBannerUserDecision,
      isFirstAddressForCurrentWallet,
      claimedResponse,
      network,
    ]
  );

  return {
    showBanner,
    dismissBanner,
    onPress,
  };
};
