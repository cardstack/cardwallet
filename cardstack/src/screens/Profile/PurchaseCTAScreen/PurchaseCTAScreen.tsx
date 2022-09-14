import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import {
  Button,
  Container,
  Icon,
  IconName,
  Image,
  Text,
  Touchable,
  PageWithStackHeader,
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
    triggerSkipProfileCreation,
  } = usePurchaseCTAScreen();

  const purchaseBtnLabel = `${strings.button.purchase} ${localizedValue}`;

  const FooterComponent = useMemo(
    () => (
      <>
        <Button onPress={onPressBuy} blocked={inPurchaseOngoing}>
          {purchaseBtnLabel}
        </Button>
        {showPrepaidCardOption && (
          <Button
            onPress={onPressPrepaidCards}
            variant="primaryWhite"
            borderColor="teal"
            blocked={inPurchaseOngoing}
            marginTop={5}
          >
            {strings.button.prepaidCard}
          </Button>
        )}
        <Touchable
          onPress={onPressChargeExplanation}
          alignSelf="center"
          disabled={inPurchaseOngoing}
          paddingVertical={5}
        >
          <Text color="white" fontSize={16} weight="semibold">
            {strings.whyCharge}
          </Text>
        </Touchable>
      </>
    ),
    [
      inPurchaseOngoing,
      purchaseBtnLabel,
      showPrepaidCardOption,
      onPressChargeExplanation,
      onPressBuy,
      onPressPrepaidCards,
    ]
  );

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

  return (
    <PageWithStackHeader
      skipPressCallback={triggerSkipProfileCreation}
      footer={FooterComponent}
    >
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
      </Container>
    </PageWithStackHeader>
  );
};

const styles = StyleSheet.create({
  iapPreview: { width: '100%', flex: 0.5 },
});

export default PurchaseCTAScreen;
