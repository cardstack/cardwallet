import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';

import { Button, Container, MerchantSafe, Text } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';

import { strings, exampleMerchantData } from './';

const merchantContainerProps = {
  paddingHorizontal: undefined,
  flex: 0.1,
};

export const CreateProfile = () => {
  const { navigate } = useNavigation();

  const onPressContinue = useCallback(() => {
    navigate(Routes.PROFILE_SLUG);
  }, [navigate]);

  return (
    <Container flex={1} justifyContent="space-around">
      <Container flex={0.8}>
        <Container
          flex={0.4}
          justifyContent="space-evenly"
          paddingHorizontal={5}
        >
          <Text
            color="white"
            fontWeight="bold"
            fontSize={20}
            textAlign="center"
          >
            {strings.createProfile}
          </Text>
          <Text color="grayText" textAlign="center">
            {strings.createProfileDesc}
          </Text>
        </Container>
        <Container flex={1} paddingHorizontal={4}>
          <Text color="white" textAlign="left" paddingBottom={4}>
            {strings.example}
          </Text>
          <MerchantSafe
            {...exampleMerchantData}
            disabled
            headerRightText={strings.header.profile}
            containerProps={merchantContainerProps}
          />
        </Container>
      </Container>
      <Button
        paddingHorizontal={4}
        alignSelf="center"
        onPress={onPressContinue}
      >
        {strings.buttons.continue}
      </Button>
    </Container>
  );
};
