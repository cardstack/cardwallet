import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { StackNavigationOptions } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';

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
  SeedPhraseBackup,
  ToastOverlayScreen,
} from '@cardstack/screens';
import { colors } from '@cardstack/theme';
import { Device, useWorker } from '@cardstack/utils';

import { useHideSplashScreen } from '@rainbow-me/hooks';
import { loadAddress } from '@rainbow-me/model/wallet';
import ChangeWalletSheet from '@rainbow-me/screens/ChangeWalletSheet';
import ModalScreen from '@rainbow-me/screens/ModalScreen';
import PinAuthenticationScreen from '@rainbow-me/screens/PinAuthenticationScreen';
import RestoreSheet from '@rainbow-me/screens/RestoreSheet';

import { createCustomStackNavigator } from './customNavigator';
import { useCardstackMainScreens } from './hooks';
import { ProfileScreenGroup, BackupScreenGroup } from './screenGroups';

import {
  dismissAndroidKeyboardOnClose,
  horizontalInterpolator,
  NonAuthRoutes,
  overlayPreset,
  Routes,
  sheetPreset,
} from '.';

const Tab = createBottomTabNavigator();

const tabBarOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarStyle: {
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
  tabBarShowLabel: false,
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={Routes.WALLET_SCREEN}
      screenOptions={tabBarOptions}
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

const Stack = createCustomStackNavigator();

const SharedScreens = ({ navigationKey }: { navigationKey: string }) => (
  <Stack.Group navigationKey={navigationKey}>
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
      component={ToastOverlayScreen}
      name={Routes.MESSAGE_OVERLAY}
      options={sheetPreset({ backgroundOpacity: 'half' })}
    />
    <Stack.Screen
      component={SeedPhraseBackup}
      name={Routes.SEED_PHRASE_BACKUP}
      options={{ ...horizontalInterpolator, gestureEnabled: false }}
    />
    <Stack.Screen
      component={ImportSeedSheet}
      name={Routes.IMPORT_SEED_SHEET}
      options={sheetPreset({ bounce: false })}
      listeners={dismissAndroidKeyboardOnClose}
    />

    <Stack.Screen
      component={ModalScreen}
      name={Routes.MODAL_SCREEN}
      options={sheetPreset({ backgroundOpacity: 'half' })}
      listeners={dismissAndroidKeyboardOnClose}
    />
    <Stack.Screen
      component={RestoreSheet}
      name={Routes.RESTORE_SHEET}
      options={sheetPreset({ backgroundOpacity: 'half' })}
      listeners={dismissAndroidKeyboardOnClose}
    />
  </Stack.Group>
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

const stackScreenOptions: StackNavigationOptions = {
  // On Android gestureEnabled defaults to false, but we want it.
  gestureEnabled: true,
  // On Android theres an issue with navigation trying to focus
  // unmounted inputs ocurring in crashes, disabling keyboard handling avoids it:
  // ref: https://github.com/react-navigation/react-navigation/issues/10080
  keyboardHandlingEnabled: Device.isIOS,
  presentation: 'transparentModal',
  headerShown: false,
};

export const StackNavigator = () => {
  const cardstackMainScreens = useCardstackMainScreens(Stack);

  const { hasWallet, isAuthorized, hasPin } = useNavigationAuth();

  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      {!hasWallet ? (
        <Stack.Screen
          component={WelcomeScreen}
          name={NonAuthRoutes.WELCOME_SCREEN}
        />
      ) : (
        <>
          {hasPin && !isAuthorized && (
            <Stack.Screen
              component={UnlockScreen}
              name={Routes.UNLOCK_SCREEN}
              options={{ gestureEnabled: false }}
            />
          )}
          <Stack.Screen
            component={TabNavigator}
            name={Routes.TAB_NAVIGATOR}
            options={{ gestureEnabled: false }}
          />
          {cardstackMainScreens}
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
            options={sheetPreset({ backgroundOpacity: 'half' })}
          />
        </>
      )}
      {SharedScreens({ navigationKey: !hasWallet ? 'non-auth' : 'auth' })}
      {ProfileScreenGroup({ Stack })}
      {BackupScreenGroup({ Stack })}
    </Stack.Navigator>
  );
};
