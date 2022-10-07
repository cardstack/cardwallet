import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { ListFooter, ListItem } from '../list';
import { deleteAllBackups } from '@cardstack/models/rn-cloud';
import { Routes } from '@cardstack/navigation';
import GanacheUtils, { restartApp } from '@cardstack/utils';
import { resetWallet } from '@rainbow-me/model/wallet';
import { clearImageMetadataCache } from '@rainbow-me/redux/imageMetadata';

const DeveloperSettings = () => {
  const { navigate } = useNavigation();

  const connectToGanache = useCallback(async () => {
    GanacheUtils.connect(() => {
      navigate(Routes.HOME_SCREEN);
    });
  }, [navigate]);

  return (
    <ScrollView testID="developer-settings-modal">
      <ListItem label="💥 Clear async storage" onPress={AsyncStorage.clear} />
      <ListItem
        label="📷️ Clear Image Metadata Cache"
        onPress={clearImageMetadataCache}
      />
      <ListItem
        label="💣 Reset Wallet"
        onPress={resetWallet}
        testID="reset-keychain-section"
      />
      <ListItem label="🔄 Restart app" onPress={restartApp} />
      <ListItem label="🗑️ Remove all backups" onPress={deleteAllBackups} />
      <ListItem
        label="🤷 Restore default experimental config"
        onPress={() => AsyncStorage.removeItem('experimentalConfig')}
      />
      <ListItem
        label="‍👾 Connect to ganache"
        onPress={connectToGanache}
        testID="ganache-section"
      />
      <ListFooter />
    </ScrollView>
  );
};

export default DeveloperSettings;
