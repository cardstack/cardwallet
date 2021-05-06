import lang from 'i18n-js';
import {
  compact,
  find,
  flattenDeep,
  get,
  groupBy,
  map,
  property,
} from 'lodash';
import React from 'react';
import ReactCoinIcon from 'react-coin-icon';
import { LayoutAnimation, View } from 'react-native';
import { createSelector } from 'reselect';
import { AssetListItemSkeleton } from '../components/asset-list';
import { BalanceCoinRowWrapper } from '../components/coin-row';
import CopyTooltip from '../components/copy-tooltip';
import { UniswapInvestmentRow } from '../components/investment-cards';
import { CollectibleTokenFamily } from '../components/token-family';
import { withNavigation } from '../navigation/Navigation';
import { compose, withHandlers } from '../utils/recompactAdapters';
import { buildCoinsList, buildUniqueTokenList } from './assets';
import networkTypes from './networkTypes';
import { add, convertAmountToNativeDisplay, multiply } from './utilities';
import { Text } from '@cardstack/components';
import { ImgixImage } from '@rainbow-me/images';
import { setIsCoinListEdited } from '@rainbow-me/redux/editOptions';
import { setOpenSmallBalances } from '@rainbow-me/redux/openStateSettings';
import store from '@rainbow-me/redux/store';
import { ETH_ICON_URL } from '@rainbow-me/references';
import Routes from '@rainbow-me/routes';
import { ethereumUtils } from '@rainbow-me/utils';

const allSelector = state => state;
const allDepotsSelector = state => state.depots;
const allPrepaidCardsSelector = state => state.prepaidCards;
const allAssetsSelector = state => state.allAssets;
const allAssetsCountSelector = state => state.allAssetsCount;
const assetsTotalSelector = state => state.assetsTotal;
const currentActionSelector = state => state.currentAction;
const hiddenCoinsSelector = state => state.hiddenCoins;
const isBalancesSectionEmptySelector = state => state.isBalancesSectionEmpty;
const isCoinListEditedSelector = state => state.isCoinListEdited;
const isLoadingAssetsSelector = state => state.isLoadingAssets;
const languageSelector = state => state.language;
const networkSelector = state => state.network;
const nativeCurrencySelector = state => state.nativeCurrency;
const pinnedCoinsSelector = state => state.pinnedCoins;
const savingsSelector = state => state.savings;
const showcaseTokensSelector = state => state.showcaseTokens;
const uniqueTokensSelector = state => state.uniqueTokens;
const uniswapSelector = state => state.uniswap;
const uniswapTotalSelector = state => state.uniswapTotal;

const enhanceRenderItem = compose(
  withNavigation,
  withHandlers({
    onPress: ({ assetType, navigation }) => (item, params) => {
      navigation.navigate(
        ios ? Routes.EXPANDED_ASSET_SHEET : Routes.EXPANDED_ASSET_SCREEN,
        {
          asset: item,
          type: assetType,
          ...params,
        }
      );
    },
  })
);

const TokenItem = enhanceRenderItem(BalanceCoinRowWrapper);

const balancesSkeletonRenderItem = item => (
  <AssetListItemSkeleton animated descendingOpacity={false} {...item} />
);

const balancesRenderItem = item => <TokenItem {...item} assetType="token" />;

const tokenFamilyItem = item => (
  <CollectibleTokenFamily {...item} uniqueId={item.uniqueId} />
);
const uniswapRenderItem = item => (
  <UniswapInvestmentRow {...item} assetType="uniswap" isCollapsible />
);

const filterWalletSections = sections =>
  sections.filter(({ data, header }) =>
    data ? get(header, 'totalItems') : true
  );

