import { get } from 'lodash';
import PropTypes from 'prop-types';
import React, { memo } from 'react';

import { AnimatedPressable, CenteredContainer } from '@cardstack/components';

import colors from '@rainbow-me/styles/colors';

import { deviceUtils } from '../../utils';
import { Text } from '../text';

import CoinName from './CoinName';
import CoinRow from './CoinRow';

const isTinyPhone = deviceUtils.dimensions.height <= 568;
const selectedHeight = isTinyPhone ? 62 : 78;

const BottomRow = ({ balance, native }) => {
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

const SendCoinRow = memo(
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
  )
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
