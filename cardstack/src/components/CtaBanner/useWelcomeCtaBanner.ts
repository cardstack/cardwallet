import { useNavigation } from '@react-navigation/core';
import { useCallback, useMemo } from 'react';

import { useGetEoaClaimedQuery } from '@cardstack/services';

import { useWallets, useAccountSettings } from '@rainbow-me/hooks';
import Routes from '@rainbow-me/navigation/routesNames';

import { useCtaBanner } from '.';

const WELCOME_BANNER_KEY = 'WELCOME_BANNER_KEY';

export const useWelcomeCtaBanner = () => {
  const { wallets, selectedWallet } = useWallets();
  const { accountAddress } = useAccountSettings();

  const { data: claimedResponse } = useGetEoaClaimedQuery({
    eoa: accountAddress,
  });

  const { showBanner: showBannerUserDecision, dismissBanner } = useCtaBanner(
    WELCOME_BANNER_KEY
  );

  const { navigate } = useNavigation();

  const onPress = useCallback(() => {
    navigate(Routes.REQUEST_PREPAID_CARD);
  }, [navigate]);

  // We only consider an address for the drop if its the first address of an EOA.
  // Derivated addresses are not elegible.
  const isFirstAddressForCurrentWallet = useMemo(() => {
    if (!wallets?.[selectedWallet?.id]) return false;

    const { addresses } = wallets[selectedWallet.id];

    const currentWalletAddress = addresses.find(
      (account: any) => account.address === accountAddress
    );

    return currentWalletAddress?.index === 0 || false;
  }, [wallets, selectedWallet, accountAddress]);

  // Addresses that have already claimed a prepaidcard don't see the banner.
  const hasClaimed = useMemo(() => claimedResponse ?? true, [claimedResponse]);

  return {
    showBanner:
      showBannerUserDecision && isFirstAddressForCurrentWallet && !hasClaimed,
    dismissBanner,
    onPress,
  };
};