const addEth = section => {
  const assets = store.getState().data.genericAssets;

  if (assets.eth) {
    const { relative_change_24h, value } = assets.eth.price;
    const zeroEthRow = {
      address: 'eth',
      balance: {
        amount: '0',
        display: '0 ETH',
      },
      color: '#29292E',
      decimals: 18,
      icon_url: ETH_ICON_URL,
      isCoin: true,
      isPinned: true,
      isPlaceholder: true,
      isSmall: false,
      name: 'Ethereum',
      native: {
        balance: {
          amount: '0',
          display: '0.00',
        },
        change: relative_change_24h ? `${relative_change_24h.toFixed(2)}%` : '',
        price: {
          amount: value,
          display: String(value),
        },
      },
      price: assets.eth.price,
      symbol: 'ETH',
      type: 'token',
      uniqueId: 'eth',
    };

    if (section.data.length === 1) {
      section.data.unshift(zeroEthRow);
    }
  }

  return section;
};

const buildWalletSections = (
  balanceSection,
  uniqueTokenFamiliesSection,
  uniswapSection,
  depotSection,
  prepaidCardSection
) => {
  const sections = [
    addEth(balanceSection),
    uniswapSection,
    uniqueTokenFamiliesSection,
    depotSection,
    prepaidCardSection,
  ];

  const filteredSections =
    filterWalletSections(sections).length > 0
      ? filterWalletSections(sections)
      : filterWalletSections([balanceSection]);
  const isEmpty = !filteredSections.length;

  return {
    isEmpty,
    sections: filteredSections,
  };
};

const withUniswapSection = (
  language,
  nativeCurrency,
  uniswap,
  uniswapTotal
) => {
  return {
    data: uniswap,
    header: {
      title: 'Pools',
      totalItems: uniswap.length,
      totalValue: convertAmountToNativeDisplay(uniswapTotal, nativeCurrency),
    },
    name: 'pools',
    pools: true,
    renderItem: uniswapRenderItem,
  };
};

const withBalanceSavingsSection = savings => {
  const priceOfEther = ethereumUtils.getEthPriceUnit();

  let savingsAssets = savings;
  let totalUnderlyingNativeValue = '0';
  if (priceOfEther) {
    savingsAssets = map(savings, asset => {
      const {
        supplyBalanceUnderlying,
        underlyingPrice,
        lifetimeSupplyInterestAccrued,
      } = asset;
      const underlyingNativePrice =
        asset.underlying.symbol === 'ETH'
          ? priceOfEther
          : multiply(underlyingPrice, priceOfEther);
      const underlyingBalanceNativeValue = supplyBalanceUnderlying
        ? multiply(supplyBalanceUnderlying, underlyingNativePrice)
        : 0;
      totalUnderlyingNativeValue = add(
        totalUnderlyingNativeValue,
        underlyingBalanceNativeValue
      );
      const lifetimeSupplyInterestAccruedNative = lifetimeSupplyInterestAccrued
        ? multiply(lifetimeSupplyInterestAccrued, underlyingNativePrice)
        : 0;

      return {
        ...asset,
        lifetimeSupplyInterestAccruedNative,
        underlyingBalanceNativeValue,
      };
    });
  }

  const savingsSection = {
    assets: savingsAssets,
    savingsContainer: true,
    totalValue: totalUnderlyingNativeValue,
  };
  return savingsSection;
};

const coinEditContextMenu = (
  allAssets,
  balanceSectionData,
  isCoinListEdited,
  currentAction,
  isLoadingAssets,
  allAssetsCount,
  totalValue
) => {
  const noSmallBalances = !find(balanceSectionData, 'smallBalancesContainer');

  return {
    contextMenuOptions:
      allAssets.length > 0 && noSmallBalances
        ? {
            cancelButtonIndex: 0,
            dynamicOptions: () => {
              return ['Cancel', 'Edit'];
            },
            onPressActionSheet: async index => {
              if (index === 1) {
                store.dispatch(setIsCoinListEdited(!isCoinListEdited));
                store.dispatch(setOpenSmallBalances(true));
                LayoutAnimation.configureNext(
                  LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
                );
              }
            },
          }
        : undefined,
    title: lang.t('account.tab_balances'),
    totalItems: isLoadingAssets ? 1 : allAssetsCount,
    totalValue: totalValue,
  };
};

