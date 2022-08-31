import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Button,
  Container,
  Icon,
  IconName,
  Image,
  Text,
  Touchable,
  NavigationStackHeader,
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
    inPurchaseOngoing,
    localizedValue,
    onPressPrepaidCards,
    showPrepaidCardOption,
    onSkipPress,
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

  // handles SafeAreaView bottom spacing for consistency
  const { bottom } = useSafeAreaInsets();

  const containerStyles = useMemo(
    () => ({
      paddingBottom: bottom,
    }),
    [bottom]
  );

  return (
    <Container
      flex={1}
      style={containerStyles}
      backgroundColor="backgroundDarkPurple"
    >
      <NavigationStackHeader
        onSkipPress={onSkipPress}
        backgroundColor="backgroundDarkPurple"
        leftIconProps={{ iconSize: 'small' }}
      />
      <Container
        flex={1}
        flexDirection="column"
        justifyContent="space-between"
        paddingBottom={3}
        paddingHorizontal={5}
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
        <Button onPress={onPressBuy} blocked={inPurchaseOngoing}>
          {purchaseBtnLabel}
        </Button>
        {showPrepaidCardOption && (
          <Button
            onPress={onPressPrepaidCards}
            variant="primaryWhite"
            borderColor="teal"
            blocked={inPurchaseOngoing}
          >
            {strings.button.prepaidCard}
          </Button>
        )}
        <Touchable
          onPress={onPressChargeExplanation}
          alignSelf="center"
          disabled={inPurchaseOngoing}
        >
          <Text color="white" fontSize={16} weight="semibold">
            {strings.whyCharge}
          </Text>
        </Touchable>
      </Container>
    </Container>
  );
};

const styles = StyleSheet.create({
  iapPreview: { width: '100%', flex: 0.5 },
});

export default PurchaseCTAScreen;
