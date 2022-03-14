import React, { useRef, useCallback } from 'react';
import { TextInput } from 'react-native';
import { useProfileForm } from '../useProfileForm';
import { strings } from '.';
import {
  Button,
  Container,
  IconName,
  Input,
  ProgressStepProps,
  Text,
} from '@cardstack/components';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import { ColorTypes } from '@cardstack/theme';

const UniqueCheckIconProps = {
  name: 'check' as IconName,
  color: 'greenColor' as ColorTypes,
  margin: 0,
  top: 14,
};

const InputCommonProps = {
  borderRadius: 6,
  paddingVertical: 3,
  paddingHorizontal: 5,
  fontSize: 16,
  borderWidth: 1,
  fontWeight: 'bold' as any,
  color: 'grayCardBackground' as ColorTypes,
  spellCheck: false,
  autoCorrect: false,
  blurOnSubmit: false,
};

export const StepTwo = ({ goToNextStep }: ProgressStepProps) => {
  const {
    businessName,
    businessColor,
    businessId,
    isUniqueId,
    avatarName,
    errors,
    onChangeBusinessName,
    onChangeBusinessId,
    onSubmitForm,
  } = useProfileForm({ onFormSubmitSuccess: goToNextStep });

  const businessIdRef = useRef<TextInput>(null);

  const onBusinessNameSubmitEditing = useCallback(
    () => businessIdRef?.current?.focus && businessIdRef.current.focus(),
    []
  );

  return (
    <>
      <Container>
        <Text color="white" fontWeight="bold" fontSize={20} textAlign="center">
          {strings.nameAndIdForProfile}
        </Text>
        <Text color="grayText" marginTop={1} textAlign="center">
          {strings.profileSubText}
        </Text>
      </Container>
      <Container justifyContent="center" alignItems="center" marginTop={5}>
        <ContactAvatar
          color={businessColor}
          size="large"
          value={avatarName}
          textColor="#fff"
        />
      </Container>
      <Container paddingHorizontal={5} marginTop={5}>
        <Text color="white" size="xs" fontWeight="600" marginBottom={2}>
          {strings.businessName}
        </Text>
        <Input
          placeholder="Enter Business Name"
          textContentType="name"
          borderColor={errors?.businessName ? 'error' : 'buttonSecondaryBorder'}
          value={businessName}
          onChange={onChangeBusinessName}
          onSubmitEditing={onBusinessNameSubmitEditing}
          {...InputCommonProps}
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
          borderColor={errors?.businessId ? 'error' : 'buttonSecondaryBorder'}
          value={businessId}
          onChange={onChangeBusinessId}
          onSubmitEditing={onSubmitForm}
          iconProps={isUniqueId ? UniqueCheckIconProps : undefined}
          {...InputCommonProps}
          ref={businessIdRef}
        />
        <Text size="xxs" color="grayText" textAlign="left" marginTop={1}>
          {strings.uniqueIdDescription}
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
      <Container alignItems="center" paddingTop={4}>
        <Button onPress={onSubmitForm}>{strings.continueButton}</Button>
      </Container>
    </>
  );
};
