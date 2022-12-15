import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { ChainId } from '@uniswap/sdk';
import { useSelector } from 'react-redux';
import {
  CollectibleType,
  DepotType,
  ERC20TransactionType,
  MerchantSafeType,
  NetworkType,
  PrepaidCardType,
} from '@cardstack/types';

interface ReduxState {
  data: {
    isLoadingAssets: boolean;
    prepaidCards: PrepaidCardType[];
    depots: DepotType[];
    merchantSafes: MerchantSafeType[];
    transactions: ERC20TransactionType[];
  };
  settings: {
    accountAddress: string;
    nativeCurrency: NativeCurrency;
    network: NetworkType;
    chainId: ChainId;
  };
  collectibles: {
    fetchingCollectibles: boolean;
    loadingCollectibles: boolean;
    collectibles: CollectibleType[];
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
