import React, { useCallback } from 'react';
import { StepActionType, strings } from '.';
import { Button, Container, Text, Input } from '@cardstack/components';
import { avatarColor } from '@cardstack/theme';
import { useAccountProfile } from '@rainbow-me/hooks';
import { ContactAvatar } from '@rainbow-me/components/contacts';

export const StepTwo = ({ setActiveStep, currentStep }: StepActionType) => {
  const { accountColor, accountName } = useAccountProfile();

  const onPressContinue = useCallback(() => {
    setActiveStep?.((currentStep || 0) + 1);
  }, [currentStep, setActiveStep]);

  console.log({ accountColor });

  return (
    <Container
      flexGrow={1}
      flexDirection="column"
      justifyContent="space-between"
      paddingVertical={8}
    >
      <Container>
        <Text color="white" fontWeight="bold" fontSize={20} textAlign="center">
          {strings.nameAndIdForProfile}
        </Text>
        <Text color="grayText" marginTop={1} textAlign="center">
          {strings.profileSubText}
        </Text>
      </Container>
      <Container justifyContent="center" alignItems="center">
        <ContactAvatar
          color={accountColor}
          size="large"
          value={accountName}
          textColor="#fff"
        />
      </Container>
      <Container paddingHorizontal={5}>
        <Text color="white" size="xs" fontWeight="600" marginBottom={2}>
          {strings.businessName}
        </Text>
        <Input
          placeholder="Enter Business Name"
          textContentType="name"
          borderWidth={1}
          borderColor="buttonSecondaryBorder"
          borderRadius={6}
          paddingVertical={3}
          paddingHorizontal={5}
          fontSize={16}
          fontWeight="bold"
          color="grayCardBackground"
        />
        <Text
          marginTop={4}
          color="white"
          size="xs"
          fontWeight="600"
          marginBottom={2}
        >
          {strings.uniqueId}
        </Text>
        <Input
          placeholder="Enter Unique ID"
          textContentType="username"
          borderWidth={1}
          borderColor="buttonSecondaryBorder"
          borderRadius={6}
          paddingVertical={3}
          paddingHorizontal={5}
          fontSize={16}
          fontWeight="bold"
          color="grayCardBackground"
        />
        <Text size="xxs" color="grayText" textAlign="left" marginTop={1}>
          {strings.unqiueIdDescription}
        </Text>
        <Text
          marginTop={6}
          color="white"
          size="xs"
          fontWeight="600"
          marginBottom={2}
        >
          {strings.uniqueId}
        </Text>
        <Container flexDirection="row">
          <Container
            width={30}
            height={30}
            borderRadius={4}
            backgroundColor="white"
            borderWidth={1}
            borderColor="buttonSecondaryBorder"
            justifyContent="center"
            alignItems="center"
          >
            <Container
              width={20}
              height={20}
              style={{ backgroundColor: avatarColor[accountColor] }}
            />
          </Container>
          <Container marginLeft={2}>
            <Text color="white" size="body" fontWeight="600" lineHeight={30}>
              {avatarColor[accountColor]}
            </Text>
          </Container>
        </Container>
      </Container>
      <Container alignItems="center">
        <Button onPress={onPressContinue}>{strings.continueButton}</Button>
      </Container>
    </Container>
  );
};
