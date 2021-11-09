import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { SettingsExternalURLs } from '@cardstack/constants';
import { SHOW_PROMO_BANNER_KEY, useWorker } from '@cardstack/utils';

export const useDiscordPromoBanner = () => {
  const [showPromoBanner, setShowPromoBanner] = useState(true);

  const { callback: getShowPromoCodeFlag } = useWorker(async () => {
    const flag = (await AsyncStorage.getItem(SHOW_PROMO_BANNER_KEY)) || 'true';

    setShowPromoBanner(JSON.parse(flag));
  }, []);

  useEffect(() => {
    getShowPromoCodeFlag();
  }, [getShowPromoCodeFlag]);

  const { callback: hideBanner } = useWorker(async () => {
    await AsyncStorage.setItem(SHOW_PROMO_BANNER_KEY, JSON.stringify(false));
    setShowPromoBanner(false);
  }, []);

  const onPress = useCallback(() => {
    Linking.openURL(SettingsExternalURLs.discordInviteLink);
    hideBanner();
  }, [hideBanner]);

  return { onPress, showPromoBanner };
};