const withBalanceSection = (
  allAssets,
  allAssetsCount,
  assetsTotal,
  savingsSection,
  isBalancesSectionEmpty,
  isLoadingAssets,
  language,
  nativeCurrency,
  network,
  isCoinListEdited,
  pinnedCoins,
  hiddenCoins,
  currentAction,
  uniswapTotal
) => {
  const { assets, totalBalancesValue } = buildCoinsList(
    allAssets,
    nativeCurrency,
    isCoinListEdited,
    pinnedCoins,
    hiddenCoins,
    true
  );
  let balanceSectionData = [...assets];

  const totalBalanceWithSavingsValue = add(
    totalBalancesValue,
    get(savingsSection, 'totalValue', 0)
  );
  const totalBalanceWithAllSectionValues = add(
    totalBalanceWithSavingsValue,
    uniswapTotal
  );

  const totalValue = convertAmountToNativeDisplay(
    totalBalanceWithAllSectionValues,
    nativeCurrency
  );

  if (networkTypes.mainnet === network) {
    balanceSectionData.push(savingsSection);
  }

  if (isLoadingAssets) {
    balanceSectionData = [{ item: { uniqueId: 'skeleton0' } }];
  }

  return {
    balances: true,
    data: balanceSectionData,
    header: coinEditContextMenu(
      allAssets,
      balanceSectionData,
      isCoinListEdited,
      currentAction,
      isLoadingAssets,
      allAssetsCount,
      totalValue
    ),
    name: 'balances',
    renderItem: isLoadingAssets
      ? balancesSkeletonRenderItem
      : balancesRenderItem,
  };
};

let isPreloadComplete = false;
const largeFamilyThreshold = 4;
const jumboFamilyThreshold = largeFamilyThreshold * 2;
const minTopFoldThreshold = 10;

const buildImagesToPreloadArray = (family, index, families) => {
  const isLargeFamily = family.tokens.length > largeFamilyThreshold;
  const isJumboFamily = family.tokens.length >= jumboFamilyThreshold;
  const isTopFold = index < Math.max(families.length / 2, minTopFoldThreshold);

  return family.tokens.map((token, rowIndex) => {
    let priority = ImgixImage.priority[isTopFold ? 'high' : 'normal'];

    if (isTopFold && isLargeFamily) {
      if (rowIndex <= largeFamilyThreshold) {
        priority = ImgixImage.priority.high;
      } else if (isJumboFamily) {
        const isMedium =
          rowIndex > largeFamilyThreshold && rowIndex <= jumboFamilyThreshold;
        priority = ImgixImage.priority[isMedium ? 'normal' : 'low'];
      } else {
        priority = ImgixImage.priority.normal;
      }
    }

    const images = token.map(({ image_preview_url, uniqueId }) => {
      if (!image_preview_url) return null;
      return {
        id: uniqueId,
        priority,
        uri: image_preview_url,
      };
    });

    return images.length ? images : null;
  });
};

const sortImagesToPreload = images => {
  const filtered = compact(flattenDeep(images));
  const grouped = groupBy(filtered, property('priority'));
  return [
    ...get(grouped, 'high', []),
    ...get(grouped, 'normal', []),
    ...get(grouped, 'low', []),
  ];
};

const withUniqueTokenFamiliesSection = (language, uniqueTokens, data) => {
  // TODO preload elsewhere?
  if (!isPreloadComplete) {
    const imagesToPreload = sortImagesToPreload(
      data.map(buildImagesToPreloadArray)
    );
    isPreloadComplete = !!imagesToPreload.length;
    ImgixImage.preload(imagesToPreload);
  }

  return {
    collectibles: true,
    data,
    header: {
      title: lang.t('account.tab_collectibles'),
      totalItems: uniqueTokens.length,
      totalValue: '',
    },
    name: 'collectibles',
    renderItem: tokenFamilyItem,
    type: 'big',
  };
};

const uniqueTokenDataSelector = createSelector(
  [uniqueTokensSelector, showcaseTokensSelector],
  buildUniqueTokenList
);

const balanceSavingsSectionSelector = createSelector(
  [savingsSelector],
  withBalanceSavingsSection
);

const uniswapSectionSelector = createSelector(
  [
    languageSelector,
    nativeCurrencySelector,
    uniswapSelector,
    uniswapTotalSelector,
  ],
  withUniswapSection
);

