/* eslint-disable react/display-name */
/* eslint-disable sort-keys */
import { get } from 'lodash';
import React from 'react';
import {
  CoinDivider,
  CoinDividerHeight,
  SmallBalancesWrapper,
} from '../coin-divider';
import { CoinRowHeight } from '../coin-row';
import { SavingsCoinRowHeight } from '../coin-row/SavingsCoinRow';
import { FloatingActionButtonSize } from '../fab';
import { ListFooter } from '../list';
import PoolsListWrapper from '../pools/PoolsListWrapper';
import { TokenFamilyHeaderHeight } from '../token-family';
import { UniqueTokenRow } from '../unique-token';
import AssetListHeader, { AssetListHeaderHeight } from './AssetListHeader';
import { DEPOT_HEIGHT, PREPAID_CARD_HEIGHT } from '@cardstack/components';

export const firstCoinRowMarginTop = 6;
const lastCoinRowAdditionalHeight = 1;

const openSmallBalancesAdditionalHeight = 15;
const closedSmallBalancesAdditionalHeight = 18;

const poolsOpenAdditionalHeight = -12;
const poolsClosedAdditionalHeight = -15;
const poolsLastOpenAdditionalHeight = -14;
const poolsLastClosedAdditionalHeight = -10.5;

const firstUniqueTokenMarginTop = 4;
const extraSpaceForDropShadow = 19;

const amountOfImagesWithForcedPrioritizeLoading = 9;
const editModeAdditionalHeight = 100;

let lastRenderList = [];

export const ViewTypes = {
  HEADER: {
    calculateHeight: ({ hideHeader }) =>
      hideHeader ? 0 : AssetListHeaderHeight,
    index: 0,
    renderComponent: ({ data, isCoinListEdited }) => {
      return <AssetListHeader {...data} isCoinListEdited={isCoinListEdited} />;
    },
    visibleDuringCoinEdit: true,
  },

  COIN_ROW: {
    calculateHeight: ({ isFirst, isLast, areSmallCollectibles }) =>
      CoinRowHeight +
      (isFirst ? firstCoinRowMarginTop : 0) +
      (!isFirst && isLast && !areSmallCollectibles
        ? ListFooter.height + lastCoinRowAdditionalHeight
        : 0),
    index: 3,
    renderComponent: ({ type, data }) => {
      const { item = {}, renderItem } = data;
      return renderItem({
        firstCoinRowMarginTop: firstCoinRowMarginTop,
        isFirstCoinRow: type.isFirst,
        item,
      });
    },
    visibleDuringCoinEdit: true,
  },

  COIN_DIVIDER: {
    calculateHeight: () => CoinDividerHeight,
    index: 4,
    renderComponent: ({ data, isCoinListEdited, nativeCurrency }) => {
      const { item = {} } = data;
      return (
        <CoinDivider
          balancesSum={item.value}
          isCoinListEdited={isCoinListEdited}
          nativeCurrency={nativeCurrency}
        />
      );
    },
    visibleDuringCoinEdit: true,
  },

  COIN_SMALL_BALANCES: {
    calculateHeight: ({ isOpen, smallBalancesLength, isCoinListEdited }) =>
      isOpen
        ? smallBalancesLength * CoinRowHeight +
          openSmallBalancesAdditionalHeight +
          (isCoinListEdited ? editModeAdditionalHeight : 0)
        : closedSmallBalancesAdditionalHeight,
    index: 5,
    renderComponent: ({ data, smallBalancedChanged }) => {
      const { item = {}, renderItem } = data;

      if (
        lastRenderList.length !== item.assets.length ||
        smallBalancedChanged
      ) {
        smallBalancedChanged = false;
        const renderList = [];
        for (let i = 0; i < item.assets.length; i++) {
          renderList.push(
            renderItem({
              item: {
                ...item.assets[i],
                isSmall: true,
              },
              key: `CoinSmallBalances${i}`,
            })
          );
        }
        lastRenderList = renderList;
      }
      return <SmallBalancesWrapper assets={lastRenderList} />;
    },
    visibleDuringCoinEdit: true,
  },

  POOLS: {
    calculateHeight: ({ isOpen, isLast, amountOfRows }) =>
      isOpen
        ? TokenFamilyHeaderHeight +
          (isLast
            ? ListFooter.height + poolsLastOpenAdditionalHeight
            : poolsOpenAdditionalHeight) +
          CoinRowHeight * amountOfRows
        : TokenFamilyHeaderHeight +
          (isLast
            ? ListFooter.height + poolsLastClosedAdditionalHeight
            : poolsClosedAdditionalHeight),
    index: 7,
    renderComponent: ({ data, isCoinListEdited }) => {
      return <PoolsListWrapper {...data} isCoinListEdited={isCoinListEdited} />;
    },
  },

  UNIQUE_TOKEN_ROW: {
    calculateHeight: ({ amountOfRows, isFirst, isHeader, isOpen }) => {
      const SectionHeaderHeight = isHeader ? TokenFamilyHeaderHeight : 0;
      const firstRowExtraTopPadding = isFirst ? firstUniqueTokenMarginTop : 0;
      const heightOfRows = amountOfRows * UniqueTokenRow.cardSize;
      const heightOfRowMargins = UniqueTokenRow.cardMargin * (amountOfRows - 1);

      const height =
        SectionHeaderHeight +
        firstRowExtraTopPadding +
        (isOpen
          ? heightOfRows + heightOfRowMargins + extraSpaceForDropShadow
          : 0);
      return height;
    },
    index: 8,
    renderComponent: ({ type, data, index, sections }) => {
      const { item = {}, renderItem } = data;
      return renderItem({
        childrenAmount: item.childrenAmount,
        familyId: item.familyId,
        familyImage: item.familyImage,
        familyName: item.familyName,
        isFirst: type.isFirst,
        isHeader: type.isHeader,
        item: item.tokens,
        shouldPrioritizeImageLoading:
          index <
          get(sections, '[0].data.length', 0) +
            amountOfImagesWithForcedPrioritizeLoading,
        uniqueId: item.uniqueId,
      });
    },
  },

  PREPAID_CARDS: {
    calculateHeight: ({ amountOfRows }) => amountOfRows * PREPAID_CARD_HEIGHT,
    index: 1,
    renderComponent: ({ data }) => {
      const { item = {}, renderItem } = data;

      return renderItem({ item });
    },
  },

  DEPOTS: {
    calculateHeight: ({ amountOfRows }) => amountOfRows * DEPOT_HEIGHT,
    index: 2,
    renderComponent: ({ data }) => {
      const { item = {}, renderItem } = data;

      return renderItem({ item });
    },
  },

  FOOTER: {
    calculateHeight: ({ paddingBottom }) =>
      paddingBottom - FloatingActionButtonSize / 2,
    index: 9,
  },

  UNKNOWN: {
    calculateHeight: () => 0,
    index: 99,
  },
};
