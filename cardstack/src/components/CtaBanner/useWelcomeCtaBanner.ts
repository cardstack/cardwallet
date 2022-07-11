import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Routes } from '@cardstack/navigation';
import { useGetEoaClaimedQuery } from '@cardstack/services/hub/hub-api';
import { remoteFlags } from '@cardstack/services/remote-config';
import { isLayer2, PREPAID_CARD_CLAIMED_KEY } from '@cardstack/utils';

import { useWallets, useAccountSettings } from '@rainbow-me/hooks';
import { logger } from '@rainbow-me/utils';

import { useCtaBanner } from '.';

const WELCOME_BANNER_KEY = 'WELCOME_BANNER_KEY';

export const useWelcomeCtaBanner = () => {
  const { selectedAccount } = useWallets();
  const { accountAddress, network } = useAccountSettings();
  const [hasClaimed, setHasClaimed] = useState(true);

  const { data: emailDropGetData } = useGetEoaClaimedQuery(
    { eoa: accountAddress },
    {
      skip: !accountAddress,
      pollingInterval: hasClaimed ? undefined : 5000,
    }
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
      (emailDropGetData?.showBanner ?? false),
    [
      showBannerUserDecision,
      isFirstAddressForCurrentWallet,
      network,
      emailDropGetData,
    ]
  );

  const handleClaimStatus = useCallback(async () => {
    try {
      if (emailDropGetData?.claimed) {
        await AsyncStorage.setItem(PREPAID_CARD_CLAIMED_KEY, accountAddress);
        setHasClaimed(true);

        return;
      }

      const claimedKey = await AsyncStorage.getItem(PREPAID_CARD_CLAIMED_KEY);

      if (
        !claimedKey ||
        claimedKey !== accountAddress ||
        !emailDropGetData?.claimed
      ) {
        setHasClaimed(false);
      }
    } catch (error) {
      logger.log('[Async Storage] Error getting key', error);
    }
  }, [accountAddress, emailDropGetData]);

  // handles/enables polling only if banner is visible
  useEffect(() => {
    if (showBanner) {
      handleClaimStatus();
    }
  }, [handleClaimStatus, showBanner]);

  return {
    showBanner,
    dismissBanner,
    onPress,
  };
};
