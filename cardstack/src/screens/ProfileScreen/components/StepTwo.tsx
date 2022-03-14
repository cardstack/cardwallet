import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { useProfileForm } from '../helper';
import { StepActionType, strings, exampleMerchantData } from '.';
import {
  Button,
  Container,
  Text,
  Input,
  ScrollView,
} from '@cardstack/components';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import { Device, screenHeight } from '@cardstack/utils';
import { useAccountProfile } from '@rainbow-me/hooks';

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
    flexGrow: 1,
  },
});

export const StepTwo = ({ goToNextStep }: StepActionType) => {
  const { accountName } = useAccountProfile();
  const [isSubmitPressed, setIsSubmitPressed] = useState(false);

  const keyboardOffset = screenHeight * 0.1 + 16 + 40;

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
      goToNextStep?.();
    }
  }, [errors, isUniqueId, goToNextStep]);

  return (
    <KeyboardAvoidingView
      behavior={Device.keyboardBehavior}
      style={styles.keyboardAvoidView}
      keyboardVerticalOffset={keyboardOffset}
    >
      <ScrollView flexGrow={1} contentContainerStyle={{ flexGrow: 1 }}>
        <Container flexGrow={1} height="100%" justifyContent="space-between">
          <Container>
            <Text
              color="white"
              fontWeight="bold"
              fontSize={20}
              textAlign="center"
            >
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
              value={
                businessName ||
                accountName ||
                exampleMerchantData.merchantInfo.name
              }
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
                <Text
                  color="white"
                  size="body"
                  fontWeight="600"
                  lineHeight={30}
                >
                  {businessColor}
                </Text>
              </Container>
            </Container>
          </Container>
        </Container>
      </ScrollView>
      <Container alignItems="center" paddingTop={4}>
        <Button onPress={onPressContinue}>{strings.continueButton}</Button>
      </Container>
    </KeyboardAvoidingView>
  );
};
