import { MerchantSafe } from '@cardstack/cardpay-sdk';
import { useSelector } from 'react-redux';
import { AssetType, DepotType, PrepaidCardType } from '@cardstack/types';

interface ReduxState {
  data: {
    assets: AssetType[];
    isLoadingAssets: boolean;
    prepaidCards: PrepaidCardType[];
    depots: DepotType[];
    merchantSafes: MerchantSafe[];
  };
  settings: {
    nativeCurrency: string;
    network: string;
  };
}

export const useRainbowSelector = <TSelected = unknown>(
  selector: (_state: ReduxState) => TSelected,
  equalityFn?: (_left: TSelected, _right: TSelected) => boolean
): TSelected => useSelector(selector, equalityFn);
