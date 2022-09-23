import React, { memo } from 'react';
import { Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import {
  Button,
  Checkbox,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  PasswordInput,
  ScrollView,
  Text,
} from '@cardstack/components';
import { Device } from '@cardstack/utils';

import { strings } from './strings';
import { useBackupCloudPasswordScreen } from './useBackupCloudPasswordScreen';

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
    marginBottom: 50,
  },
  scrollView: {
    marginBottom: 50,
  },
  passwordInput: {
    marginBottom: 5,
  },
});

const BackupCloudPasswordScreen = () => {
  const {
    onChangeText,
    isValid,
    password,
    onChangeConfirmation,
    isValidConfirmation,
    confirmation,
    onCheckboxPress,
    checked,
    isSubmitDisabled,
    passwordRef,
    confirmPasswordRef,
    onPasswordSubmit,
  } = useBackupCloudPasswordScreen();

  return (
    <PageWithStackHeader showSkip={false}>
      <ScrollView
        flex={1}
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          style={styles.keyboardAvoidView}
          behavior="position"
          keyboardVerticalOffset={Device.isIOS ? 100 : 0}
        >
          <Container width="80%" marginBottom={7}>
            <Text variant="pageHeader" paddingBottom={4}>
              {strings.title}
            </Text>
            <Text color="grayText" letterSpacing={0.4}>
              {strings.description}
            </Text>
          </Container>
          <Container>
            <PasswordInput
              containerProps={styles.passwordInput}
              validationMessage={strings.passwordValidation}
              isValid={isValid}
              onChangeText={onChangeText}
              value={password}
              ref={passwordRef}
              returnKeyType="next"
              textContentType="newPassword"
              onSubmitEditing={onPasswordSubmit}
              placeholder={strings.placeholders.password}
            />
            <PasswordInput
              validationMessage={strings.confirmPasswordValidation}
              isValid={isValidConfirmation}
              onChangeText={onChangeConfirmation}
              value={confirmation}
              ref={confirmPasswordRef}
              returnKeyType="done"
              placeholder={strings.placeholders.confirm}
              onSubmitEditing={Keyboard.dismiss}
            />
          </Container>
        </KeyboardAvoidingView>
      </ScrollView>
      <PageWithStackHeaderFooter>
        <Container
          borderTopWidth={1}
          borderTopColor="blueDarkest"
          paddingVertical={3}
        >
          <Checkbox
            isSelected={checked}
            onPress={onCheckboxPress}
            checkboxPosition="left"
          >
            <Text size="xs" marginRight={6} color="white">
              {strings.terms}
            </Text>
          </Checkbox>
          <Button marginTop={4} disabled={isSubmitDisabled}>
            {strings.btn}
          </Button>
        </Container>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupCloudPasswordScreen);
