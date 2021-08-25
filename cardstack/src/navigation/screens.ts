import { StackNavigationOptions } from '@react-navigation/stack';
import { Routes } from './routes';
import { horizontalInterpolator } from './presetOptions';
import {
  BuyPrepaidCard,
  DepotScreen,
  MerchantScreen,
  PrepaidCardModal,
  TransactionConfirmation,
} from '@cardstack/screen';
import { expandedPreset } from '@rainbow-me/navigation/effects';

interface ScreenNavigation {
  component: React.ComponentType<any>;
  options?: StackNavigationOptions;
}

export const Screens: Record<keyof typeof Routes, ScreenNavigation> = {
  DEPOT_SCREEN: { component: DepotScreen, options: horizontalInterpolator },
  MERCHANT_SCREEN: {
    component: MerchantScreen,
    options: horizontalInterpolator,
  },
  PREPAID_CARD_MODAL: {
    component: PrepaidCardModal,
    options: expandedPreset as StackNavigationOptions,
  },
  BUY_PREPAID_CARD: { component: BuyPrepaidCard },
  CONFIRM_REQUEST: {
    component: TransactionConfirmation,
    options: { gestureEnabled: false },
  },
};
