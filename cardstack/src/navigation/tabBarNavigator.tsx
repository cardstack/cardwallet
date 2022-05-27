import {
  BottomTabBarOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React, { useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarIcon } from '@cardstack/components';
import {
  HomeScreen,
  WalletScreen,
  ProfileScreen,
  QRScannerScreen,
} from '@cardstack/screens';
import { colors } from '@cardstack/theme';
import { Device } from '@cardstack/utils';

import { expandedPreset } from '@rainbow-me/navigation/effects';
import ChangeWalletSheet from '@rainbow-me/screens/ChangeWalletSheet';
import ModalScreen from '@rainbow-me/screens/ModalScreen';
import PinAuthenticationScreen from '@rainbow-me/screens/PinAuthenticationScreen';
import RestoreSheet from '@rainbow-me/screens/RestoreSheet';

import { InitialRouteContext } from '../../../src/context/initialRoute';

import { useCardstackMainScreens } from './hooks';

import { dismissAndroidKeyboardOnClose, Routes } from '.';

const Tab = createBottomTabNavigator();

const tabBarOptions = (bottomInset = 0): BottomTabBarOptions => ({
  style: {
    backgroundColor: colors.backgroundBlue,
    minHeight: 70,
    borderTopColor: Device.isIOS ? 'transparent' : colors.blackLightOpacity,
    shadowOffset: {
      width: 0,
      height: 1,
    },

    shadowRadius: 5,
    shadowOpacity: 0.35,
    elevation: 9,
  },
  safeAreaInsets: {
    bottom: bottomInset + 5,
  },
  showLabel: false,
  keyboardHidesTabBar: Device.isAndroid, // fix for TabBar shows above Android keyboard, but this option makes iOS flickering when keyboard toggles
});

const TabNavigator = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName={Routes.WALLET_SCREEN}
      tabBarOptions={tabBarOptions(bottom)}
    >
      <Tab.Screen
        component={HomeScreen}
        name={Routes.HOME_SCREEN}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              iconName="activity"
              label="ACTIVITY"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        component={ProfileScreen}
        name={Routes.PROFILE_SCREEN}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon iconName="user" label="PROFILE" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        component={WalletScreen}
        name={Routes.WALLET_SCREEN}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon iconName="wallet" label="WALLET" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        component={QRScannerScreen}
        name={Routes.QR_SCANNER_SCREEN}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon iconName="qr-code" label="PAY" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();

export const StackNavigator = () => {
  const initialRoute = useContext(InitialRouteContext) || '';

  const cardstackMainScreens = useCardstackMainScreens(Stack);

  // TODO: Create a navigator for each flow and split auth/non-auth

  return (
    <Stack.Navigator
      // On Android theres an issue with navigation trying to focus
      // unmounted inputs ocurring in crashes, disabling keyboard handling avoids it:
      // ref: https://github.com/react-navigation/react-navigation/issues/10080
      keyboardHandlingEnabled={Device.isIOS}
      headerMode="none"
      mode="modal"
      // On Android gestureEnabled defaults to false, but we want it.
      screenOptions={{ gestureEnabled: true }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen component={TabNavigator} name={Routes.TAB_NAVIGATOR} />
      {cardstackMainScreens}
      {
        // Temp rainbow components until migration
      }
      <Stack.Screen
        component={ModalScreen}
        listeners={dismissAndroidKeyboardOnClose}
        name={Routes.MODAL_SCREEN}
        options={expandedPreset as StackNavigationOptions}
      />
      <Stack.Screen
        component={RestoreSheet}
        listeners={dismissAndroidKeyboardOnClose}
        name={Routes.RESTORE_SHEET}
        options={expandedPreset as StackNavigationOptions}
      />
      <Stack.Screen
        component={PinAuthenticationScreen}
        name={Routes.PIN_AUTHENTICATION_SCREEN}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        component={ChangeWalletSheet}
        name={Routes.CHANGE_WALLET_SHEET}
        options={expandedPreset as StackNavigationOptions}
      />
    </Stack.Navigator>
  );
};
