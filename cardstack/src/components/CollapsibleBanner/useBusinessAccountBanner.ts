import { useCallback, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SHOW_BUSINESS_ACCOUNT_BANNER_KEY,
  useWorker,
  isLayer2,
} from '@cardstack/utils';
import { useAccountSettings } from '@rainbow-me/hooks';

export const useBusinessAccountBanner = () => {
  const { network } = useAccountSettings();

  const [showBusinessAccountBanner, setShowBusinessAccountBanner] = useState(
    false
  );

  const { callback: getShowBanner } = useWorker(async () => {
    const flag =
      (await AsyncStorage.getItem(SHOW_BUSINESS_ACCOUNT_BANNER_KEY)) || 'true';

    setShowBusinessAccountBanner(JSON.parse(flag) && isLayer2(network));
  }, [network]);

  useEffect(() => {
    getShowBanner();
  }, [getShowBanner, network]);

  const { callback: hideBanner } = useWorker(async () => {
    await AsyncStorage.setItem(
      SHOW_BUSINESS_ACCOUNT_BANNER_KEY,
      JSON.stringify(false)
    );

    setShowBusinessAccountBanner(false);
  }, []);

  const closeBannerForever = useCallback(() => {
    hideBanner();
  }, [hideBanner]);

  return { closeBannerForever, showBusinessAccountBanner };
};
