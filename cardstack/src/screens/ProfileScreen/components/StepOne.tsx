import React from 'react';
import { exampleMerchantData, strings } from '.';
import {
  Button,
  Container,
  MerchantSafe,
  ProgressStepProps,
  Text,
} from '@cardstack/components';

export const StepOne = ({ goToNextStep }: ProgressStepProps) => {
  return (
    <>
      <Container maxWidth={300} alignSelf="center">
        <Text color="white" fontWeight="bold" fontSize={20} textAlign="center">
          {strings.stepOne.createProfile}
        </Text>
        <Text color="grayText" marginTop={10} textAlign="center">
          {strings.stepOne.createProfileDesc}
        </Text>
      </Container>
      <Container>
        <Text color="white" textAlign="left" paddingLeft={4} marginVertical={2}>
          {strings.stepOne.example}
        </Text>
        <MerchantSafe
          {...exampleMerchantData}
          disabled
          headerRightText={strings.header.profile}
        />
      </Container>
      <Container alignItems="center">
        <Button onPress={goToNextStep}>{strings.buttons.continue}</Button>
      </Container>
    </>
  );
};
