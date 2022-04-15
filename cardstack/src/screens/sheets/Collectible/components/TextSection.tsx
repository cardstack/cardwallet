import React, { memo } from 'react';

import { Container, Text } from '@cardstack/components';

interface TextSectionProps {
  title: string;
  children: React.ReactNode | string;
}

const TextSection = ({ children, title }: TextSectionProps) => (
  <Container margin={3} padding={3}>
    <Text marginBottom={2} size="medium" weight="extraBold">
      {title}
    </Text>
    {typeof children === 'string' ? (
      <Text variant="subText">{children}</Text>
    ) : (
      children
    )}
  </Container>
);

export default memo(TextSection);