const prepaidCardsSectionSelector = createSelector(
  [allPrepaidCardsSelector],
  (prepaidCards = []) => {
    const total = prepaidCards.reduce(
      (acc, prepaidCard) =>
        acc +
        prepaidCard.tokens.reduce(
          (_acc, { token }) => _acc + parseFloat(token.value),
          0
        ),
      0
    );

    return {
      header: {
        title: 'Prepaid Cards',
        totalItems: prepaidCards.length,
        totalValue: `$${total.toFixed(2)}`,
      },
      name: 'prepaidCards',
      data: prepaidCards,
      // eslint-disable-next-line react/display-name
      renderItem: ({ item }) => {
        const balances = item.tokens.map(({ tokenAddress, token }) => (
          <View
            key={tokenAddress}
            style={{
              paddingVertical: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ paddingRight: 14 }}>
                <ReactCoinIcon size={40} symbol={token.symbol} />
              </View>
              <View>
                <Text fontWeight="700">{token.name}</Text>
                <Text variant="subText">
                  {token.value} {token.symbol}
                </Text>
              </View>
            </View>
            <View>
              <Text fontWeight="700">
                {' '}
                ${parseFloat(token.value).toFixed(2)} USD
              </Text>
            </View>
          </View>
        ));
        return (
          <CopyTooltip
            textToCopy={item.address}
            tooltipText="Copy safe address to clipboard"
          >
            <View
              style={{
                padding: 10,
                paddingHorizontal: 16,
                marginBottom: 6,
                marginHorizontal: 22,
                backgroundColor: '#ffffff',
                borderRadius: 10,
              }}
            >
              <View style={{ justifyContent: 'center' }}>{balances}</View>
            </View>
          </CopyTooltip>
        );
      },
    };
  }
);

const safesSectionSelector = createSelector(
  [allDepotsSelector],
  (depots = []) => {
    const total = depots.reduce(
      (acc, prepaidCard) =>
        acc +
        prepaidCard.tokens.reduce(
          (_acc, { token }) => _acc + parseFloat(token.value),
          0
        ),
      0
    );

    const tokens = depots.reduce((acc, depot) => acc.concat(depot.tokens), []);

    return {
      header: {
        title: 'Balances',
        totalItems: depots.length,
        totalValue: `$${total.toFixed(2)}`,
      },
      name: 'safes',
      data: tokens,
      // eslint-disable-next-line react/display-name
      renderItem: ({ item }) => {
        const { token, tokenAddress } = item;
        const [int, dec] = token.value.split('.');
        const value = `$${int}.${dec.slice(0, 2)}`;

        return (
          <TokenItem
            item={{
              isPinned: false,
              name: token.name,
              address: tokenAddress,
              balance: {
                amount: token.value,
                display: `${token.value} ${token.symbol}`,
              },
              native: {
                balance: {
                  amount: token.value,
                  display: value,
                },
                change: '',
                price: {
                  amount: 1,
                  display: '1.00',
                },
              },
              symbol: token.symbol,
              price: {
                changed_at: 0,
                relative_change_24h: 0,
                value: 0,
              },
            }}
            key={tokenAddress}
            {...item}
            assetType="token"
          />
        );
      },
    };
  }
);

const balanceSectionSelector = createSelector(
  [
    allAssetsSelector,
    allAssetsCountSelector,
    assetsTotalSelector,
    balanceSavingsSectionSelector,
    isBalancesSectionEmptySelector,
    isLoadingAssetsSelector,
    languageSelector,
    nativeCurrencySelector,
    networkSelector,
    isCoinListEditedSelector,
    pinnedCoinsSelector,
    hiddenCoinsSelector,
    currentActionSelector,
    uniswapTotalSelector,
  ],
  withBalanceSection
);

const uniqueTokenFamiliesSelector = createSelector(
  [languageSelector, uniqueTokensSelector, uniqueTokenDataSelector],
  withUniqueTokenFamiliesSection
);

export const buildWalletSectionsSelector = createSelector(
  [
    balanceSectionSelector,
    uniqueTokenFamiliesSelector,
    uniswapSectionSelector,
    safesSectionSelector,
    prepaidCardsSectionSelector,
  ],
  buildWalletSections
);
