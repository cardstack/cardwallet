import {
  BottomTabBarOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarIcon } from '@cardstack/components';
import { getPin } from '@cardstack/models/secure-storage';
import { useAuthSelectorAndActions } from '@cardstack/redux/authSlice';
import {
  HomeScreen,
  WalletScreen,
  ProfileScreen,
  QRScannerScreen,
  WelcomeScreen,
  UnlockScreen,
  PinScreen,
  LoadingOverlayScreen,
  ImportSeedSheet,
} from '@cardstack/screens';
import { colors } from '@cardstack/theme';
import { Device, useWorker } from '@cardstack/utils';

import { useHideSplashScreen } from '@rainbow-me/hooks';
import { loadAddress } from '@rainbow-me/model/wallet';
import {
  bottomSheetPreset,
  expandedPreset,
} from '@rainbow-me/navigation/effects';
import ChangeWalletSheet from '@rainbow-me/screens/ChangeWalletSheet';
import ModalScreen from '@rainbow-me/screens/ModalScreen';
import PinAuthenticationScreen from '@rainbow-me/screens/PinAuthenticationScreen';
import RestoreSheet from '@rainbow-me/screens/RestoreSheet';

import { useCardstackMainScreens } from './hooks';

import {
  dismissAndroidKeyboardOnClose,
  horizontalInterpolator,
  NonAuthRoutes,
  overlayPreset,
  Routes,
} from '.';

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

const SharedScreens = (
  <>
    <Stack.Screen
      component={PinScreen}
      name={Routes.PIN_SCREEN}
      options={horizontalInterpolator}
    />
    <Stack.Screen
      component={LoadingOverlayScreen}
      name={Routes.LOADING_OVERLAY}
      options={{ ...overlayPreset, gestureEnabled: false }}
    />
    <Stack.Screen
      component={ImportSeedSheet}
      name={Routes.IMPORT_SEED_SHEET}
      options={bottomSheetPreset as StackNavigationOptions}
      listeners={dismissAndroidKeyboardOnClose}
    />

    <Stack.Screen
      component={ModalScreen}
      name={Routes.MODAL_SCREEN}
      options={expandedPreset as StackNavigationOptions}
      listeners={dismissAndroidKeyboardOnClose}
    />
    <Stack.Screen
      component={RestoreSheet}
      name={Routes.RESTORE_SHEET}
      options={expandedPreset as StackNavigationOptions}
      listeners={dismissAndroidKeyboardOnClose}
    />
  </>
);

const useNavigationAuth = () => {
  const isFirstMount = useRef(true);
  const hideSplashScreen = useHideSplashScreen();

  const { isAuthorized, hasWallet, setHasWallet } = useAuthSelectorAndActions();

  const [hasPin, setHasPin] = useState(true);

  const { callback: loadAuthInfo } = useWorker(async () => {
    const [address, storedPin] = await Promise.all([loadAddress(), getPin()]);

    address && setHasWallet();
    setHasPin(!!storedPin);

    if (isFirstMount.current) {
      setTimeout(hideSplashScreen, 500);
      isFirstMount.current = false;
    }
  }, []);

  useEffect(() => {
    if (!hasPin || isFirstMount.current) {
      loadAuthInfo();
    }
  }, [loadAuthInfo, hasPin, isAuthorized]);

  return { hasWallet, isAuthorized, hasPin };
};

const stackScreenOptios: StackNavigationOptions = {
  // On Android gestureEnabled defaults to false, but we want it.
  gestureEnabled: true,
  // On Android theres an issue with navigation trying to focus
  // unmounted inputs ocurring in crashes, disabling keyboard handling avoids it:
  // ref: https://github.com/react-navigation/react-navigation/issues/10080
  keyboardHandlingEnabled: Device.isIOS,
  presentation: 'modal',
  headerShown: false,
};

export const StackNavigator = () => {
  const cardstackMainScreens = useCardstackMainScreens(Stack);

  const { hasWallet, isAuthorized, hasPin } = useNavigationAuth();

  return (
    <Stack.Navigator screenOptions={stackScreenOptios}>
      {!hasWallet ? (
        <>
          <Stack.Screen
            component={WelcomeScreen}
            name={NonAuthRoutes.WELCOME_SCREEN}
          />
          {SharedScreens}
        </>
      ) : (
        <>
          {hasPin && !isAuthorized && (
            <Stack.Screen
              component={UnlockScreen}
              name={Routes.UNLOCK_SCREEN}
              options={{ gestureEnabled: false }}
            />
          )}
          <Stack.Screen component={TabNavigator} name={Routes.TAB_NAVIGATOR} />
          {cardstackMainScreens}
          {SharedScreens}
          {
            // Temp rainbow components until migration
          }
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
        </>
      )}
    </Stack.Navigator>
  );
};
