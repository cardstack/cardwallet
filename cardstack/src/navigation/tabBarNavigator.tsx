import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { InitialRouteContext } from '../../../src/context/initialRoute';
import { useCardstackGlobalScreens, useCardstackMainScreens } from './hooks';
import { HomeScreen } from '@cardstack/screens';
import RainbowRoutes from '@rainbow-me/navigation/routesNames';

import QRScannerScreen from '@rainbow-me/screens/QRScannerScreen';
import WalletScreen from '@rainbow-me/screens/WalletScreen';
import { TabBarIcon } from '@cardstack/components';
import { colors } from '@cardstack/theme';
import { Device, screenHeight } from '@cardstack/utils';

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
};

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName={RainbowRoutes.WALLET_SCREEN}
    tabBarOptions={tabBarOptions}
  >
    <Tab.Screen
      component={HomeScreen}
      name={RainbowRoutes.PROFILE_SCREEN}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabBarIcon iconName="home" label="HOME" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      component={QRScannerScreen}
      name={RainbowRoutes.QR_SCANNER_SCREEN}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabBarIcon iconName="qr-code" label="SCAN" focused={focused} />
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
  </Tab.Navigator>
);

const Stack = createStackNavigator();

const StackNavigator = () => {
  const initialRoute = useContext(InitialRouteContext) || '';

  const cardstackMainScreens = useCardstackMainScreens(Stack);
  const cardstackGlobalScreens = useCardstackGlobalScreens(Stack);

  // TODO: Create a navigator for each flow and split auth/non-auth

  // Remove last item aka LoadingOverlay, to avoid dupe
  cardstackGlobalScreens.pop();

  return (
    <Stack.Navigator headerMode="none" initialRouteName={initialRoute}>
      <Stack.Screen
        component={TabNavigator}
        name={RainbowRoutes.SWIPE_LAYOUT}
      />
      {cardstackMainScreens}
      {cardstackGlobalScreens}
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
  const [isTabBarEnabled, setIsTabBarEnabled] = useState(false);

  const contextValues = useMemo(
    () => ({
      isTabBarEnabled,
      setIsTabBarEnabled,
    }),
    [isTabBarEnabled]
  );

  return (
    <TabBarFeatureContext.Provider value={contextValues}>
      {isTabBarEnabled ? <StackNavigator /> : children}
    </TabBarFeatureContext.Provider>
  );
};

export const useTabBarFlag = () => useContext(TabBarFeatureContext);
