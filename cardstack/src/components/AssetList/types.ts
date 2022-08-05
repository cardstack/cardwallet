import { BackgroundColorProps, ColorProps } from '@shopify/restyle';

import { RouteType } from '@cardstack/navigation/types';
import {
  AssetWithNativeType,
  CollectibleType,
  DepotType,
  MerchantSafeType,
  PrepaidCardType,
} from '@cardstack/types';

import { Network } from '@rainbow-me/helpers/networkTypes';
import { PinnedHiddenSectionOption } from '@rainbow-me/hooks';

import { Theme } from '../../theme';

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

export type AssetListRouteType = RouteType<{
  scrollToPrepaidCardsSection?: boolean;
  forceRefreshOnce?: boolean;
  shouldAwaitForProfile?: boolean;
}>;
