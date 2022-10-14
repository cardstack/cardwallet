import React, { memo, useState, useCallback } from 'react';
import { Alert, SectionList } from 'react-native';

import {
  Button,
  BiometricSwitch,
  CenteredContainer,
  Container,
  Text,
  SeedPhraseTable,
  SuffixedInput,
  PhraseInput,
} from '@cardstack/components';
import { cardSpaceDomain } from '@cardstack/constants';
import { buttonVariants } from '@cardstack/theme';

const themes = ['light', 'dark'];

// Not worrying about perfomance and typing as this is a developer feature
const DesignSystemScreen = () => {
  const [loading, setLoading] = useState(false);

  const sections = [
    {
      title: 'Input',
      data: ['slug', 'viewOnly', 'phrase'],
    },
    {
      title: 'Seed Phrase',
      data: ['view', 'edit', 'editBlur', 'error'],
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

  const renderSeedPhraseStates = useCallback(item => {
    switch (item) {
      case 'edit':
        return (
          <SeedPhraseTable seedPhrase="bright sell trunk jalopy donut enemy car invest" />
        );
      case 'editBlur':
        return (
          <SeedPhraseTable
            seedPhrase="bright sell trunk jalopy donut enemy car invest"
            hideOnOpen
          />
        );
      case 'error':
        return (
          <SeedPhraseTable
            seedPhrase="bright sell trunk jalopy donut enemy car invest donut enemy car invest"
            showAsError
          />
        );
      case 'view':
        return (
          <SeedPhraseTable
            seedPhrase="bright sell trunk jalopy donut enemy car invest donut enemy car invest"
            hideOnOpen
            allowCopy
          />
        );
    }
  }, []);

  const renderInputVariants = useCallback(item => {
    switch (item) {
      case 'viewOnly':
        return (
          <SuffixedInput
            value="Mandello123"
            suffixText={cardSpaceDomain}
            readOnly
          />
        );
      case 'phrase':
        return <PhraseInput isValid placeholder="Enter your seed phrase" />;
      default:
        return <SuffixedInput suffixText={cardSpaceDomain} />;
    }
  }, []);

  const renderItem = useCallback(
    ({ item, section: { title } }) => {
      switch (title) {
        case 'Seed Phrase':
          return (
            <Container padding={2}>{renderSeedPhraseStates(item)}</Container>
          );
        case 'Input':
          return <Container padding={2}>{renderInputVariants(item)}</Container>;
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
    [renderButtonStates, renderSeedPhraseStates, renderInputVariants]
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
