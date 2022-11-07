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
import { SecurityScreen } from '@cardstack/screens';
import DesignSystemScreen from '@cardstack/screens/Dev/DesignSystemScreen';
import WalletAddressScreen from '@cardstack/screens/WalletAddressScreen/WalletAddressScreen';
import { palette } from '@cardstack/theme';

import {
  CurrencySection,
  LanguageSection,
  NetworkSection,
  NotificationsSection,
  WalletConnectSessionsSection,
} from '@rainbow-me/components/settings-menu';
import DeveloperSettings from '@rainbow-me/components/settings-menu/DeveloperSettings';
import SettingsModal from '@rainbow-me/screens/SettingsModal';

import { StackType } from '../types';

export const SettingsPages = {
  currency: {
    component: CurrencySection,
    key: 'CurrencySection',
    title: 'Currency',
  },
  default: {
    component: null,
    key: 'SettingsSection',
    title: 'Settings',
  },
  dev: {
    component: __DEV__ ? DeveloperSettings : null,
    key: 'DevSection',
    title: 'Dev',
  },
  designSystem: {
    component: __DEV__ ? DesignSystemScreen : null,
    key: 'DesignSystem',
    title: 'Design System',
  },
  language: {
    component: LanguageSection,
    key: 'LanguageSection',
    title: 'Language',
  },
  network: {
    component: NetworkSection,
    key: 'NetworkSection',
    title: 'Network',
  },
  notifications: {
    component: NotificationsSection,
    key: 'NotificationsSection',
    title: 'Notifications',
  },
  walletconnect: {
    component: WalletConnectSessionsSection,
    key: 'WCSessionsSection',
    title: 'WalletConnect Sessions',
  },
  myWalletAddress: {
    component: WalletAddressScreen,
    key: 'MyWalletAddressSection',
    title: 'My Wallet Address',
  },
  security: {
    component: SecurityScreen,
    key: 'security',
    title: 'Security',
  },
};

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
        name={Routes.SETTINGS_MODAL}
        component={SettingsModal}
        options={{
          headerTitle: 'Settings',
          headerLeft: () => null,
        }}
      />
      {Object.values(SettingsPages).map(
        ({ component, title, key }) =>
          component && (
            <Stack.Screen
              component={component}
              name={key}
              options={{
                ...horizontalNonStackingInterpolator,
                title,
              }}
            />
          )
      )}
    </Stack.Group>
  );
};
