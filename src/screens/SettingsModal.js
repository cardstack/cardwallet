import { useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useCallback, useEffect } from 'react';
import { Animated, InteractionManager, View } from 'react-native';
import {
  CurrencySection,
  LanguageSection,
  NetworkSection,
  NotificationsSection,
  SettingsSection,
} from '../components/settings-menu';
import SettingsBackupView from '../components/settings-menu/BackupSection/SettingsBackupView';
import ShowSecretView from '../components/settings-menu/BackupSection/ShowSecretView';
import WalletSelectionView from '../components/settings-menu/BackupSection/WalletSelectionView';
import DeveloperSettings from '../components/settings-menu/DeveloperSettings';
import WalletTypes from '../helpers/walletTypes';
import { useWallets } from '../hooks';
import { Icon, Text, Touchable } from '@cardstack/components';
import { slideLeftToRightPreset } from '@cardstack/navigation';
import { palette } from '@cardstack/theme';
import { useNavigation } from '@rainbow-me/navigation';

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

const SettingsPages = {
  backup: {
    component: View,
    key: 'BackupSection',
    title: 'Backup',
  },
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
    component: IS_DEV ? DeveloperSettings : null,
    key: 'DevSection',
    title: 'Dev',
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
  const { wallets, selectedWallet } = useWallets();
  const { params } = useRoute();

  const getRealRoute = useCallback(
    key => {
      let route = key;
      let paramsToPass = {};
      if (key === SettingsPages.backup.key) {
        const walletId = params?.walletId;
        if (
          !walletId &&
          Object.keys(wallets).filter(
            key => wallets[key].type !== WalletTypes.readOnly
          ).length > 1
        ) {
          route = 'WalletSelectionView';
        } else {
          if (Object.keys(wallets).length === 1 && selectedWallet.imported) {
            paramsToPass.imported = true;
            paramsToPass.type = 'AlreadyBackedUpView';
          }
          route = 'SettingsBackupView';
        }
      }
      return { params: { ...params, ...paramsToPass }, route };
    },
    [params, selectedWallet.imported, wallets]
  );

  const onPressSection = useCallback(
    section => () => {
      const { params, route } = getRealRoute(section.key);
      navigate(route, params);
    },
    [getRealRoute, navigate]
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
      const { route, params: routeParams } = getRealRoute(params?.initialRoute);
      InteractionManager.runAfterInteractions(() => {
        navigate(route, routeParams);
      });
    }
  }, [getRealRoute, navigate, params]);

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
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
            onCloseModal={goBack}
            onPressBackup={onPressSection(SettingsPages.backup)}
            onPressCurrency={onPressSection(SettingsPages.currency)}
            onPressDev={onPressSection(SettingsPages.dev)}
            onPressLanguage={onPressSection(SettingsPages.language)}
            onPressNetwork={onPressSection(SettingsPages.network)}
            onPressNotifications={onPressSection(SettingsPages.notifications)}
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
