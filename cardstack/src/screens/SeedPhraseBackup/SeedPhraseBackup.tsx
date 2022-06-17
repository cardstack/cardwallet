import { useNavigation, useRoute } from '@react-navigation/native';
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
import { useCopyToast } from '@cardstack/hooks';
import { RouteType } from '@cardstack/navigation/types';

import { strings } from './strings';
import { SeedPhraseBackupFlow, SeedPhraseBackupParams } from './types';

const SeedPhraseBackup = () => {
  const { goBack } = useNavigation();

  const { params } = useRoute<RouteType<SeedPhraseBackupParams>>();
  const { seedPhrases, onSuccess, flow = SeedPhraseBackupFlow.backup } = params;

  const { CopyToastComponent, copyToClipboard } = useCopyToast({});

  const renderSeedPhrases = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => copyToClipboard(item)}>
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
    [copyToClipboard]
  );

  const onPress = useCallback(() => {
    onSuccess?.();
    goBack();
  }, [goBack, onSuccess]);

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
          {strings[flow].title}
        </Text>
        <Text fontSize={16} marginTop={4} marginBottom={4} color="white">
          {strings[flow].subtitle}
        </Text>
        <FlatList
          data={seedPhrases || []}
          renderItem={renderSeedPhrases}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        />
      </Container>
      <Button onPress={onPress}>{strings[flow].button}</Button>

      <CopyToastComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 24,
  },
});

export default SeedPhraseBackup;
