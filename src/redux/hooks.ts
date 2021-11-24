import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import { useSelector } from 'react-redux';
import {
  AssetType,
  DepotType,
  ERC20TransactionType,
  MerchantSafeType,
  PrepaidCardType,
} from '@cardstack/types';

interface ReduxState {
  data: {
    assets: AssetType[];
    isLoadingAssets: boolean;
    prepaidCards: PrepaidCardType[];
    depots: DepotType[];
    merchantSafes: MerchantSafeType[];
    transactions: ERC20TransactionType[];
  };
  settings: {
    accountAddress: string;
    nativeCurrency: NativeCurrency;
    network: string;
  };
  collectibles: {
    fetchingCollectibles: boolean;
    loadingCollectibles: boolean;
    collectibles: any[];
  };
  currencyConversion: {
    rates: {
      [key: string]: number;
    };
  };
  walletconnect: {
    pendingRedirect: boolean;
  };
  payment: {
    currency: NativeCurrency;
  };
  appState: {
    walletReady: boolean;
  };
}

export const useRainbowSelector = <TSelected = unknown>(
  selector: (_state: ReduxState) => TSelected,
  equalityFn?: (_left: TSelected, _right: TSelected) => boolean
): TSelected => useSelector(selector, equalityFn);

export const useNativeCurrencyAndConversionRates = () =>
  useRainbowSelector<[NativeCurrency, { [key: string]: number }]>(state => [
    state.settings.nativeCurrency,
    state.currencyConversion.rates,
  ]);

export const usePaymentCurrencyAndConversionRates = () =>
  useRainbowSelector<[NativeCurrency, { [key: string]: number }]>(state => [
    state.payment.currency,
    state.currencyConversion.rates,
  ]);
