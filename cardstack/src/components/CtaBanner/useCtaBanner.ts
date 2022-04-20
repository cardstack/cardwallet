import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { SHOW_CTA_BANNER_KEY, useWorker } from '@cardstack/utils';

export const useCtaBanner = (bannerKey: string) => {
  const [showBanner, setShowBanner] = useState(true);

  const { callback: getShowCtaFlag } = useWorker(async () => {
    const flag =
      (await AsyncStorage.getItem(SHOW_CTA_BANNER_KEY + bannerKey)) || 'true';

    setShowBanner(JSON.parse(flag));
  }, []);

  useEffect(() => {
    getShowCtaFlag();
  }, [getShowCtaFlag]);

  const { callback: dismissBanner } = useWorker(async () => {
    await AsyncStorage.setItem(
      SHOW_CTA_BANNER_KEY + bannerKey,
      JSON.stringify(false)
    );

    setShowBanner(false);
  }, []);

  return { showBanner, dismissBanner };
};
