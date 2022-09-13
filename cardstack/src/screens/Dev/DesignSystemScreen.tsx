import React, { memo, useState, useCallback } from 'react';
import { Alert, SectionList } from 'react-native';

import {
  Button,
  BiometricSwitch,
  CenteredContainer,
  Container,
  Text,
  SeedPhraseTable,
} from '@cardstack/components';
import SuffixedInput from '@cardstack/components/Input/SuffixedInput/SuffixedInput';
import { cardSpaceDomain } from '@cardstack/constants';
import { buttonVariants } from '@cardstack/theme';

const themes = ['light', 'dark'];

// Not worrying about perfomance and typing as this is a developer feature
const DesignSystemScreen = () => {
  const [loading, setLoading] = useState(false);

  const sections = [
    {
      title: 'Seed Phrase',
      data: ['view', 'edit'],
    },
    {
      title: 'Input',
      data: ['slug'],
    },
    {
      title: 'Button States',
      data: ['longPress', 'loading', 'blocked'],
    },
    {
      title: 'Biometric Switch',
      data: themes,
    },
    {
      title: 'Buttons',
      data: Object.keys(buttonVariants),
    },
  ];

  const longPress = () => {
    setLoading(true);
    Alert.alert('long press');
  };

  const renderButtonStates = useCallback(
    item => {
      switch (item) {
        case 'longPress':
          return (
            <Button loading={loading} onLongPress={longPress}>
              Hold for action
            </Button>
          );
        case 'loading':
          return <Button loading>{item}</Button>;
        case 'blocked':
          return <Button blocked>{item}</Button>;
      }
    },
    [loading]
  );

  const renderItem = useCallback(
    ({ item, section: { title } }) => {
      switch (title) {
        case 'Seed Phrase':
          return (
            <Container padding={2}>
              <SeedPhraseTable
                seedPhrase="bright sell trunk jalopy donut enemy car invest poem"
                mode={item}
              />
            </Container>
          );
        case 'Input':
          return (
            <Container padding={2}>
              <SuffixedInput suffixText={cardSpaceDomain} />
            </Container>
          );
        case 'Buttons':
          return (
            <CenteredContainer padding={2}>
              <Button variant={item}>{item}</Button>
            </CenteredContainer>
          );

        case 'Button States':
          return (
            <CenteredContainer padding={2}>
              {renderButtonStates(item)}
            </CenteredContainer>
          );
        case 'Biometric Switch':
          return (
            <CenteredContainer padding={2}>
              <BiometricSwitch variant={item} />
            </CenteredContainer>
          );
      }
    },
    [renderButtonStates]
  );

  return (
    <Container width="100%" backgroundColor="backgroundDarkPurple">
      <SectionList
        renderItem={renderItem as any}
        sections={sections}
        renderSectionHeader={item => (
          <Container padding={4} backgroundColor="black">
            <Text color="white" fontSize={18}>
              {item.section.title}
            </Text>
          </Container>
        )}
      />
    </Container>
  );
};

export default memo(DesignSystemScreen);
