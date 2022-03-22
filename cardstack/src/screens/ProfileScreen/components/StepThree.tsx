import React from 'react';

import { useProfileForm } from '../useProfileForm';
import { exampleMerchantData, strings } from '.';
import { Button, Container, MerchantSafe, Text } from '@cardstack/components';

export const StepThree = () => {
  const { newMerchantInfo, onPressCreate } = useProfileForm();

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
        <Button onPress={onPressCreate}>{strings.create}</Button>
      </Container>
    </>
  );
};
