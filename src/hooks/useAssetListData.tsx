import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useAsyncStorage } from '@react-native-community/async-storage';
import { orderBy, union, without } from 'lodash';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { BalanceCoinRowWrapper } from '../components/coin-row';
import {
  AssetListSectionItem,
  Depot,
  MerchantSafe,
  PrepaidCard,
} from '@cardstack/components';
import {
  AssetType,
  AssetWithNativeType,
  DepotType,
  MerchantSafeType,
  PrepaidCardType,
} from '@cardstack/types';
import { parseAssetsNativeWithTotals } from '@rainbow-me/parsers';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
const PINNED_HIDDEN_STORAGE_KEY = 'PINNED_BALANCES_STORAGE_KEY';

type PinnedAndHiddenItemOptionContextType = any;

const PinnedHiddenItemOptionContext = createContext({
  editing: false,
  toggle: () => {},
  pinned: [],
  hidden: [],
  selected: [],
  pin: () => {},
  unpin: () => {},
  hide: () => {},
  show: () => {},
  select: (_key: string) => {},
  deselect: (_key: string) => {},
});

export const usePinnedAndHiddenItemOptions = (): PinnedAndHiddenItemOptionContextType =>
  useContext(PinnedHiddenItemOptionContext);

export enum PinnedHiddenSectionOption {
  BALANCES = 'BALANCES',
  PREPAID_CARDS = 'PREPAID_CARDS',
}

export const PinnedHiddenItemOptionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { getItem, setItem } = useAsyncStorage(PINNED_HIDDEN_STORAGE_KEY);

  const [ready, setReady] = useState<boolean>(false);
  const [editing, setEditing] = useState<PinnedHiddenSectionOption | null>();
  const [value, setValue] = useState<any>({
    pinned: [],
    hidden: [],
    selected: [],
  });

  const toggle = (type: PinnedHiddenSectionOption) => {
    if (type === editing) {
      setEditing(null);
    } else {
      setEditing(type);
    }
  };

  const select = async (key: string) => {
    const stored = {
      pinned: value.pinned,
      hidden: value.hidden,
      selected: union(value.selected, [key]),
    };

    setValue(stored);
  };

  const deselect = async (key: string) => {
    const stored = {
      pinned: value.pinned,
      hidden: value.hidden,
      selected: without(value.selected, key),
    };

    setValue(stored);
  };

  const pin = async () => {
    const stored = {
      selected: [],
      hidden: value.hidden,
      pinned: union(value.pinned, value.selected),
    };

    await setItem(JSON.stringify(stored));

    setValue(stored);
  };

  const unpin = async () => {
    const stored = {
      selected: [],
      hidden: value.hidden,
      pinned: without(value.pinned, ...value.selected),
    };

    await setItem(JSON.stringify(stored));

    setValue(stored);
  };

  const hide = async () => {
    const stored = {
      selected: [],
      pinned: value.pinned,
      hidden: union(value.hidden, value.selected),
    };

    await setItem(JSON.stringify(stored));

    setValue(stored);
  };

  const show = async () => {
    const stored = {
      selected: [],
      pinned: value.pinned,
      hidden: without(value.hidden, ...value.selected),
    };

    await setItem(JSON.stringify(stored));

    setValue(stored);
  };

  useEffect(() => {
    getItem((_err, result) => {
      if (result) {
        const { pinned = [], hidden = [] } = JSON.parse(result);
        setValue({ pinned, hidden, selected: [] });
      } else {
        setValue({ pinned: [], hidden: [], selected: [] });
      }

      setReady(true);
    });
  }, []);

  const { selected, pinned, hidden } = value;

  console.log(JSON.stringify(value, null, 4));

  return (
    <PinnedHiddenItemOptionContext.Provider
      value={{
        pinned,
        hidden,
        selected,
        editing,
        toggle,
        select,
        deselect,
        pin,
        unpin,
        hide,
        show,
      }}
    >
      {ready ? children : null}
    </PinnedHiddenItemOptionContext.Provider>
  );
};

