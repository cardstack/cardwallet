import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getEmailCardDropClaimed } from '@cardstack/models/card-drop-banner';
import { Routes } from '@cardstack/navigation';
import { useGetEoaClaimedQuery } from '@cardstack/services/hub/hub-api';
import { remoteFlags } from '@cardstack/services/remote-config';
import { isLayer2 } from '@cardstack/utils';

import { useWallets, useAccountSettings } from '@rainbow-me/hooks';
import { logger } from '@rainbow-me/utils';

import { useCtaBanner } from '.';

const WELCOME_BANNER_KEY = 'WELCOME_BANNER_KEY';
const EMAIL_POLLING_INTERVAL = 5000;

export const useWelcomeCtaBanner = () => {
  const { selectedAccount } = useWallets();
  const { accountAddress, network } = useAccountSettings();
  const [hasClaimed, setHasClaimed] = useState(true);

  const { data: emailDropGetData } = useGetEoaClaimedQuery(
    { eoa: accountAddress },
    {
      skip: !accountAddress,
      pollingInterval: hasClaimed ? undefined : EMAIL_POLLING_INTERVAL,
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
      const claimedKey = await getEmailCardDropClaimed();

      // user didn't request to claim so there's nothing to do here
      if (!claimedKey) {
        return;
      }

      // starts polling to get new status after user requested a card
      if (claimedKey && !emailDropGetData?.claimed) {
        setHasClaimed(false);

        return;
      }

      // status changed to claimed: true, disables polling
      if (claimedKey && emailDropGetData?.claimed) {
        setHasClaimed(true);

        return;
      }
    } catch (error) {
      logger.log('Error getting claimed status', error);
    }
  }, [emailDropGetData]);

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
