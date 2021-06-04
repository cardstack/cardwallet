import React from 'react';
import { Container, Text } from '@cardstack/components';

export default function ExpandedStateSection({ children, title }) {
  return (
    <Container margin={3} paddingHorizontal={3} paddingVertical={2}>
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
}
