import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useRemoteConfigs } from '@cardstack/hooks';
import { Routes } from '@cardstack/navigation';
import {
  dismissBanner,
  useWelcomeBannerSelector,
} from '@cardstack/redux/welcomeBanner';
import { useGetEoaClaimedQuery } from '@cardstack/services/hub/hub-api';
import { isCardPayCompatible } from '@cardstack/utils';

import { useWallets, useAccountSettings } from '@rainbow-me/hooks';
import { logger } from '@rainbow-me/utils';

const EMAIL_POLLING_INTERVAL = 5000;

export const useWelcomeCtaBanner = () => {
  const { selectedAccount } = useWallets();
  const { accountAddress, network } = useAccountSettings();
  const [triggerPolling, setTriggerPolling] = useState(false);
  const { requestedCardDrop, dismissedByUser } = useWelcomeBannerSelector();
  const { configs } = useRemoteConfigs();
  const dispatch = useDispatch();

  const { data: emailDropGetData } = useGetEoaClaimedQuery(
    { eoa: accountAddress },
    {
      skip: !accountAddress,
      pollingInterval: triggerPolling ? EMAIL_POLLING_INTERVAL : undefined,
    }
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
      isCardPayCompatible(network) &&
      configs.featurePrepaidCardDrop &&
      !dismissedByUser &&
      isFirstAddressForCurrentWallet &&
      (emailDropGetData?.showBanner ?? false),
    [
      configs,
      dismissedByUser,
      isFirstAddressForCurrentWallet,
      network,
      emailDropGetData,
    ]
  );

  const handleClaimStatus = useCallback(async () => {
    try {
      // user didn't request to claim so there's nothing to do here
      if (!requestedCardDrop) {
        return;
      }

      // starts polling to get new status after user requested a card
      if (requestedCardDrop && !emailDropGetData?.claimed) {
        setTriggerPolling(true);

        return;
      }

      // status changed to claimed: true, disables polling
      if (requestedCardDrop && emailDropGetData?.claimed) {
        setTriggerPolling(false);

        return;
      }
    } catch (error) {
      logger.log('Error getting claimed status', error);
    }
  }, [requestedCardDrop, emailDropGetData]);

  // handles/enables polling only if banner is visible
  useEffect(() => {
    if (showBanner) {
      handleClaimStatus();
    }
  }, [handleClaimStatus, showBanner]);

  const onDismissBannerPress = useCallback(() => dispatch(dismissBanner()), [
    dispatch,
  ]);

  return {
    showBanner,
    onDismissBannerPress,
    onPress,
  };
};
