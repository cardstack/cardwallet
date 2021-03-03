import React, { createElement, Fragment } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components';
import { useDimensions } from '../../hooks';
import Divider from '../Divider';
import { ContextMenu } from '../context-menu';
import { Row } from '../layout';
import SavingsListHeader from '../savings/SavingsListHeader';
import { Text } from '@cardstack/components';
import { colors as cardstackColors } from '@cardstack/theme';
import { padding, position } from '@rainbow-me/styles';

export const ListHeaderHeight = 44;

const BackgroundGradient = styled(LinearGradient).attrs(
  ({ theme: { colors } }) => ({
    colors: [
      colors.listHeaders.firstGradient,
      colors.listHeaders.secondGradient,
      colors.listHeaders.thirdGradient,
    ],
    end: { x: 0, y: 0 },
    pointerEvents: 'none',
    start: { x: 0, y: 0.5 },
  })
)`
  ${position.cover};
`;

const Content = styled(Row).attrs({
  align: 'center',
  justify: 'space-between',
})`
  ${padding(0, 19, 2)};
  background-color: ${cardstackColors.backgroundBlue};
  height: ${ListHeaderHeight};
  width: 100%;
`;

const StickyBackgroundBlocker = styled.View`
  height: ${({ isEditMode }) => (isEditMode ? ListHeaderHeight : 0)};
  top: ${({ isEditMode }) => (isEditMode ? -40 : 0)};
  width: ${({ deviceDimensions }) => deviceDimensions.width};
`;

export default function ListHeader({
  children,
  contextMenuOptions,
  isCoinListEdited,
  isSticky,
  showDivider = true,
  title,
  titleRenderer = Text,
  totalValue,
}) {
  const deviceDimensions = useDimensions();

  if (title === 'Pools') {
    return (
      <SavingsListHeader
        emoji="whale"
        isOpen={false}
        onPress={() => {}}
        savingsSumValue={totalValue}
        showSumValue
        title="Pools"
      />
    );
  } else {
    return (
      <Fragment>
        {/* <BackgroundGradient /> */}
        <Content isSticky={isSticky}>
          {createElement(titleRenderer, {
            children: title,
            color: 'white',
            fontSize: 20,
          })}
          <Row align="center">
            {children}
            <ContextMenu marginTop={3} {...contextMenuOptions} />
          </Row>
        </Content>
        {showDivider && <Divider />}
        {!isSticky && title !== 'Balances' && (
          <StickyBackgroundBlocker
            deviceDimensions={deviceDimensions}
            isEditMode={isCoinListEdited}
          />
        )}
      </Fragment>
    );
  }
}
