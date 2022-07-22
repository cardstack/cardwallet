import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import {
  Button,
  Container,
  Icon,
  IconName,
  Image,
  SafeAreaView,
  Text,
  Touchable,
} from '@cardstack/components';

import profilePreview from '../../../assets/profile-preview.png';

import strings from './strings';
import usePurchaseCTAScreen from './usePurchaseCTAScreen';

const LOCALIZED_PRICE = '$0.99';

interface BenefitsItem {
  iconName: IconName;
  copy: string;
}

const PurchaseCTAScreen = () => {
  const {
    onPressSkip,
    goBack,
    onPressChargeExplanation,
    onPressBuy,
  } = usePurchaseCTAScreen();

  const BenefitsItem = useCallback(
    ({ iconName, copy }: BenefitsItem) => (
      <Container alignItems="center" flexDirection="row">
        <Icon
          name={iconName}
          color="teal"
          size={22}
          marginRight={5}
          marginLeft={4}
        />
        <Text color="white" fontSize={14} fontFamily="OpenSans-Regular">
          {copy}
        </Text>
      </Container>
    ),
    []
  );

  return (
    <SafeAreaView
      backgroundColor="backgroundDarkPurple"
      flex={1}
      paddingHorizontal={5}
    >
      <Container
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        flex={0.1}
      >
        <Touchable onPress={goBack}>
          <Icon name="chevron-left" color="teal" size={30} />
        </Touchable>
        <Touchable onPress={onPressSkip}>
          <Text fontSize={13} color="teal" fontFamily="OpenSans-Semibold">
            {strings.skip}
          </Text>
        </Touchable>
      </Container>
      <Container
        flex={1}
        flexDirection="column"
        justifyContent="space-between"
        paddingBottom={3}
      >
        <Text
          color="white"
          fontSize={24}
          fontFamily="OpenSans-Light"
          paddingLeft={2}
        >
          {strings.title}
        </Text>
        <Container
          flexDirection="column"
          justifyContent="space-between"
          flex={0.25}
          paddingLeft={2}
        >
          <BenefitsItem iconName="pay" copy={strings.benefits.payments} />
          <BenefitsItem iconName="house" copy={strings.benefits.cardProfile} />
          <BenefitsItem iconName="rewards" copy={strings.benefits.rewards} />
        </Container>
        <Image
          source={profilePreview}
          style={styles.iapPreview}
          resizeMode="contain"
        />
        <Button onPress={onPressBuy}>
          {strings.button}
          {LOCALIZED_PRICE}
        </Button>
        <Touchable onPress={onPressChargeExplanation} alignSelf="center">
          <Text color="white" fontSize={16} fontFamily="OpenSans-Semibold">
            {strings.whyCharge}
          </Text>
        </Touchable>
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iapPreview: { width: '100%', flex: 0.5 },
});

export default PurchaseCTAScreen;
