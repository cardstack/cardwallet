import { useNavigation } from '@react-navigation/native';
import React from 'react';

import { AssetWithNativeType } from '../../../cardstack/src/types';
import { BalanceCoinRow } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import {
  PinnedHiddenSectionOption,
  usePinnedAndHiddenItemOptions,
} from '@rainbow-me/hooks';

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
  const isHidden = hidden.includes(item.address);

  if (!isEditing && isHidden) {
    return null;
  }

  const isSelected = selected.includes(item.address);
  const isPinned = pinned.includes(item.address);

  const onPress = () => {
    if (isEditing) {
      if (isSelected) {
        deselect(item.address);
      } else {
        select(item.address);
      }
    } else {
      navigate(Routes.TOKEN_SHEET, { asset: item });
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
