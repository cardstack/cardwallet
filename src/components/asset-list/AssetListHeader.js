import React from 'react';
import { magicMemo } from '../../utils';
import { DividerSize } from '../Divider';
import { ListHeader, ListHeaderHeight } from '../list';
import { Text } from '@cardstack/components';

export const AssetListHeaderHeight = ListHeaderHeight + DividerSize;

const AssetListHeader = ({
  contextMenuOptions,
  isCoinListEdited,
  isSticky,
  title,
  totalValue,
  ...props
}) => (
  <ListHeader
    contextMenuOptions={contextMenuOptions}
    isCoinListEdited={isCoinListEdited}
    isSticky={isSticky}
    title={title}
    totalValue={totalValue}
    {...props}
  >
    {totalValue ? (
      <Text color="white" fontSize={16} fontWeight="700">
        {totalValue} USD
      </Text>
    ) : null}
  </ListHeader>
);

export default magicMemo(AssetListHeader, [
  'contextMenuOptions',
  'isCoinListEdited',
  'title',
  'totalValue',
]);
