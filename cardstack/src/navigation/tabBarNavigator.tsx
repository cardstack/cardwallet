import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { InitialRouteContext } from '../../../src/context/initialRoute';
import RainbowRoutes from '@rainbow-me/navigation/routesNames';

import { WelcomeScreen } from '@cardstack/screen';
import ProfileScreen from '@rainbow-me/screens/ProfileScreen';
import QRScannerScreen from '@rainbow-me/screens/QRScannerScreen';
import WalletScreen from '@rainbow-me/screens/WalletScreen';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator initialRouteName="Wallet">
    <Tab.Screen component={ProfileScreen} name="Activities" />
    <Tab.Screen component={QRScannerScreen} name="Scan" />
    <Tab.Screen component={WalletScreen} name="Wallet" />
  </Tab.Navigator>
);

const StackNavigator = () => {
  const initialRoute = useContext(InitialRouteContext) || '';

  return (
    <Stack.Navigator initialRouteName={initialRoute} headerMode="none">
      <Stack.Screen
        component={TabNavigator}
        name={RainbowRoutes.SWIPE_LAYOUT}
      />
      <Stack.Screen
        component={WelcomeScreen}
        name={RainbowRoutes.WELCOME_SCREEN}
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

export const TabBarFeatureProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
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
