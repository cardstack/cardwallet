import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';

import { SettingsSection } from '../components/settings-menu';

import { SettingsPages } from '@cardstack/navigation/screenGroups/settings';

export default function SettingsModal() {
  const { navigate } = useNavigation();
  const { params } = useRoute();

  const onPressSection = useCallback(
    section => () => {
      navigate(section.key, params);
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
      onPressCurrency={onPressSection(SettingsPages.currency)}
      onPressDS={onPressSection(SettingsPages.designSystem)}
      onPressDev={onPressSection(SettingsPages.dev)}
      onPressLanguage={onPressSection(SettingsPages.language)}
      onPressMyWalletAddress={onPressSection(SettingsPages.myWalletAddress)}
      onPressNetwork={onPressSection(SettingsPages.network)}
      onPressNotifications={onPressSection(SettingsPages.notifications)}
      onPressSecurity={onPressSection(SettingsPages.security)}
      onPressWCSessions={onPressSection(SettingsPages.walletconnect)}
    />
  );
}
