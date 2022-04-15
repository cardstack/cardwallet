import React, { memo, useCallback } from 'react';

import { Container, Skeleton, Text } from '@cardstack/components';

import { SectionHeaderText } from '../SectionHeaderText';

interface AmountSectionProps {
  title: string;
  data: Array<{
    description?: string;
    valueDisplay?: string;
  }>;
  showLoading?: boolean;
}

export const AmountSection = memo(
  ({ title, data, showLoading }: AmountSectionProps) => {
    const renderItemOrLoad = useCallback(
      item =>
        showLoading ? (
          <>
            <Skeleton width="20%" height={10} light marginBottom={1} />
            <Skeleton width="50%" height={30} light marginBottom={1} />
          </>
        ) : (
          <>
            <Text size="xxs">{item.description}</Text>
            <Text size="body" weight="bold" paddingBottom={3}>
              {item.valueDisplay}
            </Text>
          </>
        ),
      [showLoading]
    );

    return (
      <>
        <SectionHeaderText>{title}</SectionHeaderText>
        <Container marginLeft={15} marginTop={2}>
          {data.map(renderItemOrLoad)}
        </Container>
      </>
    );
  }
);
