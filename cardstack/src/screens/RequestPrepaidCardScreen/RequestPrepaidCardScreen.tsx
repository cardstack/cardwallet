import { useNavigation } from '@react-navigation/native';
import React, { memo, useMemo } from 'react';
import { Keyboard, Pressable } from 'react-native';

import {
  Button,
  Container,
  Checkbox,
  FormInput,
  Image,
  InfoBanner,
  NavigationStackHeader,
  ScrollView,
  Text,
} from '@cardstack/components';

import CardDropImage from '../../assets/email-drop-card.png';

import { strings } from './strings';
import { useRequestPrepaidCardScreen } from './useRequestPrepaidCardScreen';

const flex = { flex: 1 };

const RequestPrepaidCardScreen = () => {
  const {
    onSupportLinkPress,
    onSubmitPress,
    onChangeText,
    inputValid,
    inputHasError,
    canSubmit,
    hasRequested,
    email,
    isLoading,
    onTermsAcceptToggle,
  } = useRequestPrepaidCardScreen();

  const { goBack } = useNavigation();

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
      >
        <Pressable onPress={Keyboard.dismiss} style={flex}>
          <Image alignSelf="center" marginVertical={7} source={CardDropImage} />
          {hasRequested ? (
            renderRequestedState
          ) : (
            <>
              <FormInput
                isRequired
                isValid={inputValid}
                autoCorrect={false}
                label={strings.input.label}
                error={inputHasError ? strings.input.error : undefined}
                onChangeText={onChangeText}
                autoComplete="email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                editable={!isLoading}
              />
              <Checkbox onPress={onTermsAcceptToggle} checkboxPosition="left">
                <Text size="xs" marginRight={6} color="white">
                  {strings.termsCheckbox}
                </Text>
              </Checkbox>
              <Button
                marginVertical={4}
                variant={!canSubmit ? 'disabledBlack' : undefined}
                onPress={onSubmitPress}
                disablePress={isLoading}
                loading={isLoading}
              >
                {strings.button.submit}
              </Button>
              <InfoBanner
                marginVertical={4}
                title={strings.termsBanner.title}
                message={strings.termsBanner.message}
              >
                <Text size="xxs" color="secondaryText" paddingTop={3}>
                  {strings.termsBanner.messageNote}{' '}
                  <Text
                    size="xxs"
                    textDecorationLine="underline"
                    color="blueOcean"
                    onPress={onSupportLinkPress}
                  >
                    {strings.termsBanner.link.text}
                  </Text>
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
