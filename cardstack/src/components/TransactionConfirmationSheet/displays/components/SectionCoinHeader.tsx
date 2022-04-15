import React, { memo } from 'react';

import {
  Container,
  CenteredContainer,
  ContainerProps,
  Text,
  CoinIcon,
} from '@cardstack/components';

import { SectionHeaderText } from './SectionHeaderText';

interface SectionIconTitleProps extends ContainerProps {
  title: string;
  symbol: string;
  primaryText: string;
  secondaryText: string;
}

export const SectionCoinHeader = memo(
  ({
    title,
    symbol,
    primaryText,
    secondaryText,
    ...rest
  }: SectionIconTitleProps) => (
    <Container width="100%" {...rest}>
      <SectionHeaderText>{title}</SectionHeaderText>
      <Container paddingHorizontal={2} marginTop={4}>
        <Container flexDirection="row">
          <CenteredContainer>
            <CoinIcon symbol={symbol} size={40} />
          </CenteredContainer>
          <Container
            paddingLeft={3}
            flexDirection="column"
            alignItems="flex-start"
            flex={1}
          >
            <Text size="large" weight="extraBold">
              {primaryText}
            </Text>
            <Text variant="subText">{secondaryText}</Text>
          </Container>
        </Container>
      </Container>
    </Container>
  )
);
