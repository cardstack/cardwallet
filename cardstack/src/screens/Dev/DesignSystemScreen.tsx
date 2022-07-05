import React, { memo, useState, useCallback } from 'react';
import { Alert, SectionList } from 'react-native';

import {
  Button,
  BiometricSwitch,
  CenteredContainer,
  Container,
  Text,
} from '@cardstack/components';
import { buttonVariants } from '@cardstack/theme';

import { HoldToAuthorizeButton } from '@rainbow-me/components/buttons';

const themes = ['light', 'dark'];

// Not worrying about perfomance and typing as this is a developer feature
const DesignSystemScreen = () => {
  const [loading, setLoading] = useState(false);

  const sections = [
    {
      title: 'Hold to confirm Button',
      data: ['1'],
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

  const renderItem = useCallback(
    ({ item, section: { title } }) => {
      switch (title) {
        case 'Buttons':
          return (
            <CenteredContainer padding={2}>
              <Button variant={item}>{item}</Button>
            </CenteredContainer>
          );
        case 'Hold to confirm Button':
          return (
            <CenteredContainer padding={2}>
              <HoldToAuthorizeButton label="Hold to action" isAuthorizing />
              <Container padding={1} />
              <HoldToAuthorizeButton
                label="Hold to action"
                onPress={() => Alert.alert('long press')}
              />
              <Container padding={1} />
              <Button loading={loading} onLongPress={longPress}>
                Hold to action
              </Button>
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
    [loading]
  );

  return (
    <Container backgroundColor="overlayGray">
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
