import React, { useCallback } from 'react';

import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { useDimensions } from '../../hooks';
import { ButtonPressAnimation } from '../animations';
import { Centered, Column, Row } from '../layout';
import { Icon, Text } from '@cardstack/components';

const KeyboardButtonContent = styled(Centered)`
  height: ${({ height }) => height};
  transform: scale(0.5);
  width: 80;
`;

const KeyboardRow = styled(Row).attrs({
  align: 'center',
  justify: 'space-between',
})`
  width: 100%;
`;

const KeyboardButton = ({ children, ...props }) => {
  const { isTinyPhone } = useDimensions();
  const keyHeight = isTinyPhone ? 60 : 64;

  return (
    <ButtonPressAnimation
      {...props}
      duration={35}
      pressOutDuration={75}
      scaleTo={1.6}
      transformOrigin={[0.5, 0.5 + 8 / keyHeight]}
    >
      <KeyboardButtonContent height={keyHeight}>
        {children}
      </KeyboardButtonContent>
    </ButtonPressAnimation>
  );
};

const Numpad = ({ decimal = true, onPress, width }) => {
  const renderCell = useCallback(
    symbol => (
      <KeyboardButton
        key={symbol}
        onPress={() => onPress(symbol.toString())}
        testID={`numpad-button-${symbol}`}
      >
        <Text fontSize={44} fontWeight="600" textAlign="center">
          {symbol}
        </Text>
      </KeyboardButton>
    ),
    [onPress]
  );

  const renderRow = useCallback(
    cells => <KeyboardRow>{cells.map(renderCell)}</KeyboardRow>,
    [renderCell]
  );

  return (
    <Centered direction="column" width={width}>
      {renderRow([1, 2, 3])}
      {renderRow([4, 5, 6])}
      {renderRow([7, 8, 9])}
      <KeyboardRow>
        {decimal ? renderCell('.') : <Column width={80} />}
        {renderCell(0)}
        <KeyboardButton onPress={() => onPress('back')}>
          <Icon color="black" name="delete" size={55} textAlign="center" />
        </KeyboardButton>
      </KeyboardRow>
    </Centered>
  );
};

export default Numpad;
