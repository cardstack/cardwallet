import React, { useRef, useCallback, useMemo } from 'react';
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
import { ColorTypes, colors } from '@cardstack/theme';
import { getValidColorHexString } from '@cardstack/utils';

const UniqueCheckValidIconProps = {
  name: 'check' as IconName,
  color: 'greenColor' as ColorTypes,
  margin: 0,
  top: 14,
};

const UniqueCheckInvalidIconProps = {
  name: 'x' as IconName,
  color: 'error' as ColorTypes,
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

const TextErrorProps = {
  color: 'errorLight' as ColorTypes,
  fontSize: 11,
  fontWeight: '600' as any,
  letterSpacing: 0.15,
  marginTop: 1,
};

const TextLabelProps = {
  color: 'white' as ColorTypes,
  fontSize: 13,
  fontWeight: '600' as any,
};

export const StepTwo = ({ goToNextStep }: ProgressStepProps) => {
  const {
    businessName,
    businessColor,
    businessId,
    isUniqueId,
    avatarName,
    errors,
    onChangeBusinessColor,
    onChangeBusinessName,
    onChangeBusinessId,
    onSubmitForm,
  } = useProfileForm({ onFormSubmitSuccess: goToNextStep });

  const businessNameRef = useRef<TextInput>(null);
  const businessIdRef = useRef<TextInput>(null);

  const onBusinessNameSubmitEditing = useCallback(
    () => businessIdRef?.current?.focus && businessIdRef.current.focus(),
    []
  );

  const onBusinessColorSubmitEditing = useCallback(
    () => businessNameRef?.current?.focus && businessNameRef.current.focus(),
    []
  );

  const businessIdIconProps = useMemo(
    () =>
      isUniqueId
        ? UniqueCheckValidIconProps
        : errors
        ? UniqueCheckInvalidIconProps
        : undefined,
    [isUniqueId, errors]
  );

  const validBusinessColor = getValidColorHexString(businessColor);

  return (
    <>
      <Container justifyContent="center" alignItems="center">
        <ContactAvatar
          color={validBusinessColor}
          size="large"
          value={avatarName}
          textColor={colors.white}
        />
      </Container>
      <Container>
        <Text color="white" fontWeight="bold" fontSize={20} textAlign="center">
          {strings.stepTwo.nameAndIdForProfile}
        </Text>
      </Container>
      <Container paddingHorizontal={5} marginTop={5}>
        {/* ToDo: update with color selector, used account color instead temporarily */}
        <Text {...TextLabelProps} marginBottom={1}>
          {strings.stepTwo.iconColor}
        </Text>
        <Container position="relative">
          <Input
            borderColor="buttonSecondaryBorder"
            value={businessColor}
            onChange={onChangeBusinessColor}
            onSubmitEditing={onBusinessColorSubmitEditing}
            returnKeyType="next"
            {...InputCommonProps}
            paddingLeft={13}
          />
          <Container
            width={30}
            height={30}
            borderRadius={4}
            backgroundColor="white"
            borderWidth={1}
            borderColor="buttonSecondaryBorder"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            left={10}
            top={10}
          >
            <Container
              width={20}
              height={20}
              style={{ backgroundColor: validBusinessColor }}
            />
          </Container>
        </Container>
        <Container
          justifyContent="space-between"
          flexDirection="row"
          marginTop={4}
          marginBottom={1}
        >
          <Text {...TextLabelProps}>{`${strings.stepTwo.businessName}*`}</Text>
          <Text color="white" size="xs">
            {strings.stepTwo.required}
          </Text>
        </Container>
        <Input
          textContentType="name"
          borderColor={errors?.businessName ? 'error' : 'buttonSecondaryBorder'}
          value={businessName}
          onChange={onChangeBusinessName}
          onSubmitEditing={onBusinessNameSubmitEditing}
          returnKeyType="next"
          {...InputCommonProps}
        />
        {errors?.businessName ? (
          <Text {...TextErrorProps}>{errors.businessName}</Text>
        ) : null}
        <Container
          justifyContent="space-between"
          flexDirection="row"
          marginTop={4}
          marginBottom={1}
        >
          <Text {...TextLabelProps}>{`${strings.stepTwo.uniqueId}*`}</Text>
          <Text color="white" size="xs">
            {strings.stepTwo.required}
          </Text>
        </Container>
        <Input
          autoCapitalize="none"
          textContentType="username"
          borderColor={errors?.businessId ? 'error' : 'buttonSecondaryBorder'}
          value={businessId}
          onChange={onChangeBusinessId}
          onSubmitEditing={onSubmitForm}
          iconProps={businessIdIconProps}
          ref={businessIdRef}
          returnKeyType="done"
          {...InputCommonProps}
        />
        {errors?.businessId ? (
          <Text {...TextErrorProps}>{errors.businessId}</Text>
        ) : (
          <Text size="xxs" color="grayText" textAlign="left" marginTop={1}>
            {strings.stepTwo.uniqueIdDescription}
          </Text>
        )}
      </Container>
      <Container alignItems="center" paddingTop={4}>
        <Button onPress={onSubmitForm} disabled={!!errors}>
          {errors
            ? strings.buttons.completeToContinue
            : strings.buttons.continue}
        </Button>
      </Container>
    </>
  );
};
