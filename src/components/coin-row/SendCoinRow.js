import { get } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import { useTheme } from '../../context/ThemeContext';
import { buildAssetUniqueIdentifier } from '../../helpers/assets';
import { deviceUtils, magicMemo } from '../../utils';

import { Text } from '../text';
import CoinName from './CoinName';
import CoinRow from './CoinRow';
import { AnimatedPressable, CenteredContainer } from '@cardstack/components';

const isTinyPhone = deviceUtils.dimensions.height <= 568;
const selectedHeight = isTinyPhone ? 62 : 78;

const BottomRow = ({ balance, native }) => {
  const { colors } = useTheme();

  const hasNativeBalance = !!parseFloat(native?.balance?.amount);

  const fiatValue = hasNativeBalance
    ? `≈ ${get(native, 'balance.display')}`
    : '';

  return (
    <Text color={colors.alpha(colors.blueGreyDark, 0.5)} size="smedium">
      {get(balance, 'display')} {fiatValue}
    </Text>
  );
};

const TopRow = ({ name, selected }) => (
  <CoinName weight={selected ? 'semibold' : 'regular'}>{name}</CoinName>
);

const SendCoinRow = magicMemo(
  ({ item, onPress, rowHeight, selected, testID, ...props }) => (
    <AnimatedPressable height={rowHeight} onPress={onPress}>
      <CenteredContainer height={selectedHeight} padding={4}>
        <CoinRow
          {...item}
          {...props}
          bottomRowRender={BottomRow}
          isHidden={false}
          selected={selected}
          testID={testID}
          topRowRender={TopRow}
        />
      </CenteredContainer>
    </AnimatedPressable>
  ),
  ['item', 'selected'],
  buildAssetUniqueIdentifier
);

SendCoinRow.displayName = 'SendCoinRow';

SendCoinRow.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
  rowHeight: PropTypes.number,
  selected: PropTypes.bool,
};

SendCoinRow.selectedHeight = selectedHeight;

export default SendCoinRow;
