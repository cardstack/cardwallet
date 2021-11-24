import React from 'react';

import Routes from '../../navigation/routesNames';
import { BalanceCoinRow } from '@cardstack/components';
import { AssetWithNativeType } from '@cardstack/types';
import {
  PinnedHiddenSectionOption,
  useHiddenItemOptions,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';

const BalanceCoinWrapper = (item: AssetWithNativeType) => {
  const { navigate } = useNavigation();

  const {
    editing,
    selected,
    pinned,
    hidden,
    handleSelection,
  } = useHiddenItemOptions();

  const isEditing = editing === PinnedHiddenSectionOption.BALANCES;
  const isHidden = hidden.includes(item.address);

  if (!isEditing && isHidden) {
    return null;
  }

  const isSelected = selected.includes(item.address);
  const isPinned = pinned.includes(item.address);

  const onPress = () => {
    if (isEditing) {
      handleSelection(isEditing, isSelected, item.address);

      return;
    }
    navigate(Routes.EXPANDED_ASSET_SHEET, {
      asset: item,
      type: 'token',
    });
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
