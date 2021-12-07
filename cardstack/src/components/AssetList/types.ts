import { BackgroundColorProps, ColorProps } from '@shopify/restyle';
import { Theme } from '../../theme';
import { PinnedHiddenSectionOption } from '@rainbow-me/hooks';
import { Network } from '@rainbow-me/helpers/networkTypes';
import {
  AssetWithNativeType,
  CollectibleType,
  DepotType,
  MerchantSafeType,
  PrepaidCardType,
} from '@cardstack/types';

interface HeaderItem {
  title: string;
  count?: number;
  showContextMenu?: boolean;
  total?: string;
  type?: PinnedHiddenSectionOption;
}

export type AssetListSectionItem<ComponentProps> = {
  Component: (
    props: ComponentProps & {
      networkName: string;
      nativeCurrency: string;
      currencyConversionRates: {
        [key: string]: number;
      };
    }
  ) => JSX.Element | null;
  header: HeaderItem;
  data: ComponentProps[];
  timestamp?: string;
};

export type SectionType =
  | PrepaidCardType
  | DepotType
  | MerchantSafeType
  | AssetWithNativeType
  | CollectibleType;

export interface AssetListProps
  extends BackgroundColorProps<Theme>,
    ColorProps<Theme> {
  isEmpty: boolean;
  loading: boolean;
  network: Network;
  nativeCurrency: string;
  currencyConversionRates: {
    [key: string]: number;
  };
  sections: Array<
    | AssetListSectionItem<PrepaidCardType>
    | AssetListSectionItem<DepotType>
    | AssetListSectionItem<MerchantSafeType>
    | AssetListSectionItem<AssetWithNativeType>
    | AssetListSectionItem<CollectibleType>
  >;
  headerPaddingVertical?: number;
  headerPaddingHorizontal?: number;
  refetchSafes: () => void;
  isFetchingSafes: boolean;
}

export interface AssetListRouteType {
  params: {
    scrollToPrepaidCardsSection?: boolean;
    forceRefreshOnce?: boolean;
  };
  key: string;
  name: string;
}
