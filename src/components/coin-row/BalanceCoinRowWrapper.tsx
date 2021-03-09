import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { CoinItem } from '../../../cardstack/src/types';
import Routes from '../../navigation/routesNames';
import { BalanceCoinRow } from '@cardstack/components';
import { useCoinListEdited, useCoinListEditOptions } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';

const baseHeight = 309;
const heightWithChart = baseHeight + 310;

export const initialChartExpandedStateSheetHeight = heightWithChart;

interface BalanceCoinRowWrapperProps {
  item: CoinItem;
}

const BalanceCoinWrapper = ({ item }: BalanceCoinRowWrapperProps) => {
  const { navigate } = useNavigation();
  const recentlyPinnedCount = useSelector(
    // @ts-ignore
    state => state.editOptions.recentlyPinnedCount
  );

  const [selected, setSelected] = useState(false);
  const [previousPinned, setPreviousPinned] = useState(0);
  const { isCoinListEdited } = useCoinListEdited();
  const { removeSelectedCoin, pushSelectedCoin } = useCoinListEditOptions();

  useEffect(() => {
    if (
      selected &&
      (recentlyPinnedCount > previousPinned || !isCoinListEdited)
    ) {
      setPreviousPinned(recentlyPinnedCount);
      setSelected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCoinListEdited, recentlyPinnedCount]);

  const onPress = () => {
    if (isCoinListEdited) {
      if (selected) {
        removeSelectedCoin(item.uniqueId);
      } else {
        pushSelectedCoin(item.uniqueId);
      }

      setSelected(!selected);
    } else {
      navigate(Routes.EXPANDED_ASSET_SHEET, {
        asset: item,
        longFormHeight: initialChartExpandedStateSheetHeight,
        type: 'token',
      });
    }
  };

  return (
    <BalanceCoinRow
      isEditing={isCoinListEdited}
      item={item}
      onPress={onPress}
      selected={selected}
    />
  );
};

export default BalanceCoinWrapper;
