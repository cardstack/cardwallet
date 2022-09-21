import React, { memo } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';

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
              validationMessage={strings.passwordValidation}
              onChangeText={onChangeText}
              isValid={isValid}
              value={password}
              containerProps={styles.passwordInput}
              returnKeyType="next"
            />
            <PasswordInput
              validationMessage={strings.confirmPasswordValidation}
              onChangeText={onChangeConfirmation}
              isValid={isValidConfirmation}
              value={confirmation}
              returnKeyType="done"
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
