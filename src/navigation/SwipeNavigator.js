import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { FlexItem } from '../components/layout';
import { NetworkToast } from '../components/toasts';
import { useAccountSettings, useCoinListEdited } from '../hooks';
import ProfileScreen from '../screens/ProfileScreen';
import WalletScreen from '../screens/WalletScreen';
import { deviceUtils } from '../utils';
import Navigation from './Navigation';
import Routes from './routesNames';
import { QRScannerScreen } from '@cardstack/screens';

const Swipe = createMaterialTopTabNavigator();

const renderTabBar = () => null;

export function SwipeNavigator() {
  const { isCoinListEdited } = useCoinListEdited();
  const { network } = useAccountSettings();

  const isOnScanPage =
    Navigation.getActiveRouteName() === Routes.QR_SCANNER_SCREEN;

  return (
    <FlexItem>
      <Swipe.Navigator
        initialLayout={deviceUtils.dimensions}
        initialRouteName={Routes.WALLET_SCREEN}
        swipeEnabled={!isCoinListEdited}
        tabBar={renderTabBar}
      >
        <Swipe.Screen component={ProfileScreen} name={Routes.HOME_SCREEN} />
        <Swipe.Screen component={WalletScreen} name={Routes.WALLET_SCREEN} />
        <Swipe.Screen
          component={QRScannerScreen}
          name={Routes.QR_SCANNER_SCREEN}
        />
      </Swipe.Navigator>
      {!isOnScanPage && <NetworkToast network={network} />}
    </FlexItem>
  );
}