const usePrepaidCardSection = (): AssetListSectionItem<PrepaidCardType> => {
  let prepaidCards = useRainbowSelector(state => state.data.prepaidCards);

  const { editing, hidden, pinned } = usePinnedAndHiddenItemOptions();

  const isEditing = editing === PinnedHiddenSectionOption.PREPAID_CARDS;

  if (!isEditing) {
    prepaidCards = prepaidCards.filter(pc => !hidden.includes(pc.address));
  }

  prepaidCards = orderBy(
    prepaidCards,
    [
      function (p) {
        return pinned.includes(p.address);
      },
    ],
    ['desc']
  );

  return {
    header: {
      title: 'Prepaid Cards',
      count: prepaidCards.length,
      type: PinnedHiddenSectionOption.PREPAID_CARDS,
      showContextMenu: true,
    },
    data: prepaidCards,
    Component: PrepaidCard,
  };
};

const useDepotSection = (): AssetListSectionItem<DepotType> => {
  const depots = useRainbowSelector(state => state.data.depots);

  return {
    header: {
      title: 'Depot',
    },
    data: depots,
    Component: Depot,
  };
};

const useMerchantSafeSection = (): AssetListSectionItem<MerchantSafeType> => {
  const merchantSafes = useRainbowSelector(state => state.data.merchantSafes);

  return {
    header: {
      title: 'Merchants',
      count: merchantSafes?.length,
    },
    data: merchantSafes,
    Component: MerchantSafe,
  };
};

const useBalancesSection = (): AssetListSectionItem<AssetWithNativeType> => {
  const [stateAssets, nativeCurrency, network] = useRainbowSelector<
    [AssetType[], string, string]
  >(state => [
    state.data.assets,
    state.settings.nativeCurrency,
    state.settings.network,
  ]);
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  const assetsWithNative = parseAssetsNativeWithTotals(
    stateAssets,
    nativeCurrency
  );

  let assetBalances = assetsWithNative.assetsNativePrices;

  const { editing, hidden, pinned } = usePinnedAndHiddenItemOptions();

  const isEditing = editing === PinnedHiddenSectionOption.BALANCES;

  let assets = orderBy(
    assetBalances,
    [
      function (p) {
        return pinned.includes(p.address);
      },
      function (p) {
        return p.symbol;
      },
    ],
    ['desc', 'asc', 'asc']
  ) as AssetWithNativeType[];

  if (!isEditing) {
    assets = assets.filter(a => !hidden.includes(a.address));
  }

  const nativeBalance = assets.find(a => nativeTokenSymbol.includes(a.symbol));
  const nativeBalancePinned = nativeBalance
    ? pinned.includes(nativeBalance.address)
    : false;

  if (nativeBalancePinned) {
    assets = assets.sort(a => (nativeTokenSymbol.includes(a.symbol) ? -1 : 1));
  }

  return {
    header: {
      title: 'Balances',
      count: assets.length,
      total: assetsWithNative.total.display,
      type: PinnedHiddenSectionOption.BALANCES,
      showContextMenu: true,
    },
    data: assets,
    Component: BalanceCoinRowWrapper,
  };
};

export const useAssetListData = () => {
  const prepaidCardSection = usePrepaidCardSection();
  const depotSection = useDepotSection();
  const merchantSafesSection = useMerchantSafeSection();
  const balancesSection = useBalancesSection();
  const isLoadingAssets = useRainbowSelector(
    state => state.data.isLoadingAssets
  );
  const orderedSections = [
    prepaidCardSection,
    merchantSafesSection,
    depotSection,
    balancesSection,
  ];
  const sections = orderedSections.filter(section => section?.data?.length);

  const isEmpty = !sections.length;

  return {
    isLoadingAssets,
    isEmpty,
    sections,
  };
};
