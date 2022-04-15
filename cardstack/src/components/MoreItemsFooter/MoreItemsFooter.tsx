import React from 'react';

import { Container, Text } from '@cardstack/components';

interface MoreItemsFooterProps {
  tokens: any[];
  showCount?: number;
}

export const MoreItemsFooter = (props: MoreItemsFooterProps) => {
  const { tokens, showCount = 1 } = props;

  if (tokens.length <= showCount) {
    return null;
  }

  const additionalCount = tokens.length - showCount;
  const itemsText = additionalCount > 1 ? 'items' : 'item';

  return (
    <Container
      width="100%"
      flexDirection="row"
      justifyContent="flex-end"
      paddingHorizontal={5}
    >
      <Text
        variant="subText"
        weight="bold"
      >{`+ ${additionalCount} more ${itemsText}`}</Text>
    </Container>
  );
};
