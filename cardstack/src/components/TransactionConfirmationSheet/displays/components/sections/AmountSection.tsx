import React, { memo } from 'react';
import { SectionHeaderText } from '../SectionHeaderText';
import { Container, Text } from '@cardstack/components';

interface AmountSectionProps {
  title: string;
  data: Array<{
    description: string | undefined;
    valueDisplay: string | undefined;
  }>;
}

export const AmountSection = memo(({ title, data }: AmountSectionProps) => (
  <Container>
    <SectionHeaderText>{title}</SectionHeaderText>
    <Container marginLeft={15} marginTop={2}>
      {data.map(item => (
        <>
          <Text size="xxs">{item.description}</Text>
          <Text size="body" weight="bold" paddingBottom={3}>
            {item.valueDisplay}
          </Text>
        </>
      ))}
    </Container>
  </Container>
));
