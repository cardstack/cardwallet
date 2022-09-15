import { eq } from 'lodash';
import React, { memo, useMemo } from 'react';

import {
  Button,
  Checkbox,
  Container,
  PageWithStackHeader,
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

  const footer = useMemo(
    () => (
      <Container
        borderTopWidth={1}
        borderTopColor="networkBadge"
        paddingVertical={3}
      >
        <Checkbox onPress={() => undefined} checkboxPosition="left">
          <Text size="xs" marginRight={6} color="white">
            {strings.terms}
          </Text>
        </Checkbox>
        <Button marginTop={4}>{strings.btn}</Button>
      </Container>
    ),
    []
  );

  return (
    <PageWithStackHeader showSkip={false} footer={footer}>
      <ScrollView
        flex={1}
        contentContainerStyle={{ paddingBottom: 50 }}
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
            containerProps={{ marginBottom: 5 }}
          />
          <PasswordInput
            validationMessage={strings.confirmPasswordValidation}
            onChangeText={onChangeConfirmation}
            isValid={isValidConfirmation}
            value={confirmation}
          />
        </Container>
      </ScrollView>
    </PageWithStackHeader>
  );
};

export default memo(BackupCloudPasswordScreen);
