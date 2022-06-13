import { useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  Button,
  CenteredContainer,
  Container,
  SafeAreaView,
  Text,
} from '@cardstack/components';
import { useBottomToast } from '@cardstack/hooks';
import { RouteType } from '@cardstack/navigation/types';

import { useClipboard } from '@rainbow-me/hooks';

import { strings } from './strings';

interface SeedPhraseBackupParams {
  seedPhrases: string[];
}

const SeedPhraseBackup = () => {
  const { params } = useRoute<RouteType<SeedPhraseBackupParams>>();
  const { setClipboard } = useClipboard();
  const { ToastComponent, showToast } = useBottomToast();

  const copySeedPhrase = useCallback(
    (item: string) => () => {
      setClipboard(item);

      showToast({
        label: `Copied to clipboard`,
      });
    },
    [setClipboard, showToast]
  );

  const renderSeedPhrases = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={copySeedPhrase(item)}>
        <CenteredContainer
          borderWidth={1}
          borderColor="teal"
          borderRadius={10}
          marginBottom={6}
          paddingHorizontal={4}
          paddingTop={4}
          paddingBottom={5}
        >
          <Text color="white">{item}</Text>
        </CenteredContainer>
      </TouchableOpacity>
    ),
    [copySeedPhrase]
  );

  const onPress = useCallback(() => {
    showToast({
      label: `Go Back`,
    });
  }, [showToast]);

  return (
    <SafeAreaView
      backgroundColor="backgroundDarkPurple"
      flex={1}
      alignItems="center"
      paddingBottom={18}
    >
      <StatusBar barStyle="light-content" />
      <Container paddingVertical={4} paddingHorizontal={4}>
        <Text fontSize={24} marginTop={8} color="white">
          {strings.title}
        </Text>
        <Text fontSize={16} marginTop={4} marginBottom={4} color="white">
          {strings.subtitle}
        </Text>
        <FlatList
          data={params?.seedPhrases || []}
          renderItem={renderSeedPhrases}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        />
      </Container>
      <Button onPress={onPress}>{strings.button}</Button>

      <ToastComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 24,
  },
});

export default SeedPhraseBackup;
