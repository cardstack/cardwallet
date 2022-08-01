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
  InPageHeader,
} from '@cardstack/components';

import profilePreview from '../../../assets/profile-preview.png';

import { strings } from './strings';
import { usePurchaseCTAScreen } from './usePurchaseCTAScreen';

interface BenefitsItem {
  iconName: IconName;
  copy: string;
}

const PurchaseCTAScreen = () => {
  const {
    onPressChargeExplanation,
    onPressBuy,
    localizedValue,
    onPressPrepaidCards,
    showPrepaidCardOption,
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
        <Text color="white" fontSize={14}>
          {copy}
        </Text>
      </Container>
    ),
    []
  );

  const purchaseBtnLabel = `${strings.button.purchase} ${localizedValue}`;

  return (
    <SafeAreaView
      backgroundColor="backgroundDarkPurple"
      flex={1}
      paddingHorizontal={5}
    >
      <InPageHeader skipAmount={3} />
      <Container
        flex={1}
        flexDirection="column"
        justifyContent="space-between"
        paddingBottom={3}
      >
        <Text color="white" fontSize={24} fontFamily="OpenSans-Light">
          {strings.title}
        </Text>
        <Container
          flexDirection="column"
          justifyContent="space-between"
          flex={0.25}
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
        <Button onPress={onPressBuy}>{purchaseBtnLabel}</Button>
        {showPrepaidCardOption && (
          <Button
            onPress={onPressPrepaidCards}
            variant="primaryWhite"
            borderColor="teal"
          >
            {strings.button.prepaidCard}
          </Button>
        )}
        <Touchable onPress={onPressChargeExplanation} alignSelf="center">
          <Text color="white" fontSize={16} weight="semibold">
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
