import { useSelector } from 'react-redux';
import {
  AssetType,
  DepotType,
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
  };
  settings: {
    nativeCurrency: string;
    network: string;
  };
  uniqueTokens: {
    fetchingUniqueTokens: boolean;
    loadingUniqueTokens: boolean;
    uniqueTokens: any[];
  };
}

export const useRainbowSelector = <TSelected = unknown>(
  selector: (_state: ReduxState) => TSelected,
  equalityFn?: (_left: TSelected, _right: TSelected) => boolean
): TSelected => useSelector(selector, equalityFn);
