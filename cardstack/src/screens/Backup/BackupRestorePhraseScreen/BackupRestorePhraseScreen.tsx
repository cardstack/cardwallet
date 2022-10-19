import React, { memo } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  PhraseInput,
  Text,
} from '@cardstack/components';

import { strings } from './strings';
import { useBackupRestorePhraseScreen } from './useBackupRestorePhraseScreen';

const BackupRestorePhraseScreen = () => {
  const {
    handlePhraseTextChange,
    isPhraseComplete,
    isPhraseWrong,
  } = useBackupRestorePhraseScreen();

  return (
    <PageWithStackHeader showSkip={false}>
      <Container flex={1}>
        <Container width="90%" marginBottom={8}>
          <Text variant="pageHeader" paddingBottom={2}>
            {strings.title}
          </Text>
          <Text color="grayText" letterSpacing={0.4}>
            {strings.description}
          </Text>
        </Container>
        <Container width="100%" paddingTop={4}>
          <PhraseInput
            onChangeText={handlePhraseTextChange}
            showAsError={isPhraseWrong}
          />
        </Container>
      </Container>
      <PageWithStackHeaderFooter>
        <CenteredContainer>
          {isPhraseWrong ? (
            <Button variant="red">{strings.resetButton}</Button>
          ) : (
            <Button blocked={!isPhraseComplete}>{strings.doneButton}</Button>
          )}
        </CenteredContainer>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupRestorePhraseScreen);
