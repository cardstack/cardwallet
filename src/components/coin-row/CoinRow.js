import React, { createElement } from 'react';
import styled from 'styled-components';

import { CoinIcon, Container } from '@cardstack/components';

import { useAccountSettings } from '@rainbow-me/hooks';

import { CoinIconGroup, CoinIconSize } from '../coin-icon';
import { Column, Row } from '../layout';

const CoinRowVerticalMargin = 12;
const CoinRowPaddingTop = 9;
const CoinRowPaddingBottom = 10;
export const CoinRowHeight =
  CoinIconSize +
  CoinRowPaddingTop +
  CoinRowPaddingBottom +
  CoinRowVerticalMargin * 2;

const Content = styled(Column).attrs({ justify: 'space-between' })`
  flex: 1;
  height: ${CoinIconSize};
  margin-left: 10;
  opacity: ${({ isHidden }) => (isHidden ? 0.4 : 1)};
`;

export default function CoinRow({
  address,
  bottomRowRender,
  children,
  coinIconRender = CoinIcon,
  containerStyles,
  contentStyles,
  isHidden,
  isPinned,
  isPool,
  name,
  symbol,
  testID,
  topRowRender,
  tokens,
  ...props
}) {
  const accountSettings = useAccountSettings();

  return (
    <Container css={containerStyles} flex={-1} flexDirection="row" width="100%">
      {isPool ? (
        <CoinIconGroup tokens={tokens} />
      ) : (
        createElement(coinIconRender, {
          address,
          isHidden,
          isPinned,
          symbol,
          ...accountSettings,
          ...props,
        })
      )}
      <Content isHidden={isHidden} justify="center" style={contentStyles}>
        <Row align="center" testID={`${testID}-${symbol || ''}`}>
          {topRowRender({ name, symbol, ...accountSettings, ...props })}
        </Row>
        <Row align="center" marginBottom={0.5}>
          {bottomRowRender({ symbol, ...accountSettings, ...props })}
        </Row>
      </Content>
      {typeof children === 'function'
        ? children({ symbol, ...props })
        : children}
    </Container>
  );
}
