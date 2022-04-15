import React, { memo, useCallback } from 'react';
import { SectionList } from 'react-native';

import {
  Button,
  CenteredContainer,
  Container,
  Text,
} from '@cardstack/components';
import { buttonVariants } from '@cardstack/theme';

// Not worrying about perfomance and typing as this is a developer feature
const DesignSystemScreen = () => {
  const sections = [
    {
      title: 'Buttons',
      data: Object.keys(buttonVariants),
    },
  ];

  const renderItem = useCallback(({ item, section: { title } }) => {
    switch (title) {
      case 'Buttons':
        return (
          <CenteredContainer padding={2} backgroundColor="overlayGray">
            <Button variant={item}>{item}</Button>
          </CenteredContainer>
        );
    }
  }, []);

  return (
    <SectionList
      renderItem={renderItem as any}
      sections={sections}
      renderSectionHeader={item => (
        <Container padding={4} backgroundColor="black">
          <Text color="white" fontSize={20}>
            {item.section.title}
          </Text>
        </Container>
      )}
    />
  );
};

export default memo(DesignSystemScreen);
