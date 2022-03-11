import React, { useCallback, useState } from 'react';
import { useProfileForm } from '../helper';
import { StepActionType, strings } from '.';
import { Button, Container, Text, Input } from '@cardstack/components';
import { useAccountProfile } from '@rainbow-me/hooks';
import { ContactAvatar } from '@rainbow-me/components/contacts';

export const StepTwo = ({ setActiveStep, currentStep }: StepActionType) => {
  const { accountName } = useAccountProfile();
  const [isSubmitPressed, setIsSubmitPressed] = useState(false);

  const {
    businessColor,
    businessName,
    businessId,
    onChangeBusinessName,
    onChangeBusinessId,
    isUniqueId,
    errors,
  } = useProfileForm();

  const onPressContinue = useCallback(() => {
    setIsSubmitPressed(true);

    if (isUniqueId && !errors?.businessId && !errors?.businessName) {
      setActiveStep?.((currentStep || 0) + 1);
    }
  }, [currentStep, errors, isUniqueId, setActiveStep]);

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
          color={businessColor}
          size="large"
          value={businessName || accountName}
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
          borderColor={
            errors?.businessName && isSubmitPressed
              ? 'error'
              : 'buttonSecondaryBorder'
          }
          borderRadius={6}
          paddingVertical={3}
          paddingHorizontal={5}
          fontSize={16}
          fontWeight="bold"
          color="grayCardBackground"
          value={businessName}
          onChange={onChangeBusinessName}
          autoFocus
          spellCheck={false}
          autoCorrect={false}
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
          autoCapitalize="none"
          placeholder="Enter Unique ID"
          textContentType="username"
          borderWidth={1}
          borderColor={
            (errors?.businessId || !isUniqueId) && isSubmitPressed
              ? 'error'
              : 'buttonSecondaryBorder'
          }
          borderRadius={6}
          paddingVertical={3}
          paddingHorizontal={5}
          fontSize={16}
          fontWeight="bold"
          color="grayCardBackground"
          value={businessId}
          onChange={onChangeBusinessId}
          iconProps={
            isUniqueId
              ? {
                  name: 'check',
                  color: 'greenColor',
                  margin: 0,
                  top: 14,
                }
              : undefined
          }
          spellCheck={false}
          autoCorrect={false}
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
        {/* ToDo: update with color selector, used account color instead temporarily */}
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
              style={{ backgroundColor: businessColor }}
            />
          </Container>
          <Container marginLeft={2}>
            <Text color="white" size="body" fontWeight="600" lineHeight={30}>
              {businessColor}
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
