import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useMemo } from 'react';
import { InitialRouteContext } from '../context/initialRoute';
import AddCashSheet from '../screens/AddCashSheet';
import BackupSheet from '../screens/BackupSheet';
import ChangeWalletSheet from '../screens/ChangeWalletSheet';
import DepositModal from '../screens/DepositModal';
import ExpandedAssetSheet from '../screens/ExpandedAssetSheet';
import ModalScreen from '../screens/ModalScreen';
import PinAuthenticationScreen from '../screens/PinAuthenticationScreen';
import RestoreSheet from '../screens/RestoreSheet';
import SavingsSheet from '../screens/SavingsSheet';
import SendSheetEOA from '../screens/SendSheetEOA';
import SpeedUpAndCancelSheet from '../screens/SpeedUpAndCancelSheet';
import WithdrawModal from '../screens/WithdrawModal';
import WyreWebview from '../screens/WyreWebview';
import ExchangeModalNavigator from './ExchangeModalNavigator';
import { SwipeNavigator } from './SwipeNavigator';
import {
  closeKeyboardOnClose,
  defaultScreenStackOptions,
  stackNavigationConfig,
  wyreWebviewOptions,
} from './config';
import {
  bottomSheetPreset,
  exchangePreset,
  expandedPreset,
  overlayExpandedPreset,
  sheetPreset,
  sheetPresetWithSmallGestureResponseDistance,
  speedUpAndCancelStyleInterpolator,
} from './effects';
import Routes from './routesNames';

import {
  dismissAndroidKeyboardOnClose,
  useCardstackGlobalScreens,
  useCardstackMainScreens,
} from '@cardstack/navigation';

const Stack = createStackNavigator();
const OuterStack = createStackNavigator();

function SendFlowNavigator() {
  return (
    <Stack.Navigator
      {...stackNavigationConfig}
      initialRouteName={Routes.SEND_SHEET}
    >
      <Stack.Screen
        component={ModalScreen}
        name={Routes.MODAL_SCREEN}
        options={overlayExpandedPreset}
      />
      <Stack.Screen
        component={SendSheetEOA}
        name={Routes.SEND_SHEET}
        options={sheetPreset}
      />
    </Stack.Navigator>
  );
}

function AddCashFlowNavigator() {
  const { colors } = useTheme();
  const themedWyreWebviewOptions = useMemo(() => wyreWebviewOptions(colors), [
    colors,
  ]);
  return (
    <Stack.Navigator
      initialRouteName={Routes.WYRE_WEBVIEW}
      screenOptions={themedWyreWebviewOptions}
    >
      <Stack.Screen component={WyreWebview} name={Routes.WYRE_WEBVIEW} />
    </Stack.Navigator>
  );
}

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
      <Stack.Screen
        component={ExpandedAssetSheet}
        listeners={dismissAndroidKeyboardOnClose}
        name={Routes.EXPANDED_ASSET_SHEET}
        options={expandedPreset}
      />
      <Stack.Screen
        component={ExpandedAssetSheet}
        listeners={dismissAndroidKeyboardOnClose}
        name={Routes.EXPANDED_ASSET_SHEET_DRILL}
        options={sheetPreset}
      />
      <Stack.Screen
        component={ChangeWalletSheet}
        name={Routes.CHANGE_WALLET_SHEET}
        options={expandedPreset}
      />
      <Stack.Screen
        component={SpeedUpAndCancelSheet}
        name={Routes.SPEED_UP_AND_CANCEL_SHEET}
        options={{
          ...exchangePreset,
          cardStyleInterpolator: speedUpAndCancelStyleInterpolator,
        }}
      />
      <Stack.Screen
        component={ExchangeModalNavigator}
        name={Routes.EXCHANGE_MODAL}
        options={exchangePreset}
      />
      <Stack.Screen
        component={ModalScreen}
        {...closeKeyboardOnClose}
        name={Routes.MODAL_SCREEN}
        options={overlayExpandedPreset}
      />
      <Stack.Screen
        component={AddCashSheet}
        name={Routes.ADD_CASH_SHEET}
        options={sheetPreset}
      />
      <Stack.Screen
        component={SavingsSheet}
        name={Routes.SAVINGS_SHEET}
        options={bottomSheetPreset}
      />
      <Stack.Screen
        component={WithdrawModal}
        name={Routes.SAVINGS_WITHDRAW_MODAL}
        options={exchangePreset}
      />
      <Stack.Screen
        component={DepositModal}
        name={Routes.SAVINGS_DEPOSIT_MODAL}
        options={exchangePreset}
      />
      <Stack.Screen
        component={BackupSheet}
        name={Routes.BACKUP_SHEET}
        options={bottomSheetPreset}
      />
      <Stack.Screen
        component={RestoreSheet}
        name={Routes.RESTORE_SHEET}
        options={bottomSheetPreset}
      />
      <Stack.Screen
        component={AddCashFlowNavigator}
        name={Routes.WYRE_WEBVIEW_NAVIGATOR}
      />
      {cardstackMainScreens}
    </Stack.Navigator>
  );
}

// FIXME do it in one navigator
function MainOuterNavigator() {
  const cardstackGlobalScreens = useCardstackGlobalScreens(OuterStack);

  return (
    <OuterStack.Navigator
      initialRouteName={Routes.MAIN_NAVIGATOR}
      {...stackNavigationConfig}
      screenOptions={defaultScreenStackOptions}
    >
      <OuterStack.Screen
        component={MainNavigator}
        name={Routes.MAIN_NAVIGATOR}
      />
      <OuterStack.Screen
        component={PinAuthenticationScreen}
        name={Routes.PIN_AUTHENTICATION_SCREEN}
        options={{ ...sheetPreset, gestureEnabled: false }}
      />
      <OuterStack.Screen
        component={BackupSheet}
        name={Routes.BACKUP_SCREEN}
        options={sheetPreset}
      />
      <OuterStack.Screen
        component={SendFlowNavigator}
        name={Routes.SEND_SHEET_NAVIGATOR}
        options={sheetPresetWithSmallGestureResponseDistance}
      />
      {cardstackGlobalScreens}
    </OuterStack.Navigator>
  );
}

export default React.memo(MainOuterNavigator);
