import React, { createElement, Fragment, useCallback } from 'react';
import { LayoutAnimation } from 'react-native';
import styled from 'styled-components';

import { useCoinListEditOptions, useDimensions } from '../../hooks';
import { ContextMenu } from '../context-menu';
import { Row } from '../layout';
import SavingsListHeader from '../savings/SavingsListHeader';
import { Button, Text } from '@cardstack/components';
import { colors as cardstackColors } from '@cardstack/theme';
import { padding } from '@rainbow-me/styles';

export const ListHeaderHeight = 44;

const Content = styled(Row).attrs({
  align: 'center',
  justify: 'space-between',
})`
  ${padding(0, 20, 2)};
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
  title,
  titleRenderer = Text,
  totalValue,
}) {
  const deviceDimensions = useDimensions();
  const { setIsCoinListEdited } = useCoinListEditOptions();
  const handlePress = useCallback(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    );
    setIsCoinListEdited(false);
  }, [setIsCoinListEdited]);

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
        <Content isSticky={isSticky}>
          {createElement(titleRenderer, {
            children: title,
            color: 'white',
            fontSize: 20,
          })}
          <Row align="center">
            {isCoinListEdited ? (
              <Button onPress={handlePress} variant="extraSmall">
                Done
              </Button>
            ) : (
              <>
                {children}
                <ContextMenu marginTop={3} {...contextMenuOptions} />
              </>
            )}
          </Row>
        </Content>
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
