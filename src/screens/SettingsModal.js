import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';

import { SettingsSection } from '../components/settings-menu';

import { Routes } from '@cardstack/navigation';

export default function SettingsModal() {
  const { navigate } = useNavigation();
  const { params } = useRoute();

  const onPressSection = useCallback(
    section => () => {
      navigate(section, params);
    },
    [navigate, params]
  );

  useEffect(() => {
    if (params?.initialRoute) {
      navigate(params?.initialRoute, params);
    }
  }, [navigate, params]);

  return (
    <SettingsSection
      onPressCurrency={onPressSection(Routes.CURRENCY_SECTION)}
      onPressDS={onPressSection(Routes.DESIGN_SYSTEM)}
      onPressDev={onPressSection(Routes.DEV_SECTION)}
      onPressMyWalletAddress={onPressSection(Routes.MY_WALLET_ADDRESS_SECTION)}
      onPressNetwork={onPressSection(Routes.NETWORK_SECTION)}
      onPressNotifications={onPressSection(Routes.NOTIFICATIONS_SECTION)}
      onPressSecurity={onPressSection(Routes.SECURITY_SECTION)}
      onPressWCSessions={onPressSection(Routes.WCSESSIONS_SECTION)}
    />
  );
}
