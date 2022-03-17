import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/core';
import { useProfileForm } from '../useProfileForm';
import { exampleMerchantData, strings } from '.';
import { Button, Container, MerchantSafe, Text } from '@cardstack/components';
import { MainRoutes } from '@cardstack/navigation';

const CreateProfileFeeInSpend = 100;

export const StepThree = () => {
  const {
    businessColor,
    businessName,
    businessId,
    selectedPrepaidCard,
    setPrepaidCard,
  } = useProfileForm();

  const { navigate } = useNavigation();

  const newMerchantInfo = useMemo(
    () => ({
      color: businessColor,
      name: businessName,
      did: '',
      textColor: '#fff',
      slug: businessId,
      ownerAddress: '',
    }),
    [businessColor, businessId, businessName]
  );

  const onPressCreate = useCallback(() => {
    if (selectedPrepaidCard) {
      // ToDo: Navigate to confirmation sheet, need to redesign this as well
    } else {
      navigate(MainRoutes.CHOOSE_PREPAIDCARD_SHEET, {
        spendAmount: CreateProfileFeeInSpend,
        onConfirmChoosePrepaidCard: setPrepaidCard,
      });
    }
  }, [navigate, selectedPrepaidCard, setPrepaidCard]);

  return (
    <>
      <Container>
        <Text color="white" fontWeight="bold" fontSize={20} textAlign="center">
          {strings.review}
        </Text>
        <Text
          color="grayText"
          marginTop={2}
          textAlign="center"
          paddingHorizontal={10}
        >
          {strings.reviewDescription}
        </Text>
      </Container>
      <Container paddingTop={2}>
        <Text color="white" textAlign="left" paddingLeft={4} marginBottom={1}>
          {strings.yourProfile}
        </Text>
        <MerchantSafe
          {...exampleMerchantData}
          address="" // No address here as didn't create profile yet, it's preview
          merchantInfo={newMerchantInfo}
          disabled
          headerRightText={strings.headerRightText}
        />
      </Container>
      <Container alignItems="center">
        <Button onPress={onPressCreate}>
          {selectedPrepaidCard ? strings.create : strings.choosePrepaidCard}
        </Button>
      </Container>
    </>
  );
};
