import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { useSelector } from 'react-redux';

import {
  CollectibleType,
  ERC20TransactionType,
  NetworkType,
} from '@cardstack/types';

interface ReduxState {
  data: {
    transactions: ERC20TransactionType[];
  };
  settings: {
    accountAddress: string;
    nativeCurrency: NativeCurrency;
    network: NetworkType;
    chainId: number;
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
