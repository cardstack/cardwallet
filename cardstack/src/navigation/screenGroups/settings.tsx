import { HeaderBackButtonProps } from '@react-navigation/elements';
import { useNavigation, StackActions } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text, Touchable } from '@cardstack/components';
import { NAV_HEADER_HEIGHT } from '@cardstack/components/MainHeader/components/MainHeaderWrapper';
import {
  horizontalNonStackingInterpolator,
  slideLeftToRightPreset,
  Routes,
} from '@cardstack/navigation';
import {
  SecurityScreen,
  WalletConnectSessions,
  WalletAddressScreen,
  DesignSystemScreen,
} from '@cardstack/screens';
import { palette } from '@cardstack/theme';

import {
  CurrencySection,
  NetworkSection,
  NotificationsSection,
  WalletConnectLegacySessionsSection,
} from '@rainbow-me/components/settings-menu';
import DeveloperSettings from '@rainbow-me/components/settings-menu/DeveloperSettings';
import SettingsScreen from '@rainbow-me/screens/SettingsScreen';

import { StackType } from '../types';

const HeaderBackBtnLeft = (props?: HeaderBackButtonProps) => (
  <Icon
    {...props}
    color="teal"
    iconSize="large"
    name="chevron-left"
    paddingLeft={3}
  />
);

export const SettingsGroup = ({ Stack }: { Stack: StackType }) => {
  const { dispatch: navDispatch } = useNavigation();

  const renderHeaderRight = useCallback(
    () => (
      <Touchable
        marginRight={5}
        onPress={() => {
          navDispatch(StackActions.popToTop());
        }}
      >
        <Text color="settingsTeal" weight="bold">
          Done
        </Text>
      </Touchable>
    ),
    [navDispatch]
  );

  const insets = useSafeAreaInsets();

  return (
    <Stack.Group
      screenOptions={{
        ...slideLeftToRightPreset,
        detachPreviousScreen: false,
        gestureDirection: 'horizontal',
        headerStyle: {
          backgroundColor: palette.blueDark,
          height: NAV_HEADER_HEIGHT + insets.top,
        },
        headerTitleStyle: {
          color: 'white',
        },
        cardStyle: { backgroundColor: 'white' },
        headerTitleAlign: 'center',
        headerRight: renderHeaderRight,
        headerLeft: HeaderBackBtnLeft,
        headerShown: true,
      }}
    >
      <Stack.Screen
        name={Routes.SETTINGS_SCREEN}
        component={SettingsScreen}
        options={{
          headerTitle: 'Settings',
          headerLeft: () => null,
        }}
      />
      <Stack.Group screenOptions={{ ...horizontalNonStackingInterpolator }}>
        <Stack.Screen
          component={CurrencySection}
          name={Routes.CURRENCY_SECTION}
          options={{ title: 'Currency' }}
        />
        <Stack.Screen
          component={NetworkSection}
          name={Routes.NETWORK_SECTION}
          options={{ title: 'Network' }}
        />
        <Stack.Screen
          component={NotificationsSection}
          name={Routes.NOTIFICATIONS_SECTION}
          options={{ title: 'Notifications' }}
        />
        <Stack.Screen
          component={WalletConnectLegacySessionsSection}
          name={Routes.WC_LEGACY_SESSIONS_SECTION}
          options={{ title: 'Sessions v1' }}
        />
        <Stack.Screen
          component={WalletConnectSessions}
          name={Routes.WC_SESSIONS_SECTION}
          options={{ title: 'Sessions v2' }}
        />
        <Stack.Screen
          component={WalletAddressScreen}
          name={Routes.MY_WALLET_ADDRESS_SECTION}
          options={{ title: 'My Wallet Address' }}
        />
        <Stack.Screen
          component={SecurityScreen}
          name={Routes.SECURITY_SECTION}
          options={{ title: 'Security' }}
        />

        {__DEV__ && (
          <Stack.Screen
            component={DeveloperSettings}
            name={Routes.DEV_SECTION}
            options={{ title: 'Dev' }}
          />
        )}
        {__DEV__ && (
          <Stack.Screen
            component={DesignSystemScreen}
            name={Routes.DESIGN_SYSTEM}
            options={{ title: 'Design System' }}
          />
        )}
      </Stack.Group>
    </Stack.Group>
  );
};
