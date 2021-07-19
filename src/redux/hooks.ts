import { useSelector } from 'react-redux';
import {
  AssetType,
  DepotType,
  MerchantSafeType,
  PrepaidCardType,
  ERC20TransactionType,
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
    nativeCurrency: string;
    network: string;
  };
  uniqueTokens: {
    fetchingUniqueTokens: boolean;
    loadingUniqueTokens: boolean;
    uniqueTokens: any[];
  };
  currencyConversion: {
    rates: {
      [key: string]: number;
    };
  };
  walletconnect: {
    pendingRedirect: boolean;
  };
}

export const useRainbowSelector = <TSelected = unknown>(
  selector: (_state: ReduxState) => TSelected,
  equalityFn?: (_left: TSelected, _right: TSelected) => boolean
): TSelected => useSelector(selector, equalityFn);

export const useNativeCurrencyAndConversionRates = () =>
  useRainbowSelector<[string, { [key: string]: number }]>(state => [
    state.settings.nativeCurrency,
    state.currencyConversion.rates,
  ]);
