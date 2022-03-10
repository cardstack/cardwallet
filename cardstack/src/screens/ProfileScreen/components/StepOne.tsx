import React, { useCallback } from 'react';
import { exampleMerchantData, StepActionType, strings } from '.';
import { Button, Container, Text, MerchantSafe } from '@cardstack/components';

export const StepOne = ({ setActiveStep, currentStep }: StepActionType) => {
  const onPressContinue = useCallback(() => {
    setActiveStep?.((currentStep || 0) + 1);
  }, [currentStep, setActiveStep]);

  return (
    <Container
      flexGrow={1}
      flexDirection="column"
      justifyContent="space-between"
      paddingVertical={8}
    >
      <Container>
        <Text color="white" fontWeight="bold" fontSize={20} textAlign="center">
          {strings.createProfile}
        </Text>
        <Text color="grayText" marginTop={8} textAlign="center">
          {strings.createProfileDesc}
        </Text>
      </Container>
      <Container>
        <Text color="white" textAlign="left" paddingLeft={4} marginBottom={1}>
          {strings.example}
        </Text>
        <MerchantSafe
          {...exampleMerchantData}
          disabled
          headerRightText={strings.headerRightText}
        />
      </Container>
      <Container alignItems="center">
        <Button onPress={onPressContinue}>{strings.continueButton}</Button>
      </Container>
    </Container>
  );
};
