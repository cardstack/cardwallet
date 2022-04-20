import { useNavigation } from '@react-navigation/core';
import React, { memo, useMemo } from 'react';
import { Keyboard, Pressable } from 'react-native';

import {
  Button,
  Container,
  FormInput,
  Image,
  InfoBanner,
  NavigationStackHeader,
  ScrollView,
  Text,
} from '@cardstack/components';
import { useBiometricIconProps } from '@cardstack/hooks/useBiometricIconProps';

import CardDropImage from '../../assets/email-drop-card.png';

import { strings } from './strings';
import { useRequestPrepaidCardScreen } from './useRequestPrepaidCardScreen';

const flex = { flex: 1 };

const RequestPrepaidCardScreen = () => {
  const {
    onSupportLinkPress,
    onSubmitPress,
    onChangeText,
    canSubmit,
    inputHasError,
    hasRequested,
    isAuthenticated,
  } = useRequestPrepaidCardScreen();

  const { goBack } = useNavigation();

  const iconProps = useBiometricIconProps();

  const renderRequestedState = useMemo(
    () => (
      <Container flexGrow={0.1} alignItems="center" justifyContent="flex-end">
        <Text color="white" fontWeight="bold">
          {strings.requested.title}
        </Text>
        <Text color="grayText" paddingTop={1}>
          {strings.requested.subtitle}
        </Text>
        <Button marginVertical={10} onPress={goBack}>
          {strings.button.return}
        </Button>
      </Container>
    ),
    [goBack]
  );

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <NavigationStackHeader title={strings.navigation.title} />
      <ScrollView
        paddingHorizontal={5}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!hasRequested}
        contentContainerStyle={flex}
      >
        <Pressable onPress={Keyboard.dismiss} style={flex}>
          <Image alignSelf="center" marginVertical={7} source={CardDropImage} />
          {hasRequested ? (
            renderRequestedState
          ) : (
            <>
              <FormInput
                autoFocus
                isRequired
                isValid={canSubmit}
                autoCorrect={false}
                label={strings.input.label}
                error={inputHasError ? strings.input.error : undefined}
                onSubmitEditing={onSubmitPress}
                onChangeText={onChangeText}
                autoCompleteType="email"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="send"
              />
              <Button
                marginVertical={4}
                variant={!canSubmit ? 'disabledBlack' : undefined}
                onPress={onSubmitPress}
                iconProps={!isAuthenticated ? iconProps : undefined}
              >
                {strings.button.submit}
              </Button>
              <InfoBanner
                marginVertical={4}
                title={strings.termsBanner.title}
                message={strings.termsBanner.message}
              >
                <Text
                  textDecorationLine="underline"
                  color="blueOcean"
                  size="xs"
                  onPress={onSupportLinkPress}
                >
                  {strings.termsBanner.link}
                </Text>
              </InfoBanner>
            </>
          )}
        </Pressable>
      </ScrollView>
    </Container>
  );
};

export default memo(RequestPrepaidCardScreen);
