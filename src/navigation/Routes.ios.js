import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';

import { InitialRouteContext } from '../context/initialRoute';
import AddCashSheet from '../screens/AddCashSheet';
import ChangeWalletSheet from '../screens/ChangeWalletSheet';
import DepositModal from '../screens/DepositModal';
import ExpandedAssetSheet from '../screens/ExpandedAssetSheet';
import ModalScreen from '../screens/ModalScreen';
import RestoreSheet from '../screens/RestoreSheet';
import SavingsSheet from '../screens/SavingsSheet';
import SpeedUpAndCancelSheet from '../screens/SpeedUpAndCancelSheet';
import WithdrawModal from '../screens/WithdrawModal';
import ExchangeModalNavigator from './ExchangeModalNavigator';
import { SwipeNavigator } from './SwipeNavigator';
import {
  defaultScreenStackOptions,
  nativeStackDefaultConfig,
  nativeStackDefaultConfigWithoutStatusBar,
  savingsSheetConfig,
  stackNavigationConfig,
} from './config';
import {
  bottomSheetPreset,
  exchangePreset,
  expandedPreset,
  overlayExpandedPreset,
  sheetPreset,
} from './effects';
import { nativeStackConfig } from './nativeStackConfig';
import Routes from './routesNames';
import {
  useCardstackGlobalScreens,
  useCardstackMainScreens,
} from '@cardstack/navigation';
import createNativeStackNavigator from 'react-native-cool-modals/createNativeStackNavigator';

const Stack = createStackNavigator();
const NativeStack = createNativeStackNavigator();

function MainNavigator() {
  const initialRoute = useContext(InitialRouteContext);
  const cardstackMainScreens = useCardstackMainScreens(Stack);

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      {...stackNavigationConfig}
      screenOptions={defaultScreenStackOptions}
    >
      <Stack.Screen component={SwipeNavigator} name={Routes.SWIPE_LAYOUT} />
      {cardstackMainScreens}
    </Stack.Navigator>
  );
}

function NativeStackFallbackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={Routes.MAIN_NAVIGATOR}
      {...stackNavigationConfig}
      screenOptions={defaultScreenStackOptions}
    >
      <Stack.Screen component={MainNavigator} name={Routes.MAIN_NAVIGATOR} />
      <Stack.Screen
        component={RestoreSheet}
        name={Routes.RESTORE_SHEET}
        options={bottomSheetPreset}
      />
      <Stack.Screen
        component={AddCashSheet}
        name={Routes.ADD_CASH_SHEET}
        options={sheetPreset}
      />
      <Stack.Screen
        component={ModalScreen}
        name={Routes.MODAL_SCREEN}
        options={overlayExpandedPreset}
      />
      <Stack.Screen
        component={ModalScreen}
        name={Routes.SUPPORTED_COUNTRIES_MODAL_SCREEN}
        options={overlayExpandedPreset}
      />
      <Stack.Screen
        component={ExchangeModalNavigator}
        name={Routes.EXCHANGE_MODAL}
        options={exchangePreset}
      />
      <Stack.Screen
        component={ExpandedAssetSheet}
        name={Routes.EXPANDED_ASSET_SHEET}
        options={expandedPreset}
      />
      <Stack.Screen
        component={ExpandedAssetSheet}
        name={Routes.EXPANDED_ASSET_SHEET_DRILL}
        options={expandedPreset}
      />
    </Stack.Navigator>
  );
}

function NativeStackNavigator() {
  const cardstackGlobalScreens = useCardstackGlobalScreens(NativeStack);

  return (
    <NativeStack.Navigator {...nativeStackConfig}>
      <NativeStack.Screen
        component={NativeStackFallbackNavigator}
        name={Routes.STACK}
      />
      <NativeStack.Screen
        component={ExchangeModalNavigator}
        name={Routes.EXCHANGE_MODAL}
        options={{ ...nativeStackDefaultConfig, interactWithScrollView: false }}
      />
      <NativeStack.Screen
        component={SpeedUpAndCancelSheet}
        name={Routes.SPEED_UP_AND_CANCEL_SHEET}
        options={{
          allowsDragToDismiss: true,
          backgroundColor: '#25292E',
          backgroundOpacity: 0.6,
          customStack: true,
          headerHeight: 0,
          isShortFormEnabled: false,
          topOffset: 0,
        }}
      />
      <NativeStack.Screen
        component={ChangeWalletSheet}
        name={Routes.CHANGE_WALLET_SHEET}
        options={{
          allowsDragToDismiss: true,
          backgroundColor: '#25292E',
          backgroundOpacity: 0.7,
          customStack: true,
          springDamping: 1,
          transitionDuration: 0.25,
        }}
      />
      <NativeStack.Screen
        component={ModalScreen}
        name={Routes.MODAL_SCREEN}
        options={{
          customStack: true,
          ignoreBottomOffset: true,
          onAppear: null,
          topOffset: 0,
        }}
      />
      <NativeStack.Screen
        component={SavingsSheet}
        name={Routes.SAVINGS_SHEET}
        {...savingsSheetConfig}
      />
      <NativeStack.Screen
        component={WithdrawModal}
        name={Routes.SAVINGS_WITHDRAW_MODAL}
        options={nativeStackDefaultConfigWithoutStatusBar}
      />
      <NativeStack.Screen
        component={DepositModal}
        name={Routes.SAVINGS_DEPOSIT_MODAL}
        options={nativeStackDefaultConfigWithoutStatusBar}
      />
      {cardstackGlobalScreens}
    </NativeStack.Navigator>
  );
}

export default React.memo(NativeStackNavigator);
