import React from 'react';

import { AssetWithNativeType } from '../../../cardstack/src/types';
import Routes from '../../navigation/routesNames';
import { BalanceCoinRow } from '@cardstack/components';
import {
  PinnedHiddenSectionOption,
  usePinnedAndHiddenItemOptions,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';

const baseHeight = 309;
const heightWithChart = baseHeight + 310;

export const initialChartExpandedStateSheetHeight = heightWithChart;

const BalanceCoinWrapper = (item: AssetWithNativeType) => {
  const { navigate } = useNavigation();

  const {
    editing,
    selected,
    pinned,
    hidden,
    select,
    deselect,
  } = usePinnedAndHiddenItemOptions();

  const isEditing = editing === PinnedHiddenSectionOption.BALANCES;
  const isSelected = selected.includes(item.address);
  const isPinned = pinned.includes(item.address);
  const isHidden = hidden.includes(item.address);

  const onPress = () => {
    if (isEditing) {
      if (isSelected) {
        deselect(item.address);
      } else {
        select(item.address);
      }
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
      hidden={isHidden}
      isEditing={isEditing}
      item={item}
      onPress={onPress}
      pinned={isPinned}
      selected={isSelected}
    />
  );
};

export default BalanceCoinWrapper;
