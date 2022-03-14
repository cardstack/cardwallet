import React, { useCallback } from 'react';
import { exampleMerchantData, StepActionType, strings } from '.';
import {
  Button,
  Container,
  Text,
  MerchantSafe,
  ScrollView,
} from '@cardstack/components';

export const StepOne = ({ goToNextStep }: StepActionType) => {
  const onPressContinue = useCallback(() => {
    goToNextStep?.();
  }, [goToNextStep]);

  return (
    <Container
      flex={1}
      flexGrow={1}
      flexDirection="column"
      justifyContent="space-between"
    >
      <ScrollView flexGrow={1}>
        <Container>
          <Text
            color="white"
            fontWeight="bold"
            fontSize={20}
            textAlign="center"
          >
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
      </ScrollView>
      <Container alignItems="center" paddingTop={4}>
        <Button onPress={onPressContinue}>{strings.continueButton}</Button>
      </Container>
    </Container>
  );
};
