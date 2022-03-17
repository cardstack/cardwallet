import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { InitialRouteContext } from '../../../src/context/initialRoute';
import { useCardstackGlobalScreens, useCardstackMainScreens } from './hooks';
import { linking } from './screens';
import { dismissAndroidKeyboardOnClose, tabLinking } from '.';
import {
  HomeScreen,
  WalletScreen,
  ProfileScreen,
  QRScannerScreen,
} from '@cardstack/screens';
import RainbowRoutes from '@rainbow-me/navigation/routesNames';

import { TabBarIcon } from '@cardstack/components';
import { colors } from '@cardstack/theme';
import { Device, screenHeight } from '@cardstack/utils';
import ExpandedAssetSheet from '@rainbow-me/screens/ExpandedAssetSheet';
import ModalScreen from '@rainbow-me/screens/ModalScreen';
import RestoreSheet from '@rainbow-me/screens/RestoreSheet';
import { expandedPreset, sheetPreset } from '@rainbow-me/navigation/effects';
import { onNavigationStateChange } from '@rainbow-me/navigation/onNavigationStateChange';
import { navigationRef } from '@rainbow-me/navigation/Navigation';

const Tab = createBottomTabNavigator();

const layouts = {
  tabBarHeightSize: screenHeight * 0.1,
};

const tabBarOptions = {
  style: {
    backgroundColor: colors.backgroundBlue,
    height: layouts.tabBarHeightSize,
    borderTopColor: Device.isIOS ? 'transparent' : colors.blackLightOpacity,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    elevation: 3,
  },
  showLabel: false,
  keyboardHidesTabBar: true,
};

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName={RainbowRoutes.WALLET_SCREEN}
    tabBarOptions={tabBarOptions}
  >
    <Tab.Screen
      component={HomeScreen}
      name={RainbowRoutes.HOME_SCREEN}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabBarIcon iconName="home" label="HOME" focused={focused} />
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
          <TabBarIcon iconName="dollar-sign" label="SCAN" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

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
      headerMode="none"
      mode="modal"
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
  const [isTabBarEnabled, setIsTabBarEnabled] = useState(__DEV__);

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
