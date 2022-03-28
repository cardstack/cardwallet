import React, { memo } from 'react';
import { SectionHeaderText } from './SectionHeaderText';
import {
  Container,
  CenteredContainer,
  Text,
  CoinIcon,
} from '@cardstack/components';

interface SectionIconTitleProps {
  title: string;
  symbol: string;
  primaryText: string;
  secondaryText: string;
}

export const SectionCoinHeader = memo(
  ({ title, symbol, primaryText, secondaryText }: SectionIconTitleProps) => (
    <Container marginTop={8} width="100%">
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
