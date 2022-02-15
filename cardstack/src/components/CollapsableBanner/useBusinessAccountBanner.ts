import { useCallback, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SHOW_BUSINESS_ACCOUNT_BANNER_KEY, useWorker } from '@cardstack/utils';

export const useBusinessAccountBanner = () => {
  const [showBusinessAccountBanner, setShowBusinessAccountBanner] = useState(
    false
  );

  const { callback: getShowBanner } = useWorker(async () => {
    const flag =
      (await AsyncStorage.getItem(SHOW_BUSINESS_ACCOUNT_BANNER_KEY)) || 'true';

    setShowBusinessAccountBanner(JSON.parse(flag));
  }, []);

  useEffect(() => {
    getShowBanner();
  }, [getShowBanner]);

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
