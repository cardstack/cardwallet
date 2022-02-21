import { get } from 'lodash';
import { StatusBar } from 'react-native';
// eslint-disable-next-line import/default
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import currentColors from '../context/currentColors';
import { sentryUtils } from '../utils';
import Routes from './routesNames';
import { Navigation } from './index';

let memRouteName;

let action = null;

const isOnSwipeScreen = name =>
  [Routes.WALLET_SCREEN, Routes.QR_SCANNER_SCREEN, Routes.HOME_SCREEN].includes(
    name
  );

export function triggerOnSwipeLayout(newAction) {
  if (isOnSwipeScreen(Navigation.getActiveRoute()?.name)) {
    newAction();
  } else {
    action = newAction;
  }
}

export function onNavigationStateChange() {
  const { name: routeName } = Navigation.getActiveRoute();
  if (isOnSwipeScreen(routeName)) {
    action?.();
    action = undefined;
  }
  const prevRouteName = memRouteName;
  memRouteName = routeName;

  if (currentColors.theme === 'dark') {
    StatusBar.setBarStyle('light-content');
  } else {
    if (android && routeName !== prevRouteName) {
      if (
        routeName === Routes.MAIN_EXCHANGE_SCREEN ||
        routeName === Routes.SAVINGS_WITHDRAW_MODAL ||
        routeName === Routes.SEND_SHEET ||
        routeName === Routes.SPEND_SHEET ||
        routeName === Routes.SWAP_DETAILS_SCREEN
      ) {
        AndroidKeyboardAdjust.setAdjustPan();
      } else {
        AndroidKeyboardAdjust.setAdjustResize();
      }

      if (
        routeName === Routes.EXPANDED_ASSET_SHEET &&
        Navigation.getActiveRoute().params.type === 'uniswap'
      ) {
        StatusBar.setBarStyle('light-content', true);
      }
    }
  }

  if (routeName !== prevRouteName) {
    let paramsToTrack = null;

    if (routeName === Routes.EXPANDED_ASSET_SHEET) {
      const { asset, type } = Navigation.getActiveRoute().params;
      paramsToTrack = {
        assetContractAddress:
          asset.address || get(asset, 'asset_contract.address'),
        assetName: asset.name,
        assetSymbol: asset.symbol || get(asset, 'asset_contract.symbol'),
        assetType: type,
      };
    }

    sentryUtils.addNavBreadcrumb(prevRouteName, routeName, paramsToTrack);
  }
}
