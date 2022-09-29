import { useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useCallback, useEffect } from 'react';
import { Animated, InteractionManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CurrencySection,
  LanguageSection,
  NetworkSection,
  NotificationsSection,
  SettingsSection,
  WalletConnectSessionsSection,
} from '../components/settings-menu';
import SettingsBackupView from '../components/settings-menu/BackupSection/SettingsBackupView';
import ShowSecretView from '../components/settings-menu/BackupSection/ShowSecretView';
import WalletSelectionView from '../components/settings-menu/BackupSection/WalletSelectionView';
import DeveloperSettings from '../components/settings-menu/DeveloperSettings';
import { Icon, Text, Touchable } from '@cardstack/components';
import { NAV_HEADER_HEIGHT } from '@cardstack/components/MainHeader/components/MainHeaderWrapper';
import { slideLeftToRightPreset } from '@cardstack/navigation';
import { SecurityScreen } from '@cardstack/screens';
import DesignSystemScreen from '@cardstack/screens/Dev/DesignSystemScreen';
import WalletAddressScreen from '@cardstack/screens/WalletAddressScreen/WalletAddressScreen';
import { palette } from '@cardstack/theme';

function cardStyleInterpolator({
  current,
  next,
  inverted,
  layouts: { screen },
}) {
  const translateFocused = Animated.multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.width, 0],
    }),
    inverted
  );
  const translateUnfocused = next
    ? Animated.multiply(
        next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -screen.width],
        }),
        inverted
      )
    : 0;

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.add(translateFocused, translateUnfocused),
        },
      ],
    },
  };
}

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

const Stack = createStackNavigator();

const screenOptions = {
  ...slideLeftToRightPreset,
  headerStyle: {
    backgroundColor: palette.blueDark,
  },
  headerTitleStyle: {
    color: 'white',
  },
  cardStyle: { backgroundColor: 'white' },
  headerTitleAlign: 'center',
};

const HeaderBackBtnLeft = props => (
  <Icon
    {...props}
    color="teal"
    iconSize="large"
    name="chevron-left"
    paddingLeft={3}
  />
);

export default function SettingsModal() {
  const { goBack, navigate } = useNavigation();
  const { params } = useRoute();

  const onPressSection = useCallback(
    section => () => {
      navigate(section.key, params);
    },
    [navigate, params]
  );

  const renderHeaderRight = useCallback(
    () => (
      <Touchable marginRight={5} onPress={goBack}>
        <Text color="settingsTeal" weight="bold">
          Done
        </Text>
      </Touchable>
    ),
    [goBack]
  );

  useEffect(() => {
    if (params?.initialRoute) {
      InteractionManager.runAfterInteractions(() => {
        navigate(params?.initialRoute, params);
      });
    }
  }, [navigate, params]);

  const insets = useSafeAreaInsets();

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerStyle: {
          ...screenOptions.headerStyle,
          height: NAV_HEADER_HEIGHT + insets.top,
        },
        headerRight: renderHeaderRight,
        headerLeft: HeaderBackBtnLeft,
      }}
    >
      <Stack.Screen
        name="SettingsSection"
        options={{
          headerTitle: 'Settings',
          headerLeft: null,
        }}
      >
        {() => (
          <SettingsSection
            onPressCurrency={onPressSection(SettingsPages.currency)}
            onPressDS={onPressSection(SettingsPages.designSystem)}
            onPressDev={onPressSection(SettingsPages.dev)}
            onPressLanguage={onPressSection(SettingsPages.language)}
            onPressMyWalletAddress={onPressSection(
              SettingsPages.myWalletAddress
            )}
            onPressNetwork={onPressSection(SettingsPages.network)}
            onPressNotifications={onPressSection(SettingsPages.notifications)}
            onPressSecurity={onPressSection(SettingsPages.security)}
            onPressWCSessions={onPressSection(SettingsPages.walletconnect)}
          />
        )}
      </Stack.Screen>
      {Object.values(SettingsPages).map(
        ({ component, title, key }) =>
          component && (
            <Stack.Screen
              component={component}
              key={key}
              name={key}
              options={{
                cardStyleInterpolator,
                title,
              }}
              title={title}
            />
          )
      )}

      <Stack.Screen
        component={WalletSelectionView}
        name="WalletSelectionView"
        options={{
          cardStyleInterpolator,
          headerTitle: 'Backup',
        }}
      />
      <Stack.Screen
        component={SettingsBackupView}
        name="SettingsBackupView"
        options={({ route }) => ({
          cardStyleInterpolator,
          title: route.params?.title || 'Backup',
        })}
      />
      <Stack.Screen
        component={ShowSecretView}
        name="ShowSecretView"
        options={({ route }) => ({
          cardStyleInterpolator,
          title: route.params?.title || 'Backup',
        })}
      />
    </Stack.Navigator>
  );
}
