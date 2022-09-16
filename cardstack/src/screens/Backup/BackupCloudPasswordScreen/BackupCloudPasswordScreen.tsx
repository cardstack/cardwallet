import { eq } from 'lodash';
import React, { memo } from 'react';

import {
  Button,
  Checkbox,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  PasswordInput,
  ScrollView,
  Text,
  usePasswordInput,
} from '@cardstack/components';
import {
  hasAtLeastOneDigit,
  matchMinLength,
} from '@cardstack/utils/validators';

import { strings } from './strings';

const layouts = {
  scrollView: {
    marginBottom: 50,
  },
  passwordInput: {
    marginBottom: 5,
  },
};

const BackupCloudPasswordScreen = () => {
  const { onChangeText, isValid, password } = usePasswordInput({
    validation: (text: string) =>
      hasAtLeastOneDigit(text) && matchMinLength(text, 8),
  });

  const {
    onChangeText: onChangeConfirmation,
    isValid: isValidConfirmation,
    password: confirmation,
  } = usePasswordInput({
    validation: (text: string) => matchMinLength(text, 1) && eq(password, text),
  });

  return (
    <PageWithStackHeader showSkip={false}>
      <ScrollView
        flex={1}
        contentContainerStyle={layouts.scrollView}
        showsVerticalScrollIndicator={false}
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
            containerProps={layouts.passwordInput}
          />
          <PasswordInput
            validationMessage={strings.confirmPasswordValidation}
            onChangeText={onChangeConfirmation}
            isValid={isValidConfirmation}
            value={confirmation}
          />
        </Container>
      </ScrollView>
      <PageWithStackHeaderFooter>
        <Container
          borderTopWidth={1}
          borderTopColor="blueDarkest"
          paddingVertical={3}
        >
          <Checkbox onPress={() => undefined} checkboxPosition="left">
            <Text size="xs" marginRight={6} color="white">
              {strings.terms}
            </Text>
          </Checkbox>
          <Button marginTop={4}>{strings.btn}</Button>
        </Container>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupCloudPasswordScreen);
