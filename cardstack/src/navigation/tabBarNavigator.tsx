import {
  BottomTabBarOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
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

import { navigationRef } from '@rainbow-me/navigation/Navigation';
import { expandedPreset, sheetPreset } from '@rainbow-me/navigation/effects';
import { onNavigationStateChange } from '@rainbow-me/navigation/onNavigationStateChange';
import RainbowRoutes from '@rainbow-me/navigation/routesNames';
import ChangeWalletSheet from '@rainbow-me/screens/ChangeWalletSheet';
import ExpandedAssetSheet from '@rainbow-me/screens/ExpandedAssetSheet';
import ModalScreen from '@rainbow-me/screens/ModalScreen';
import PinAuthenticationScreen from '@rainbow-me/screens/PinAuthenticationScreen';
import RestoreSheet from '@rainbow-me/screens/RestoreSheet';

import { InitialRouteContext } from '../../../src/context/initialRoute';

import { useCardstackGlobalScreens, useCardstackMainScreens } from './hooks';
import { linking } from './screens';

import { dismissAndroidKeyboardOnClose, tabLinking } from '.';

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
      initialRouteName={RainbowRoutes.WALLET_SCREEN}
      tabBarOptions={tabBarOptions(bottom)}
    >
      <Tab.Screen
        component={HomeScreen}
        name={RainbowRoutes.HOME_SCREEN}
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
        name={RainbowRoutes.PROFILE_SCREEN}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon iconName="user" label="PROFILE" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        component={WalletScreen}
        name={RainbowRoutes.WALLET_SCREEN}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon iconName="wallet" label="WALLET" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        component={QRScannerScreen}
        name={RainbowRoutes.QR_SCANNER_SCREEN}
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

const StackNavigator = () => {
  const initialRoute = useContext(InitialRouteContext) || '';

  const cardstackMainScreens = useCardstackMainScreens(Stack);
  const cardstackGlobalScreens = useCardstackGlobalScreens(Stack);

  // TODO: Create a navigator for each flow and split auth/non-auth

  // Remove last item aka LoadingOverlay, to avoid dupe (on iOS)
  Device.isIOS && cardstackGlobalScreens.pop();

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
      <Stack.Screen
        component={TabNavigator}
        name={RainbowRoutes.SWIPE_LAYOUT}
      />
      {cardstackMainScreens}
      {cardstackGlobalScreens}

      {
        // Temp rainbow components until migration
      }
      <Stack.Screen
        component={ExpandedAssetSheet}
        listeners={dismissAndroidKeyboardOnClose}
        name={RainbowRoutes.EXPANDED_ASSET_SHEET}
        options={expandedPreset as StackNavigationOptions}
      />
      <Stack.Screen
        component={ExpandedAssetSheet}
        listeners={dismissAndroidKeyboardOnClose}
        name={RainbowRoutes.EXPANDED_ASSET_SHEET_DRILL}
        options={sheetPreset as StackNavigationOptions}
      />
      <Stack.Screen
        component={ModalScreen}
        listeners={dismissAndroidKeyboardOnClose}
        name={RainbowRoutes.MODAL_SCREEN}
        options={expandedPreset as StackNavigationOptions}
      />
      <Stack.Screen
        component={RestoreSheet}
        listeners={dismissAndroidKeyboardOnClose}
        name={RainbowRoutes.RESTORE_SHEET}
        options={expandedPreset as StackNavigationOptions}
      />
      <Stack.Screen
        component={PinAuthenticationScreen}
        name={RainbowRoutes.PIN_AUTHENTICATION_SCREEN}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        component={ChangeWalletSheet}
        name={RainbowRoutes.CHANGE_WALLET_SHEET}
        options={expandedPreset as StackNavigationOptions}
      />
    </Stack.Navigator>
  );
};

// Temp feature flag context
interface TabBarContextType {
  isTabBarEnabled: boolean;
  setIsTabBarEnabled: Dispatch<SetStateAction<boolean>>;
}

const TabBarFeatureContext = createContext<TabBarContextType>({
  isTabBarEnabled: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsTabBarEnabled: () => {},
});

export const TabBarFeatureProvider: React.FC = ({ children }) => {
  const [isTabBarEnabled, setIsTabBarEnabled] = useState(true);

  const contextValues = useMemo(
    () => ({
      isTabBarEnabled,
      setIsTabBarEnabled,
    }),
    [isTabBarEnabled]
  );

  return (
    <NavigationContainer
      linking={isTabBarEnabled ? tabLinking : linking}
      onStateChange={onNavigationStateChange}
      ref={navigationRef}
    >
      <TabBarFeatureContext.Provider value={contextValues}>
        {isTabBarEnabled ? <StackNavigator /> : children}
      </TabBarFeatureContext.Provider>
    </NavigationContainer>
  );
};

export const useTabBarFlag = () => useContext(TabBarFeatureContext);
