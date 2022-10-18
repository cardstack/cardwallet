import React, { memo } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import {
  Button,
  CenteredContainer,
  Container,
  Icon,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  PasswordInput,
  Text,
} from '@cardstack/components';
import { Device } from '@cardstack/utils';

import { strings } from './strings';
import { useBackupRestoreCloudScreen } from './useBackupRestoreCloudScreen';

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
    marginBottom: 50,
  },
});

const BackupRestoreCloudScreen = () => {
  const {
    onChangeText,
    password,
    isSubmitDisabled,
    handleRestoreOnPress,
  } = useBackupRestoreCloudScreen();

  return (
    <PageWithStackHeader showSkip={false}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidView}
        behavior="position"
        keyboardVerticalOffset={Device.defaultKeyboardVerticalOffset}
      >
        <Container width="80%" marginBottom={7}>
          <Text variant="pageHeader">{strings.title}</Text>
          <Text color="grayText" letterSpacing={0.4} marginTop={4}>
            {strings.description}
          </Text>
        </Container>
        <Container>
          <PasswordInput
            autoFocus
            onChangeText={onChangeText}
            value={password}
            onSubmitEditing={handleRestoreOnPress}
            placeholder={strings.inputPlaceholder}
          />
        </Container>
      </KeyboardAvoidingView>
      <PageWithStackHeaderFooter>
        <Container paddingVertical={3}>
          <CenteredContainer flexDirection="row" marginBottom={2}>
            <Icon flex={0.12} name="warning" stroke="black" iconSize="medium" />
            <Container flex={1}>
              <Text size="xs" color="white">
                {strings.disclaimer}
              </Text>
            </Container>
          </CenteredContainer>
          <Button
            marginTop={4}
            disabled={isSubmitDisabled}
            onPress={handleRestoreOnPress}
          >
            {strings.primaryBtn}
          </Button>
        </Container>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupRestoreCloudScreen);
