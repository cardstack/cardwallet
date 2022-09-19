import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { memo, useCallback } from 'react';

import {
  Button,
  CenteredContainer,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  Text,
  SeedPhraseTable,
  TagCloud,
} from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';

import { strings } from './strings';
import { BackupManualSeedPhraseConfirmationParams } from './types';
import { shuffleSeedPhraseAsArray } from './utils';

const BackupSeedPhraseConfirmationScreen = () => {
  const { params } = useRoute<
    RouteType<BackupManualSeedPhraseConfirmationParams>
  >();

  const { seedPhrase = '', onConfirm } = params;

  const { dispatch: navDispatch } = useNavigation();

  const handleDonePress = useCallback(() => {
    // TODO
  }, []);

  const handleLaterOnPress = useCallback(() => {
    navDispatch(StackActions.popToTop());
  }, [navDispatch]);

  return (
    <PageWithStackHeader canGoBack={false}>
      <Container flex={1}>
        <Container width="90%">
          <Text variant="pageHeader" paddingBottom={4}>
            {strings.title}
          </Text>
          <Text color="grayText" letterSpacing={0.4}>
            {strings.description}
          </Text>
        </Container>
        <SeedPhraseTable seedPhrase={seedPhrase} />
        <TagCloud tags={shuffleSeedPhraseAsArray(seedPhrase)} />
      </Container>
      <PageWithStackHeaderFooter>
        <CenteredContainer>
          <Button onPress={handleDonePress}>{strings.doneBtn}</Button>
        </CenteredContainer>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(BackupSeedPhraseConfirmationScreen);
