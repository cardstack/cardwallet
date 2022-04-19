import React, { memo } from 'react';
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

import CardDropImage from '../../assets/email-drop-card.png';

import { strings } from './strings';
import { useRequestPrepaidCardScreen } from './useRequestPrepaidCardScreen';

const RequestPrepaidCardScreen = () => {
  const {
    onSupportLinkPress,
    onSubmitPress,
    onChangeText,
    canSubmit,
    inputHasError,
  } = useRequestPrepaidCardScreen();

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <NavigationStackHeader title={strings.navigation.title} />
      <ScrollView paddingHorizontal={5} showsVerticalScrollIndicator={false}>
        <Pressable onPress={Keyboard.dismiss}>
          <Image alignSelf="center" marginVertical={5} source={CardDropImage} />
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
        </Pressable>
      </ScrollView>
    </Container>
  );
};

export default memo(RequestPrepaidCardScreen);
