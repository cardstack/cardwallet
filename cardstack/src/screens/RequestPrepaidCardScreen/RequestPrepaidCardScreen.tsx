import { convertToSpend } from '@cardstack/cardpay-sdk';
import React, { memo } from 'react';
import { Keyboard, Pressable } from 'react-native';

import {
  Button,
  Container,
  FormInput,
  InfoBanner,
  NavigationStackHeader,
  ScrollView,
  Text,
} from '@cardstack/components';
import MediumPrepaidCard from '@cardstack/components/PrepaidCard/MediumPrepaidCard';

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
          <CardPlaceholder />
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

// TODO: Replace with correct design
const CardPlaceholder = memo(() => (
  <Container
    width="70%"
    justifyContent="center"
    paddingVertical={5}
    alignSelf="center"
  >
    <MediumPrepaidCard
      networkName="Gnosis Chain"
      nativeCurrency="USD"
      //@ts-expect-error no currency needed
      currencyConversionRates=""
      address="0xXXXX…XXXX"
      spendFaceValue={convertToSpend(2, 'USD', 1)}
      transferrable={false}
      cardCustomization={{
        background: 'linear-gradient(139.27deg, #00ebe5 34%, #c3fc33 70%)',
        issuerName: 'Cardstack',
        patternColor: 'white',
        patternUrl:
          'https://app.cardstack.com/images/prepaid-card-customizations/pattern-5.svg',
        textColor: 'black',
      }}
    />
  </Container>
));
